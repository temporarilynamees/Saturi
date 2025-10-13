# model_server.py

import torch
from flask import Flask, request, jsonify
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# --- Flask 앱 초기화 ---
app = Flask(__name__)

# --- 전역 변수로 모델 및 토크나이저 로드 ---
# 이 과정은 서버 시작 시 한 번만 실행됩니다.
print("서버 시작... 모델을 로딩합니다.")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"사용 장치: {str(device).upper()}")

# 1. 표준어 -> 제주어 모델
model_dir_std_to_jeju = "./bidirectional_models_gpu/std_to_jeju/"
tokenizer_std_to_jeju = AutoTokenizer.from_pretrained(model_dir_std_to_jeju)
model_std_to_jeju = AutoModelForSeq2SeqLM.from_pretrained(model_dir_std_to_jeju)
model_std_to_jeju.to(device)

# 2. 제주어 -> 표준어 모델
model_dir_jeju_to_std = "./bidirectional_models_gpu/jeju_to_std/"
tokenizer_jeju_to_std = AutoTokenizer.from_pretrained(model_dir_jeju_to_std)
model_jeju_to_std = AutoModelForSeq2SeqLM.from_pretrained(model_dir_jeju_to_std)
model_jeju_to_std.to(device)

print("모델 로딩 완료. API 요청 대기 중...")

# --- 번역 함수 정의 ---
def translate(text, direction):
    """
    입력된 텍스트와 번역 방향에 따라 적절한 모델을 사용하여 번역을 수행합니다.
    direction: 'std_to_jeju' 또는 'jeju_to_std'
    """
    model = None
    tokenizer = None

    if direction == 'std_to_jeju':
        model = model_std_to_jeju
        tokenizer = tokenizer_std_to_jeju
    elif direction == 'jeju_to_std':
        model = model_jeju_to_std
        tokenizer = tokenizer_jeju_to_std
    else:
        raise ValueError("Unsupported direction")

    input_text = "<s>" + text + "</s>"
    inputs = tokenizer(input_text, return_tensors="pt").to(device)

    outputs = model.generate(
        inputs.input_ids,
        max_length=128,
        num_beams=5,
        early_stopping=True
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)

# --- API 엔드포인트 정의 ---
@app.route('/translate', methods=['POST'])
def handle_translation():
    try:
        data = request.json
        if not data or 'sentence' not in data or 'direction' not in data:
            return jsonify({"error": "sentence와 direction 필드가 필요합니다."}), 400

        sentence = data['sentence']
        direction = data['direction'] # 'std_to_jeju' 또는 'jeju_to_std'

        # 번역 수행
        translated_text = translate(sentence, direction)

        return jsonify({"translation": translated_text})

    except Exception as e:
        print(f"Error during translation: {e}")
        return jsonify({"error": "번역 중 오류가 발생했습니다."}), 500

# --- 서버 실행 ---
if __name__ == '__main__':
    # 외부에서 접근 가능하도록 host='0.0.0.0' 사용, 포트는 8000번
    app.run(host='0.0.0.0', port=8000, debug=False)