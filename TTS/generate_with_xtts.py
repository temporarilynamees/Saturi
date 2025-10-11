import os
from TTS.api import TTS

# 1. 사용할 모델 이름 (목록의 1번 모델)
model_name = "tts_models/multilingual/multi-dataset/xtts_v2"

# 2. 목소리 복제에 사용할 음성 파일 경로
#    가장 깨끗하게 녹음된 5~15초짜리 wav 파일 하나를 지정해주세요.
#    'dataset/wavs/' 폴더 안에 있는 파일 중 하나를 선택하면 됩니다.
reference_voice_path = "dataset/wavs/audio_00001.wav"

# 3. 음성으로 변환할 텍스트
text_to_speak = "안녕하세요. 이 목소리는 제 친구의 목소리를 복제해서 만들었어요. 정말 신기하지 않나요?"

# 4. 출력 파일 경로
output_wav_path = "xtts_output.wav"


# TTS 모델을 초기화합니다. (처음 실행 시 모델 다운로드로 인해 시간이 걸릴 수 있습니다)
# GPU 사용이 가능하면 gpu=True 로 설정하여 속도를 높일 수 있습니다.
print("XTTS 모델을 로드합니다...")
tts = TTS(model_name, gpu=True)
print("모델 로드 완료.")

# 음성 복제 및 생성 실행!
print(f"'{reference_voice_path}' 파일의 목소리를 참조하여 음성 생성을 시작합니다.")
tts.tts_to_file(
    text=text_to_speak,
    speaker_wav=reference_voice_path,
    language="ko",  # 한국어로 설정
    file_path=output_wav_path
)

print(f"음성 생성이 완료되었습니다! '{output_wav_path}' 파일을 확인해보세요.")
