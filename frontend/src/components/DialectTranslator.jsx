import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
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

  // 음성 인식 Hook
  const {
    isListening,
    transcript,
    isSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // 음성 인식 결과를 입력창에 반영
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // 음성 인식 에러 처리
  useEffect(() => {
    if (speechError) {
      setError(speechError);
    }
  }, [speechError]);

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
    resetTranscript();
  };

  // 음성 입력 버튼 핸들러
  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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
            {isSupported && (
              <button
                className={`voice-button ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                disabled={isLoading}
                title={isListening ? '음성 인식 중지' : '음성 입력'}
              >
                {isListening ? '🎤 인식 중...' : '🎤 음성 입력'}
              </button>
            )}
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
