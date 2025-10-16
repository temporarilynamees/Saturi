import { useState, useRef, useCallback, useMemo } from 'react';
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

  // TTS 관련 상태 - 입력과 출력을 분리하여 관리
  const [isInputPlaying, setIsInputPlaying] = useState(false);
  const [isOutputPlaying, setIsOutputPlaying] = useState(false);
  const inputAudioRef = useRef(null);
  const outputAudioRef = useRef(null);





  // --- 공통 오디오 재생 함수 ---
  const playAudio = async ({ text, audioRef, setIsPlaying }) => {
    if (!text.trim()) {
      setError('재생할 텍스트가 없습니다.');
      return;
    }

    // 이미 재생 중이면 중지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setError('');

    try {
      // 💡 [수정] 항상 새로 만든 커스텀 TTS API를 호출하도록 고정합니다.
      const apiUrl = '/api/custom-tts';
      const requestData = { text };

      const response = await axios.post(apiUrl, requestData, {
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




  // --- 입력 텍스트 재생 핸들러 ---
  const handlePlayInput = () => {
    playAudio({
      text: inputText,
      audioRef: inputAudioRef,
      setIsPlaying: setIsInputPlaying,
    });
  };


  // --- 번역된 텍스트(출력) 재생 핸들러 ---
  const handlePlayOutput = () => {
    playAudio({
      text: translatedText,
      audioRef: outputAudioRef,
      setIsPlaying: setIsOutputPlaying,
    });
  };

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

  // 번역 실행 함수
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
        direction: direction
      });

      setTranslatedText(response.data.translation || response.data);
    } catch (err) {
      setError('번역 중 오류가 발생했습니다.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [direction]);

  const debouncedTranslate = useMemo(
    () => debounce((text) => executeTranslate(text), 300),
    [executeTranslate]
  );

  const handleTranslate = () => {
    debouncedTranslate(inputText);
  };

  const stopAllAudio = () => {
    if (inputAudioRef.current) {
      inputAudioRef.current.pause();
      inputAudioRef.current = null;
      setIsInputPlaying(false);
    }
    if (outputAudioRef.current) {
      outputAudioRef.current.pause();
      outputAudioRef.current = null;
      setIsOutputPlaying(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
    stopAllAudio();
  };

  const handleSwapDirection = () => {
    setDirection(prev => prev === 'jeju_to_std' ? 'std_to_jeju' : 'jeju_to_std');
    setInputText('');
    setTranslatedText('');
    setError('');
    stopAllAudio();
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
    <div className="translator-container">
      <div className="translator-header">
        <h1>🗣️ 사투리 번역기</h1>
        <p>{direction === 'jeju_to_std' ? '사투리를 표준어로 번역해보세요' : '표준어를 사투리로 번역해보세요'}</p>
      </div>

      <div className="translator-body">
        <div className="input-section">
          <div className="section-header">
            <h2>{direction === 'jeju_to_std' ? '사투리 입력' : '표준어 입력'}</h2>
            <div>
              {inputText && (
                <button
                  className={`play-button ${isInputPlaying ? 'playing' : ''}`}
                  onClick={handlePlayInput}
                  disabled={!inputText.trim()}
                  title={isInputPlaying ? '재생 중지' : '입력 내용 듣기'}
                >
                  {isInputPlaying ? '⏸️ 중지' : '🔊 듣기'}
                </button>
              )}
              <button
                className={`voice-button ${isRecording ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                disabled={isLoading}
                title={isRecording ? '녹음 중지' : '음성 입력'}
              >
                {isRecording ? '🎤 녹음 중...' : '🎤 음성 입력'}
              </button>
            </div>
          </div>
          <textarea
            className="input-textarea"
            placeholder={direction === 'jeju_to_std' ? '번역할 사투리를 입력하세요...' : '번역할 표준어를 입력하세요...'}
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
            <h2>{direction === 'jeju_to_std' ? '표준어 번역' : '사투리 번역'}</h2>
            {translatedText && (
              <button
                className={`play-button ${isOutputPlaying ? 'playing' : ''}`}
                onClick={handlePlayOutput}
                disabled={!translatedText.trim()}
                title={isOutputPlaying ? '재생 중지' : '번역 결과 듣기'}
              >
                {isOutputPlaying ? '⏸️ 중지' : '🔊 듣기'}
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
  );
};

export default DialectTranslator;