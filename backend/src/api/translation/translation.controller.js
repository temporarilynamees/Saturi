const service = require('./service');

async function translateSentence(req, res, next) {
    try {
        const dialectSentence = req.body.sentence;
        const translateSentence = await service.translateSentence(dialectSentence);
    }
    catch (error) {
        next(error);
    }
}