import { useState, useRef } from 'react';
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

  // 음성 녹음 관련 상태
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

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

      // STT 결과를 입력창에 표시
      setInputText(response.data.text || response.data.return_object?.recognized || '');
    } catch (err) {
      setError('음성 인식 중 오류가 발생했습니다.');
      console.error('STT error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 실제 번역 로직
  const executeTranslate = async (inputText) => {
    if (!inputText.trim()) {
      setError('번역할 문장을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/translation', {
        sentence: inputText
      });

      setTranslatedText(response.data.translation || response.data);
    } catch (err) {
      setError('번역 중 오류가 발생했습니다.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedTranslateRef = useRef(null);

  if (!debouncedTranslateRef.current) {
    debouncedTranslateRef.current = debounce((inputText) => {
      executeTranslate(inputText);
    }, 300);
  }

  const handleTranslate = () => {
    debouncedTranslateRef.current(inputText);
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
  };

  // 음성 입력 버튼 핸들러
  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleChange = (e) => {
    setInputText(e.target.value);
  };

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
        <p>사투리를 표준어로 번역해보세요</p>
      </div>

      <div className="translator-body">
        <div className="input-section">
          <div className="section-header">
            <h2>사투리 입력</h2>
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
            placeholder="번역할 사투리를 입력하세요..."
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
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>표준어 번역</h2>
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
