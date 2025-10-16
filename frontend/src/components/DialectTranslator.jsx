// DialectTranslator.jsx

import { useState, useRef, useCallback, useMemo } from 'react'; // useCallback, useMemo 추가
import axios from 'axios';
import './DialectTranslator.css';

// debounce 유틸 함수
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const DialectTranslator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [direction, setDirection] = useState('jeju_to_std');

  // 음성 녹음 관련 상태
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // TTS 관련 상태
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 음성 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError('마이크 접근 권한이 필요합니다.');
      console.error('Recording error:', err);
    }
  };

  // 음성 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // 백엔드로 오디오 전송
  const sendAudioToBackend = async (audioBlob) => {
    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('language_code', 'korean');

      const response = await axios.post('/api/stt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setInputText(response.data.text || response.data.return_object?.recognized || '');
    } catch (err) {
      setError('음성 인식 중 오류가 발생했습니다.');
      console.error('STT error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // TTS 음성 재생 함수
  const playTranslatedText = async () => {
    if (!translatedText.trim()) {
      setError('재생할 번역 결과가 없습니다.');
      return;
    }

    // 이미 재생 중이면 중지
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setError('');

    try {
      // direction에 따라 lang 설정
      const lang = direction === 'jeju_to_std' ? 'ko' : 'jje';

      const response = await axios.post('/api/tts', {
        text: translatedText,
        lang: lang,
        speaker: 'female_kr',
        speed: 1.0
      }, {
        responseType: 'blob'
      });

      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setError('음성 재생 중 오류가 발생했습니다.');
        setIsPlaying(false);
        audioRef.current = null;
      };

      await audio.play();
    } catch (err) {
      setError('음성 생성 중 오류가 발생했습니다.');
      console.error('TTS error:', err);
      setIsPlaying(false);
    }
  };

  //    direction 상태가 바뀔 때마다 이 함수가 최신 direction 값을 참조하여 재생성됩니다.
  const executeTranslate = useCallback(async (textToTranslate) => {
    if (!textToTranslate.trim()) {
      setError('번역할 문장을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/translation', {
        sentence: textToTranslate,
        direction: direction // 항상 최신 direction 값을 사용하게 됩니다.
      });

      setTranslatedText(response.data.translation || response.data);
    } catch (err) {
      setError('번역 중 오류가 발생했습니다.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [direction]); // 의존성 배열에 'direction'을 추가

  // 2. useMemo를 사용해 debounced 함수를 생성합니다.
  //    executeTranslate 함수가 변경될 때만 debounce 함수를 새로 만듭니다.
  const debouncedTranslate = useMemo(
    () => debounce((text) => executeTranslate(text), 300),
    [executeTranslate]
  );

  // 3. 기존의 복잡한 useRef 로직을 제거하고 간단하게 만듭니다.
  const handleTranslate = () => {
    debouncedTranslate(inputText);
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
    // 재생 중인 오디오 중지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  const handleSwapDirection = () => {
    setDirection(prev => prev === 'jeju_to_std' ? 'std_to_jeju' : 'jeju_to_std');
    setInputText('');
    setTranslatedText('');
    setError('');
    // 재생 중인 오디오 중지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => setIsComposing(false);
  const handleChange = (e) => setInputText(e.target.value);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleTranslate();
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="logo">MalMoe</div>
      </header>
      <div className="translator-container">
        <div className="translator-header">
          <h1>🗣️ 제주어 번역기</h1>
          <p>{direction === 'jeju_to_std' ? '제주어를 표준어로 번역해보세요' : '표준어를 제주어로 번역해보세요'}</p>
        </div>

      <div className="translator-body">
        <div className="input-section">
          <div className="section-header">
            <h2>{direction === 'jeju_to_std' ? '제주어 입력' : '표준어 입력'}</h2>
            <button
              className={`voice-button ${isRecording ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              disabled={isLoading}
              title={isRecording ? '녹음 중지' : '음성 입력'}
            >
              {isRecording ? '🎤 녹음 중...' : '🎤 음성 입력'}
            </button>
          </div>
          <textarea
            className="input-textarea"
            placeholder={direction === 'jeju_to_std' ? '번역할 제주어를 입력하세요...' : '번역할 표준어를 입력하세요...'}
            value={inputText}
            onChange={handleChange}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <div className="char-count">
            {inputText.length} / 500
          </div>
        </div>

        <div className="arrow-section">
          <button
            className="translate-button"
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
          >
            {isLoading ? (
              <span className="loading-spinner">⏳</span>
            ) : (
              <span>→</span>
            )}
          </button>
          <button
            className="swap-button"
            onClick={handleSwapDirection}
            disabled={isLoading}
            title="번역 방향 전환"
          >
            🔄
          </button>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>{direction === 'jeju_to_std' ? '표준어 번역' : '제주어 번역'}</h2>
            {translatedText && (
              <button
                className={`play-button ${isPlaying ? 'playing' : ''}`}
                onClick={playTranslatedText}
                disabled={!translatedText.trim()}
                title={isPlaying ? '재생 중지' : '음성으로 듣기'}
              >
                {isPlaying ? '⏸️ 중지' : '🔊 듣기'}
              </button>
            )}
          </div>
          <div className="output-textarea">
            {translatedText || '번역 결과가 여기에 표시됩니다...'}
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="action-buttons">
        <button
          className="clear-button"
          onClick={handleClear}
          disabled={!inputText && !translatedText}
        >
          🔄 초기화
        </button>
      </div>
      </div>
    </>
  );
};

export default DialectTranslator;
