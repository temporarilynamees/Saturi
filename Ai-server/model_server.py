# Ai-server/model_server.py

import torch
from flask import Flask, request, jsonify, send_file
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import io
import soundfile as sf
import os

# --- VITS 관련 모듈 임포트 ---
import commons
import utils
from models import SynthesizerTrn
from text import text_to_sequence
# 💡 [수정] config.json 대신 text/symbols.py에서 symbols 리스트를 직접 가져옵니다.
from text.symbols import symbols

# --- Flask 앱 초기화 ---
app = Flask(__name__)

# --- 전역 변수로 모델 및 토크나이저 로드 ---
print("서버 시작... 모델을 로딩합니다.")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"사용 장치: {str(device).upper()}")

# --- 1. 번역 모델 로드 ---
print("번역 모델 로딩 중...")
model_dir_std_to_jeju = "./bidirectional_models_gpu/std_to_jeju/"
tokenizer_std_to_jeju = AutoTokenizer.from_pretrained(model_dir_std_to_jeju)
model_std_to_jeju = AutoModelForSeq2SeqLM.from_pretrained(model_dir_std_to_jeju)
model_std_to_jeju.to(device)

model_dir_jeju_to_std = "./bidirectional_models_gpu/jeju_to_std/"
tokenizer_jeju_to_std = AutoTokenizer.from_pretrained(model_dir_jeju_to_std)
model_jeju_to_std = AutoModelForSeq2SeqLM.from_pretrained(model_dir_jeju_to_std)
model_jeju_to_std.to(device)
print("번역 모델 로딩 완료.")

# --- 2. 커스텀 VITS 모델 로드 ---
print("커스텀 TTS(VITS) 모델 로딩 중...")
config_path = "./vits_models/friend_config.json"
# ⚠️ vits_model_path의 파일명은 실제 사용하는 모델 파일명으로 수정해야 합니다!
vits_model_path = "./vits_models/G_77000.pth" 

hps = utils.get_hparams_from_file(config_path)

# 💡 [수정] config.json의 symbols 대신, 파일에서 직접 불러온 symbols 리스트를 사용하도록 덮어씁니다.
hps.symbols = symbols

# 이제 len(symbols)는 141이 되어 모델 구조가 일치하게 됩니다.
net_g = SynthesizerTrn(
    len(symbols),
    hps.data.filter_length // 2 + 1,
    hps.train.segment_size // hps.data.hop_length,
    n_speakers=hps.data.n_speakers,
    **hps.model
).to(device)
_ = net_g.eval()

_ = utils.load_checkpoint(vits_model_path, net_g, None)
print("커스텀 TTS(VITS) 모델 로딩 완료.")

# --- 텍스트를 시퀀스로 변환하는 함수 ---
def get_text(text, hps):
    text_norm = text_to_sequence(text, hps.data.text_cleaners)
    if hps.data.add_blank:
        text_norm = commons.intersperse(text_norm, 0)
    text_norm = torch.LongTensor(text_norm)
    return text_norm

# --- 번역 API ---
@app.route('/translate', methods=['POST'])
def handle_translation():
    try:
        data = request.json
        sentence = data['sentence']
        direction = data['direction']
        
        model, tokenizer = (model_std_to_jeju, tokenizer_std_to_jeju) if direction == 'std_to_jeju' else (model_jeju_to_std, tokenizer_jeju_to_std)
        
        input_text = "<s>" + sentence + "</s>"
        inputs = tokenizer(input_text, return_tensors="pt").to(device)

        outputs = model.generate(
            inputs.input_ids, max_length=128, num_beams=5, early_stopping=True
        )
        translated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return jsonify({"translation": translated_text})

    except Exception as e:
        print(f"Error during translation: {e}")
        return jsonify({"error": "번역 중 오류가 발생했습니다."}), 500

# --- [신규] VITS TTS 생성 API ---
@app.route('/generate-tts', methods=['POST'])
def handle_vits_tts():
    try:
        data = request.json
        text = data.get('text')
        if not text:
            return jsonify({"error": "text 필드가 필요합니다."}), 400

        # VITS 모델로 음성 생성
        stn_tst = get_text(text, hps)
        with torch.no_grad():
            x_tst = stn_tst.to(device).unsqueeze(0)
            x_tst_lengths = torch.LongTensor([stn_tst.size(0)]).to(device)
            audio = net_g.infer(x_tst, x_tst_lengths, noise_scale=.667, noise_scale_w=0.8, length_scale=1)[0][0,0].data.cpu().float().numpy()

        # 메모리 버퍼에 WAV 파일 생성 후 전송
        buffer = io.BytesIO()
        sf.write(buffer, audio, hps.data.sampling_rate, format='WAV')
        buffer.seek(0)
        
        return send_file(buffer, mimetype='audio/wav')

    except Exception as e:
        print(f"Error during VITS TTS generation: {e}")
        return jsonify({"error": "TTS 생성 중 오류가 발생했습니다."}), 500

# --- 서버 실행 ---
if __name__ == '__main__':
    print("모든 모델 로딩 완료. API 요청 대기 중...")
    app.run(host='0.0.0.0', port=8000, debug=False)