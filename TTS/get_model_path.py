# get_model_path.py
from TTS.utils.manage import ModelManager

# 파인튜닝에 사용할 사전 학습 모델 이름
model_name = "tts_models/ko/kss/vits"

# 모델 매니저를 통해 모델 다운로드 및 경로 확인
manager = ModelManager()

# 모델을 다운로드하고, 모델 파일(.pth)과 설정 파일(.json)의 경로를 가져옵니다.
model_path, config_path, _ = manager.download_model(model_name)

print(f"'{model_name}' 모델의 경로를 찾았습니다.")
print(f"Model_file Path: {model_path}")
print("\n아래 Model_file Path 전체 경로를 복사하여 다음 단계의 명령어에 사용하세요.")
