import { useState, useEffect, useRef, useCallback } from 'react';

const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    // 브라우저 지원 확인
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setIsSupported(true);

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      // 음성 인식 설정
      recognitionRef.current.lang = 'ko-KR';
      recognitionRef.current.continuous = false; // 한 번만 인식
      recognitionRef.current.interimResults = true; // 중간 결과 표시
      recognitionRef.current.maxAlternatives = 5;

      // 음성 인식 결과 처리
      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptResult = event.results[current][0].transcript;
        setTranscript(transcriptResult);
      };

      // 음성 인식 종료
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      // 에러 처리
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);

        switch (event.error) {
          case 'no-speech':
            setError('음성이 감지되지 않았습니다. 다시 시도해주세요.');
            break;
          case 'audio-capture':
            setError('마이크를 사용할 수 없습니다.');
            break;
          case 'not-allowed':
            setError('마이크 권한이 필요합니다.');
            break;
          case 'network':
            setError('네트워크 연결을 확인해주세요.');
            break;
          default:
            setError('음성 인식 중 오류가 발생했습니다.');
        }
      };
    } else {
      setIsSupported(false);
      setError('이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 또는 Edge를 사용해주세요.');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // 음성 인식 시작
  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('음성 인식이 지원되지 않습니다.');
      return;
    }

    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError('');
      setIsListening(true);

      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsListening(false);
        setError('음성 인식을 시작할 수 없습니다.');
      }
    }
  }, [isSupported, isListening]);

  // 음성 인식 중지
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // 초기화
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError('');
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
};

export default useSpeechRecognition;
