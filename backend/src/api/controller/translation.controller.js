const service = require('../service/translation.service');

/**
 * @param {} req
 * @param {} res
 * @param {} next
 * @returns
 */
async function translateSentence(req, res, next) {
    try {
        const dialectSentence = req.body.sentence;
        const direction = req.body.direction;

        if (!dialectSentence || typeof dialectSentence !== 'string') {
            return res.status(400)
                .json({message: '문장이 필요합니다.'});
        }

        // direction 검증: jeju_to_std 또는 std_to_jeju만 허용
        if (!direction || !['jeju_to_std', 'std_to_jeju'].includes(direction)) {
            return res.status(400)
                .json({message: 'direction은 jeju_to_std 또는 std_to_jeju 여야 합니다.'});
        }

        const translateSentence = await service.translateSentence(dialectSentence, direction);
        return res.status(200)
            .json({translation: translateSentence});
    }
    catch (error) {
        next(error);
    }
}
module.exports = {
    translateSentence
}
