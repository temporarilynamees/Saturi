const axios = require('axios');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const path = require('path');
const { correctJejuText } = require('./stt/jejuCorrection');

// 간단하게 ffmpeg를 이용해서 변환
ffmpeg.setFfmpegPath(ffmpegPath);

// 오디오 전처리 강화: 노이즈 제거 + 음량 정규화 + WAV 변환
function enhanceAudio(inputPath) {
    return new Promise((resolve, reject) => {
        const outputPath = inputPath.replace(/\.\w+$/, '-enhanced.wav');

        ffmpeg(inputPath)
            .toFormat('wav')
            .audioCodec('pcm_s16le')
            .audioFrequency(16000)  // ETRI API 권장 샘플레이트
            .audioChannels(1)       // 모노 채널
            // 오디오 필터 적용 (제주어 인식율 향상)
            .audioFilters([
                'highpass=f=200',                    // 200Hz 이하 저주파 노이즈 제거
                'lowpass=f=3000',                    // 3000Hz 이상 고주파 노이즈 제거
                'afftdn=nr=10:nf=-25',              // FFT 기반 노이즈 감소
                'loudnorm=I=-16:TP=-1.5:LRA=11'     // 음량 정규화 (EBU R128 표준)
            ])
            .on('start', (commandLine) => {
                console.log('오디오 전처리 시작:', commandLine);
            })
            .on('end', () => {
                console.log('오디오 전처리 완료:', outputPath);
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('오디오 전처리 에러:', err);
                reject(err);
            })
            .save(outputPath);
    });
}

// 하위 호환성을 위한 별칭 (기존 함수명 유지)
const convertToWav = enhanceAudio;

async function speechToText(file) {
    let wavPath = null;

    try {
        console.log('STT 처리 시작 - 원본 파일:', file.path);

        // 오디오 전처리 (노이즈 제거 + 음량 정규화 + WAV 변환)
        wavPath = await enhanceAudio(file.path);
        console.log('전처리된 오디오 크기:', fs.statSync(wavPath).size, 'bytes');

        // 변환된 WAV 파일을 Base64로 인코딩
        const audioBuffer = fs.readFileSync(wavPath);
        const base64Audio = audioBuffer.toString('base64');
        console.log('Base64 인코딩 완료 - 길이:', base64Audio.length);

        // ETRI API 요청
        console.log('ETRI API 요청 시작...');
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
                },
                timeout: 30000  // 30초 타임아웃
            }
        );

        console.log('ETRI API 응답 성공 - 상태:', response.status);

        // 제주어 후처리 보정 적용
        if (response.data && response.data.return_object && response.data.return_object.recognized) {
            const originalText = response.data.return_object.recognized;
            const correctedText = correctJejuText(originalText);

            // 보정된 텍스트로 교체
            response.data.return_object.recognized = correctedText;

            if (originalText !== correctedText) {
                console.log('제주어 보정 완료');
            }
        }

        // 임시 파일 정리
        fs.unlinkSync(file.path);
        if (wavPath && fs.existsSync(wavPath)) {
            fs.unlinkSync(wavPath);
        }

        return response.data;
    } catch (error) {
        console.error('STT 처리 에러:', error.message);

        if (error.response) {
            console.error('API 응답 상태:', error.response.status);
            console.error('API 응답 데이터:', error.response.data);
        } else if (error.code === 'ECONNABORTED') {
            console.error('⏱타임아웃 발생');
        }

        // 에러 발생 시에도 임시 파일 정리
        try {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            if (wavPath && fs.existsSync(wavPath)) fs.unlinkSync(wavPath);
        } catch (cleanupError) {
            console.error('임시 파일 정리 실패:', cleanupError.message);
        }

        throw error;
    }
}

module.exports = {
    speechToText
}