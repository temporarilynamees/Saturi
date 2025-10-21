/**
 * 제주어 STT 후처리 사전
 * ETRI API가 잘못 인식한 제주어 표현을 올바르게 보정
 */

// 제주어 오인식 패턴 → 올바른 표현 매핑
const jejuCorrectionMap = {
    '먹은': '먹언',
    '먹으니': '먹언',
    '먹는이': '먹언',
    '하는이': '하영',
    '가는이': '가영',
    '오는이': '오영',
    '보는이': '보영',
    '앉은이': '앉언',
    '서는이': '서영',
    '참' : '촘',
    '하르방': '할망',
    '할아방': '할망',
    '혼저': '혼저',
    '옵서예': '옵서',
    '고냥': '경',
    '이서': '이서',
    '수다': '수다',
    '자기' : '자이',
    '안하는이': '안하영',
    '못하는이': '못하영',
    '아니하는이': '아니하영',
    '하면' : '하믄'
};

// 제주어 어미 패턈 (정규식 기반)
const jejuPatterns = [
    // "~는이" → "~영" 패턴
    { pattern: /(\w+)는이/g, replacement: '$1영' },
    { pattern: /(\w+)은이/g, replacement: '$1언' },

    // "~니" → "~ㄴ디" 패턴 (제주어 의문형)
    { pattern: /(\w+)니\?/g, replacement: '$1ㄴ디?' },

    // 기타 흔한 오인식 패턴
    { pattern: /먹언을/g, replacement: '먹언' },
    { pattern: /하영을/g, replacement: '하영' },
];

/**
 * 제주어 텍스트 보정 함수
 * @param {string} text - ETRI API에서 받은 원본 텍스트
 * @returns {string} - 보정된 텍스트
 */
function correctJejuText(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }

    let correctedText = text;
    let corrections = [];

    // 1단계: 사전 기반 보정
    for (const [wrong, correct] of Object.entries(jejuCorrectionMap)) {
        if (correctedText.includes(wrong)) {
            corrections.push(`"${wrong}" → "${correct}"`);
            correctedText = correctedText.replace(new RegExp(wrong, 'g'), correct);
        }
    }

    // 2단계: 정규식 패턴 기반 보정
    for (const { pattern, replacement } of jejuPatterns) {
        const matches = correctedText.match(pattern);
        if (matches) {
            corrections.push(`패턴 매칭: ${matches.join(', ')}`);
            correctedText = correctedText.replace(pattern, replacement);
        }
    }

    // 보정 내역 로깅
    if (corrections.length > 0) {
        console.log('제주어 보정 적용:');
        corrections.forEach(corr => console.log('  -', corr));
        console.log('원본:', text);
        console.log('결과:', correctedText);
    }

    return correctedText;
}

/**
 * 사용자 피드백을 통한 사전 학습 (추후 구현)
 * @param {string} original - 보정 전 텍스트
 * @param {string} corrected - 사용자가 수정한 텍스트
 */
function learnFromFeedback(original, corrected) {
    // TODO: 사용자 피드백을 DB에 저장하고 주기적으로 사전 업데이트
    console.log(' 학습 데이터 수집:', { original, corrected });
}

module.exports = {
    correctJejuText,
    learnFromFeedback,
    jejuCorrectionMap,
    jejuPatterns
};
