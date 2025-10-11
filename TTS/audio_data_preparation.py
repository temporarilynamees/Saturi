import os
import shutil
from pydub import AudioSegment
import whisper
from tqdm import tqdm

# --- FFmpeg 경로 직접 지정 (가장 먼저 설정해주세요) ------
# 1. 사용자의 PC에 설치된 ffmpeg.exe 파일의 전체 경로를 입력합니다.
# 2. 경로의 역슬래시(\)는 슬래시(/)로 바꾸거나, 역슬래시 두 개(\\)로 작성해야 합니다.
# 예시 1: "C:/ffmpeg/bin/ffmpeg.exe"
# 예시 2: "C:\\ffmpeg\\bin\\ffmpeg.exe"
AudioSegment.converter = "C:/ffmpeg-8.0-full_build/bin/ffmpeg.exe" # <--- 이 부분을 자신의 경로로 수정하세요!

# --- 설정 (사용자 환경에 맞게 수정해주세요) ---

# 1. 원본 m4a 파일들이 들어있는 최상위 폴더 경로
# 예: "C:/Users/YourName/Desktop/MyRecordings"
SOURCE_ROOT_DIR = "source_audio_files"

# 2. 변환된 wav 파일과 최종 텍스트 파일을 저장할 폴더 경로
# 이 폴더는 스크립트 실행 시 자동으로 생성됩니다.
OUTPUT_DIR = "processed_dataset"

# 3. Whisper 모델 선택 (tiny, base, small, medium, large)
# 'base' 모델이 속도와 성능 면에서 시작하기에 좋습니다.
# 한국어 인식률을 높이려면 'medium' 또는 'large'를 권장하지만, 처리 속도가 느려질 수 있습니다.
WHISPER_MODEL_SIZE = "medium"

# --- 스크립트 본문 (여기부터는 수정할 필요 없습니다) ---

def main():
    """
    오디오 전처리 및 STT 작업을 수행하는 메인 함수
    """
    print("=" * 50)
    print("TTS 데이터 전처리 스크립트를 시작합니다.")
    print(f"음성 파일 소스 경로: {os.path.abspath(SOURCE_ROOT_DIR)}")
    print(f"결과물 저장 경로: {os.path.abspath(OUTPUT_DIR)}")
    print(f"사용할 Whisper 모델: {WHISPER_MODEL_SIZE}")
    print("=" * 50)

    # 출력 폴더 및 wav 파일 저장 폴더 생성
    output_wavs_dir = os.path.join(OUTPUT_DIR, "wavs")
    os.makedirs(output_wavs_dir, exist_ok=True)
    
    # 1. 모든 .m4a 파일 경로 찾기
    print("\n[1단계] 원본 음성 파일(.m4a)을 탐색합니다...")
    m4a_files = []
    for root, _, files in os.walk(SOURCE_ROOT_DIR):
        for file in files:
            if file.lower().endswith(".m4a"):
                m4a_files.append(os.path.join(root, file))

    if not m4a_files:
        print(f"'{SOURCE_ROOT_DIR}' 폴더에서 .m4a 파일을 찾을 수 없습니다.")
        print("경로를 확인하거나 폴더에 음성 파일을 넣어주세요.")
        return
        
    print(f"총 {len(m4a_files)}개의 .m4a 파일을 찾았습니다.")

    # 2. Whisper 모델 로드
    print(f"\n[2단계] Whisper 모델({WHISPER_MODEL_SIZE})을 로드합니다. 잠시 기다려주세요...")
    try:
        model = whisper.load_model(WHISPER_MODEL_SIZE)
    except Exception as e:
        print(f"Whisper 모델 로드 중 오류 발생: {e}")
        print("인터넷 연결을 확인하거나, 모델 이름을 확인해주세요.")
        return
        
    print("모델 로드가 완료되었습니다.")
    
    # 3. 파일 변환, STT 및 라벨링 작업
    print("\n[3단계] 파일 변환 및 텍스트 추출 작업을 시작합니다.")
    
    metadata = []
    file_counter = 1
    
    # tqdm을 사용하여 진행 상황 표시
    for source_path in tqdm(m4a_files, desc="오디오 처리 중"):
        try:
            # 새로운 파일 이름 생성 (예: audio_00001.wav)
            new_filename = f"audio_{file_counter:05d}.wav"
            dest_path = os.path.join(output_wavs_dir, new_filename)

            # m4a를 wav로 변환하여 저장
            audio = AudioSegment.from_file(source_path, format="m4a")
            # TTS 학습을 위해 단일 채널(mono), 22050Hz 샘플링 속도로 표준화
            audio = audio.set_channels(1).set_frame_rate(22050)
            audio.export(dest_path, format="wav")

            # Whisper로 텍스트 추출
            result = model.transcribe(dest_path, language="ko")
            transcribed_text = result["text"].strip()
            
            # 메타데이터 추가 (파일이름|텍스트)
            metadata.append(f"{new_filename}|{transcribed_text}")
            
            file_counter += 1

        except Exception as e:
            tqdm.write(f"오류 발생: {source_path} 처리 중 문제 발생 - {e}")
            continue

    # 4. 메타데이터 파일 저장
    metadata_path = os.path.join(OUTPUT_DIR, "metadata.csv")
    with open(metadata_path, 'w', encoding='utf-8') as f:
        for line in metadata:
            f.write(line + '\n')
            
    print("\n[4단계] 모든 작업이 완료되었습니다!")
    print("-" * 50)
    print(f"변환된 .wav 파일은 '{os.path.abspath(output_wavs_dir)}' 폴더에 저장되었습니다.")
    print(f"텍스트 라벨링 파일은 '{os.path.abspath(metadata_path)}' 파일로 저장되었습니다.")
    print("-" * 50)
    print("\n※ 중요: metadata.csv 파일을 열어 텍스트가 정확한지 반드시 검토하고 수정해주세요.")
    print("모델의 인식 오류나 불필요한 단어(음, 아...)를 정리하면 TTS 모델의 품질이 크게 향상됩니다.")


if __name__ == '__main__':
    # 스크립트 실행 전, 소스 폴더가 존재하는지 확인
    if not os.path.isdir(SOURCE_ROOT_DIR):
        print(f"오류: 소스 폴더 '{SOURCE_ROOT_DIR}'를 찾을 수 없습니다.")
        print("스크립트와 같은 위치에 폴더를 생성하고 음성 파일들을 넣어주세요.")
    else:
        main()

