# 1. 필요한 라이브러리를 설치합니다.
print("필요한 라이브러리를 설치합니다...")
!pip install transformers torch sentencepiece pandas openpyxl

# 2. 필요한 모듈을 가져옵니다.
import pandas as pd
import torch
from transformers import pipeline
import os

# 구글 코랩 환경에서 파일 업로드/다운로드를 위한 모듈
try:
    from google.colab import files
except ImportError:
    print("구글 코랩 환경이 아닙니다. 파일 업로드/다운로드 기능은 수동으로 처리해야 합니다.")
    files = None

# --- 설정값 ---
INPUT_FILENAME = 'tttt11.xlsx'
CHECKPOINT_FILENAME = 'translation_checkpoint.xlsx' # 중간 저장 파일
OUTPUT_FILENAME = 'tttt11_jeju_translated.xlsx' # 최종 결과 파일
CHECKPOINT_INTERVAL = 50 # 몇 행마다 중간 저장할지 설정 (예: 50행)
# --- ---

# 3. GPU 사용 가능 여부 확인 (GPU 사용 시 훨씬 빠릅니다)
if torch.cuda.is_available():
    device = 0 # 0번 GPU 사용
    print(f"GPU를 사용합니다. Device: {torch.cuda.get_device_name(device)}")
else:
    device = -1 # CPU 사용
    print("CPU를 사용합니다. (GPU 런타임으로 변경하면 속도가 훨씬 빨라집니다)")

# 4. 번역 파이프라인 로드
print("\n번역 모델을 로드합니다. 잠시만 기다려주세요...")
translator = pipeline("text2text-generation", model="eunjin/kobart_jeju_translator", device=device)
print("모델 로딩이 완료되었습니다.")

# 5. 파일 준비 및 시작점 결정
df = None
start_row = 0

# 중간 저장 파일이 있는지 확인
if os.path.exists(CHECKPOINT_FILENAME):
    print(f"\n'{CHECKPOINT_FILENAME}' 파일이 존재합니다. 여기서부터 작업을 재개합니다.")
    df = pd.read_excel(CHECKPOINT_FILENAME)
    # 번역이 완료되지 않은 첫 행을 찾습니다.
    # 제주어_사람_1 칼럼이 비어있는 첫 행을 시작점으로 간주합니다.
    try:
        start_row = df[df['제주어_사람_1'].isnull() | (df['제주어_사람_1'] == '')].index[0]
        print(f"-> {start_row + 1}행부터 번역을 다시 시작합니다.")
    except IndexError:
        print("-> 모든 행의 번역이 이미 완료되었습니다!")
        start_row = len(df) # 이미 완료되었으므로 루프를 실행하지 않음
else:
    # 원본 파일을 업로드하고 로드
    if files:
        print(f"\n번역할 엑셀 파일('{INPUT_FILENAME}')을 업로드해주세요.")
        uploaded = files.upload()
        if INPUT_FILENAME not in uploaded:
            print(f"오류: '{INPUT_FILENAME}' 파일이 업로드되지 않았습니다.")
            # 파일이 없을 경우 여기서 중단
            exit()

    if os.path.exists(INPUT_FILENAME):
        print(f"'{INPUT_FILENAME}' 파일을 읽습니다.")
        df = pd.read_excel(INPUT_FILENAME)
    else:
        print(f"오류: '{INPUT_FILENAME}' 파일을 찾을 수 없습니다.")
        # 파일이 없을 경우 여기서 중단
        exit()

# 6. 칼럼 정의 및 생성
source_columns = ['사람문장1', '시스템문장1', '사람문장2', '시스템문장2', '사람문장3', '시스템문장3']
target_columns = ['제주어_사람_1', '제주어_시스템_1', '제주어_사람2', '제주어_시스템2', '제주어_사람_3', '제주어_시스템_3']

# df가 정상적으로 로드되었을 경우에만 칼럼 추가 진행
if df is not None:
    for col in target_columns:
        if col not in df.columns:
            df[col] = ""

# 7. 번역 작업 수행
if df is not None and start_row < len(df):
    print("\n=== 번역을 시작합니다 ===")
    total_rows = len(df)
    for index in range(start_row, total_rows):
        row = df.loc[index]
        print(f"[{index + 1}/{total_rows}] 행 번역 중...")

        # 각 칼럼 번역
        for source_col, target_col in zip(source_columns, target_columns):
            text_to_translate = row[source_col]
            if pd.notna(text_to_translate) and isinstance(text_to_translate, str) and text_to_translate.strip():
                try:
                    translated_result = translator(text_to_translate, max_length=128, truncation=True)
                    translated_text = translated_result[0]['generated_text']
                    df.loc[index, target_col] = translated_text
                except Exception as e:
                    print(f"  - [{source_col}] 번역 중 오류 발생: {e}")
                    df.loc[index, target_col] = "번역 오류"

        # 일정 간격으로 중간 저장
        if (index + 1) % CHECKPOINT_INTERVAL == 0:
            df.to_excel(CHECKPOINT_FILENAME, index=False, engine='openpyxl')
            print(f"*** {index + 1}행까지의 진행 상황을 '{CHECKPOINT_FILENAME}'에 저장했습니다. ***")

# 8. 최종 결과 저장 및 다운로드
if df is not None:
    # 최종적으로 모든 작업 완료 후 저장
    df.to_excel(OUTPUT_FILENAME, index=False, engine='openpyxl')
    print(f"\n\n=== 모든 번역이 완료되었습니다! 최종 결과가 '{OUTPUT_FILENAME}' 파일로 저장되었습니다. ===")

    # 코랩 환경에서 다운로드
    if files:
        print(f"'{OUTPUT_FILENAME}' 파일을 다운로드합니다.")
        files.download(OUTPUT_FILENAME)
        # 중간 저장 파일도 필요하다면 다운로드
        if os.path.exists(CHECKPOINT_FILENAME):
            files.download(CHECKPOINT_FILENAME)
