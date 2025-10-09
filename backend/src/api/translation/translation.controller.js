const service = require('./translation.service');

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