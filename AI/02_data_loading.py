import pandas as pd
from sklearn.datasets import load_iris

# 1. 데이터셋 불러오기
# scikit-learn에 내장된 Iris(붓꽃) 데이터셋을 불러옵니다.
iris_dataset = load_iris()

# 2. Pandas DataFrame으로 변환
# 데이터를 다루기 쉬운 테이블 형태(DataFrame)로 만듭니다.
# iris_dataset.data는 피처(꽃받침 길이/너비 등) 데이터입니다.
# iris_dataset.feature_names는 피처의 이름입니다.
df = pd.DataFrame(iris_dataset.data, columns=iris_dataset.feature_names)

# 'target' 열을 추가하여 품종 정보를 저장합니다.
# iris_dataset.target은 품종을 나타내는 숫자(0, 1, 2)입니다.
df['target'] = iris_dataset.target

# 3. 데이터 확인
# 데이터의 처음 5개 행을 출력
print("--- 데이터 샘플 (상위 5개) ---")
print(df.head())
print("\n" + "="*30 + "\n")

# 데이터의 기본 통계 정보 출력
print("--- 기본 통계 정보 ---")
print(df.describe())
print("\n" + "="*30 + "\n")

# 데이터의 요약 정보(결측치, 데이터 타입 등) 출력....
print("--- 데이터 요약 정보 ---")
df.info()
