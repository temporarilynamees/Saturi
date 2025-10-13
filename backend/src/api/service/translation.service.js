const axios = require('axios');

// AI 서버 설정
const AI_SERVER_URL = process.env.AI_SERVER_URL;;

/**
 * AI 서버를 통해 번역을 수행합니다.
 * @param {string} sentence - 번역할 문장
 * @param {string} direction - 번역 방향 ('jeju_to_std' 또는 'std_to_jeju')
 * @returns {Promise<string>} - 번역된 문장
 */
async function translateSentence(sentence, direction = 'jeju_to_std') {
    try {
        console.log(sentence, direction);
        // AI 서버로 번역 요청 (direction을 그대로 전달)
        const response = await axios.post(`${AI_SERVER_URL}/translate`, {
            sentence: sentence,
            direction: direction
        }, {
            timeout: 100000, // 100초 타임아웃
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.translation) {
            return response.data.translation;
        } else {
            throw new Error('Invalid response from AI server');
        }

    } catch (error) {
        console.error('Translation error:', error.message);

        // AI 서버 연결 실패 시 fallback (기존 사전 기반 번역)
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            console.warn('AI server unavailable, using fallback dictionary translation');
            return fallbackTranslate(sentence, direction);
        }

        throw error;
    }
}

/**
 * AI 서버 연결 실패 시 사용할 fallback 번역 (기존 사전 기반)
 */
function fallbackTranslate(sentence, direction) {
    const sentenceList = sentence.split(' ');
    const translatedWords = sentenceList.map(word => {
        if (direction === 'std_to_jeju') {
            const translation = dialectDictionary.jeju.patterns
                .find(pattern => pattern.standard === word);
            return translation ? translation.dialect : word;
        } else { // jeju_to_std
            const translation = dialectDictionary.jeju.patterns
                .find(pattern => pattern.dialect === word);
            return translation ? translation.standard : word;
        }
    });
    return translatedWords.join(' ');
}

const dialectDictionary = {
    jeju: {
        patterns: [
            // 인사말
            {dialect: "안뇽하시게", standard: "안녕하세요"},
            {dialect: "안뇽히게시서", standard: "안녕히 가세요"},
            {dialect: "어디가게", standard: "어디 가세요"},

            // 일상 표현
            {dialect: "했수깡", standard: "했어"},
            {dialect: "햄시니", standard: "합니다"},
            {dialect: "헙서", standard: "합시다"},
            {dialect: "곱다", standard: "예쁘다"},
            {dialect: "생이", standard: "것이"},
            {dialect: "이녁", standard: "당신"},
            {dialect: "우리", standard: "저희"},

            // 동사 활용
            {dialect: "가게", standard: "가요"},
            {dialect: "왔수게", standard: "왔어요"},
            {dialect: "먹엉", standard: "먹고"},
            {dialect: "보라게", standard: "보세요"},
            {dialect: "들어옵서", standard: "들어오세요"},
            {dialect: "앉아시게", standard: "앉아 계세요"},

            // 형용사
            {dialect: "제법", standard: "꽤"},
            {dialect: "거시기", standard: "그것"},
            {dialect: "어멍", standard: "어머니"},
            {dialect: "아방", standard: "아버지"},
            {dialect: "하르방", standard: "할아버지"},
            {dialect: "할망", standard: "할머니"},

            // 의문문
            {dialect: "뭐하게", standard: "뭐 해요"},
            {dialect: "언제게", standard: "언제요"},
            {dialect: "어디서게", standard: "어디서요"},
            {dialect: "왜게", standard: "왜요"},

            // 감탄사
            {dialect: "아이고마씀", standard: "아이고"},
            {dialect: "어라", standard: "어머"},
            {dialect: "혼저옵서예", standard: "어서 오세요"},

            // 음식 관련
            {dialect: "고기국수", standard: "돼지고기 국수"},
            {dialect: "빙떡", standard: "메밀전"},
            {dialect: "오메기떡", standard: "좁쌀떡"},
            {dialect: "한라봉", standard: "한라봉 (제주 특산 감귤)"},

            // 자연/지명
            {dialect: "오름", standard: "언덕"},
            {dialect: "잣성", standard: "돌담"},
            {dialect: "괸당", standard: "친척"},
            {dialect: "우영팟", standard: "텃밭"},

            // 기타 표현
            {dialect: "혼디", standard: "혼자"},
            {dialect: "사레", standard: "새로"},
            {dialect: "올레", standard: "골목길"},
            {dialect: "닥세", standard: "빨리"},
            {dialect: "멩질", standard: "바보"},
            {dialect: "고팍", standard: "마당"},
            {dialect: "당치", standard: "당근"},
            {dialect: "무사", standard: "왜"},
            {dialect: "지슥", standard: "지금"}
        ]
    },
}

module.exports = {
    translateSentence
}
