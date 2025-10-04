const service = require("./stt.service");

async function speechToText(req, res, next) {
    try {
        const {language_code, audio} = req.body;
        const response = await service.speechToText(language_code, audio);
        res.json(response);
    }
    catch (err) {
        res.status(500).json({
            error : err.message
        });
    }
}

module.exports = {
    speechToText
};