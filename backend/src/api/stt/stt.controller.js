const service = require("./stt.service");

async function speechToText(req, res, next) {
    try {
        // 파일 업로드 확인
        if (!req.file) {
            return res.status(400).json({ error: '오디오 파일이 필요합니다.' });
        }

        console.log('=== 파일 업로드 성공 ===');
        console.log('파일 경로:', req.file.path);
        console.log('파일 이름:', req.file.filename);
        console.log('파일 크기:', req.file.size, 'bytes');
        console.log('파일 타입:', req.file.mimetype);
        console.log('=======================');

        const response = await service.speechToText(req.file);
        res.json(response);
    }
    catch (err) {
        console.error('STT Error:', err);
        res.status(500).json({
            error : err.message
        });
    }
}

module.exports = {
    speechToText
};