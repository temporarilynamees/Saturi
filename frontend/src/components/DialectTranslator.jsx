import { useState } from 'react';
import axios from 'axios';
import './DialectTranslator.css';

const DialectTranslator = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef(null);

  const handleTranslate = async () => {
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
  const debounce = () => {
    
  }
  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError('');
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

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setError('음성이 감지되지 않았습니다. 다시 시도해주세요.');
      } else if (event.error === 'not-allowed') {
        setError('마이크 권한이 필요합니다.');
      } else {
        setError('음성 인식 중 오류가 발생했습니다.');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceInput = () => {
    if (!speechSupported) {
      setError('이 브라우저는 음성 인식을 지원하지 않습니다.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
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
          </div>
          <div className="input-wrapper">
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
            <button
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              disabled={isLoading || !speechSupported}
              title={speechSupported ? '음성으로 입력하기' : '음성 인식 지원 안 됨'}
            >
              {isListening ? '⏹️' : '🎤'}
            </button>
          </div>
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
