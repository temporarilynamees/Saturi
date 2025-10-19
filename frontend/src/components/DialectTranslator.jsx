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


// === 퀴즈 관련 state 추가 ===
  const [isQuizMode, setIsQuizMode] = useState(false); // 퀴즈 모드 여부
  const [currentQuestion, setCurrentQuestion] = useState(''); // 현재 문제 (사투리)
  const [userAnswer, setUserAnswer] = useState(''); // 사용자가 입력한 답
  const [quizResult, setQuizResult] = useState(null); // 채점 결과

  // === 퀴즈 기능 함수들 추가 ===
  const handleGetQuiz = async () => {
    setIsLoading(true);
    setError('');
    stopAllAudio(); // 퀴즈 시작 시 모든 오디오 중지
    try {
      const response = await axios.get('/api/quiz/new');
      setIsQuizMode(true);
      setCurrentQuestion(response.data.dialect);
      setUserAnswer('');
      setTranslatedText('');
      setQuizResult(null);
      setInputText(response.data.dialect);
    } catch (err) {
      setError("퀴즈 문제를 불러오는 데 실패했습니다.");
      console.error("Quiz fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckAnswer = async () => {
    if (!userAnswer.trim()) {
      setError("정답을 입력해주세요.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/quiz/check', {
        dialectQuestion: currentQuestion,
        userAnswer: userAnswer
      });
      setQuizResult(response.data);
    } catch (err) {
      setError("정답 확인 중 오류가 발생했습니다.");
      console.error("Answer check error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturnToTranslate = () => {
    setIsQuizMode(false);
    setCurrentQuestion('');
    setUserAnswer('');
    setQuizResult(null);
    setInputText('');
    setTranslatedText('');
    setError('');
    stopAllAudio(); // 번역기로 돌아갈 때 모든 오디오 중지
  };

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
// 사투리 헤더 수정, 왼쪽 입력창 수정 (input-section), 가운데 버튼 수정(arrow-section), 오른쪽 결과창 수정 (output-section)
  return (
    <div className="translator-container">
<div className="translator-header"> 
  <h1>🗣️ 사투리 번역기</h1>
  <p>{isQuizMode ? '사투리 퀴즈를 풀어보세요!' : (direction === 'jeju_to_std' ? '사투리를 표준어로 번역해보세요' : '표준어를 사투리로 번역해보세요')}</p>
  <button className="mode-toggle-button" onClick={isQuizMode ? handleReturnToTranslate : handleGetQuiz}>
    {isQuizMode ? '번역기로 돌아가기' : '✍️ 사투리 퀴즈 풀기'}
  </button>
</div>

      <div className="translator-body"> 
<div className="input-section">
  <div className="section-header">
    <h2>{isQuizMode ? '문제 (사투리)' : (direction === 'jeju_to_std' ? '사투리 입력' : '표준어 입력')}</h2>
    {!isQuizMode && ( // 퀴즈 모드가 아닐 때만 버튼들 표시
      <div>
        {inputText && (
          <button className={`play-button ${isInputPlaying ? 'playing' : ''}`} onClick={handlePlayInput} disabled={!inputText.trim()} title={isInputPlaying ? '재생 중지' : '입력 내용 듣기'}>
            {isInputPlaying ? '⏸️ 중지' : '🔊 듣기'}
          </button>
        )}
        <button className={`voice-button ${isRecording ? 'listening' : ''}`} onClick={handleVoiceInput} disabled={isLoading} title={isRecording ? '녹음 중지' : '음성 입력'}>
          {isRecording ? '🎤 녹음 중...' : '🎤 음성 입력'}
        </button>
      </div>
    )}
  </div>
  <textarea
    className="input-textarea"
    placeholder={isQuizMode ? '' : '번역할 내용을 입력하세요...'}
    value={isQuizMode ? currentQuestion : inputText}
    onChange={handleChange}
    onCompositionStart={handleCompositionStart}
    onCompositionEnd={handleCompositionEnd}
    onKeyDown={handleKeyDown}
    disabled={isLoading || isQuizMode}
  />
  {!isQuizMode && (
    <div className="char-count">{inputText.length} / 500</div>
  )}
</div>
        
<div className="arrow-section">
  <button className="translate-button" onClick={isQuizMode ? handleCheckAnswer : handleTranslate} disabled={isLoading || (isQuizMode ? !userAnswer.trim() : !inputText.trim())}>
    {isLoading ? <span className="loading-spinner">⏳</span> : <span>→</span>}
  </button>
  {!isQuizMode && (
    <button className="swap-button" onClick={handleSwapDirection} disabled={isLoading} title="번역 방향 전환">
      🔄
    </button>
  )}
</div>

<div className="output-section">
  <div className="section-header">
    <h2>{isQuizMode ? '정답 입력 (표준어)' : (direction === 'jeju_to_std' ? '표준어 번역' : '사투리 번역')}</h2>
    {!isQuizMode && translatedText && (
      <button className={`play-button ${isOutputPlaying ? 'playing' : ''}`} onClick={handlePlayOutput} disabled={!translatedText.trim()} title={isOutputPlaying ? '재생 중지' : '번역 결과 듣기'}>
        {isOutputPlaying ? '⏸️ 중지' : '🔊 듣기'}
      </button>
    )}
  </div>
  {isQuizMode ? (
    <textarea
      className="input-textarea"
      placeholder="정답을 여기에 입력하세요..."
      value={userAnswer}
      onChange={(e) => setUserAnswer(e.target.value)}
      disabled={isLoading}
    />
  ) : (
    <div className="output-textarea">{translatedText || '번역 결과가 여기에 표시됩니다...'}</div>
  )}
</div>
</div> {/* ▼▼▼ 이 닫는 태그(</div>) 한 줄을 추가하세요! ▼▼▼ */}

      {/* 하단 메시지 및 버튼 영역 시작 */}
      {error && !isQuizMode && (
  <div className="error-message">⚠️ {error}</div>
)}

{isQuizMode && quizResult && (
  <div className={`quiz-result ${quizResult.correct ? 'correct' : 'incorrect'}`}>
    {quizResult.correct ? <p>🎉 정답입니다!</p> : <p>❌ 틀렸습니다. (정답: {quizResult.answer})</p>}
  </div>
)}

<div className="action-buttons">
  <button className="clear-button" onClick={isQuizMode ? () => {setUserAnswer(''); setQuizResult(null);} : handleClear} disabled={isQuizMode ? !userAnswer : (!inputText && !translatedText)}>
    🔄 {isQuizMode ? '답안 지우기' : '초기화'}
  </button>
</div>
    </div>
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
    </>
  );
};

export default DialectTranslator;