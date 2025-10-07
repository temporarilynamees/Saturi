import pandas as pd
from datasets import Dataset, DatasetDict

# 데이터 파일 경로
file_path = '/content/drive/MyDrive/final_data_no_outliers.xlsx'

# 데이터 불러오기
print("데이터 파일을 불러오는 중...")
df = pd.read_excel(file_path)

# 표준어(source)와 제주어(target) 컬럼 지정 및 통합
df_person = df[['표준어_사람_통합', '제주어_사람_통합']].rename(columns={'표준어_사람_통합': 'source', '제주어_사람_통합': 'target'})
df_system = df[['표준어_시스템_통합', '제주어_시스템_통합']].rename(columns={'표준어_시스템_통합': 'source', '제주어_시스템_통합': 'target'})
combined_df = pd.concat([df_person, df_system], ignore_index=True)

# 결측치 제거
combined_df.dropna(subset=['source', 'target'], inplace=True)
combined_df = combined_df[combined_df['source'].str.len() > 0]
print(f"총 {len(combined_df)}개의 문장 쌍으로 학습을 시작합니다.")

# Pandas DataFrame -> Hugging Face Dataset 변환
full_dataset = Dataset.from_pandas(combined_df)

# 7:3 비율로 학습/검증 데이터셋 분할
train_test_split = full_dataset.train_test_split(test_size=0.3, seed=42) # 재현성을 위해 seed 추가
dataset_dict = DatasetDict({
    'train': train_test_split['train'],
    'validation': train_test_split['test']
})

print("\n데이터셋 분할 완료:")
print(dataset_dict)
