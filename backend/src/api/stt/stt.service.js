const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

// WebM을 WAV로 변환하는 함수
function convertToWav(inputPath) {
    return new Promise((resolve, reject) => {
        const outputPath = inputPath.replace(/\.\w+$/, '-converted.wav');

        ffmpeg(inputPath)
            .toFormat('wav')
            .audioCodec('pcm_s16le')
            .audioFrequency(16000)
            .audioChannels(1)
            .on('end', () => {
                console.log('WebM → WAV 변환 완료:', outputPath);
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('변환 에러:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

async function speechToText(file) {
    try {
        // WebM을 WAV로 변환
        const wavPath = await convertToWav(file.path);

        // 변환된 WAV 파일을 Base64로 인코딩
        const audioBuffer = fs.readFileSync(wavPath);
        const base64Audio = audioBuffer.toString('base64');

        console.log('Base64 변환 완료:', base64Audio.substring(0, 50) + '...');
        console.log('Base64 총 길이:', base64Audio.length);
        console.log('ETRI API 요청 시작...');
        console.log('API URL:', process.env.API_URL);
        console.log('Language Code:', 'korean');

        // ETRI API 요청
        const response = await axios.post(
            process.env.API_URL,
            {
                argument: {
                    "language_code": "korean",
                    "audio": base64Audio
                }
            },
            {
                headers: {
                    'Authorization': process.env.ETRI_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('=== ETRI API 응답 ===');
        console.log('응답 상태:', response.status);
        console.log('응답 데이터:', JSON.stringify(response.data, null, 2));
        console.log('===================');

        fs.unlinkSync(file.path);
        fs.unlinkSync(wavPath);

        return response.data;
    } catch (error) {
        console.error('=== ETRI API 에러 ===');
        console.error('에러 메시지:', error.message);
        if (error.response) {
            console.error('응답 상태:', error.response.status);
            console.error('응답 데이터:', error.response.data);
        }
        console.error('===================');
        throw error;
    }
}

module.exports = {
    speechToText
}