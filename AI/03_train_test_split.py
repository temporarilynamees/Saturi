from sklearn.model_selection import train_test_split
from sklearn.datasets import load_iris

# 1. 데이터 준비
# Iris 데이터셋 불러오기
iris = load_iris()
X = iris.data  # 피처 데이터
y = iris.target # 타겟(레이블) 데이터

# 2. 데이터 분할
# train_test_split 함수를 사용하여 데이터를 학습용과 테스트용으로 나눔
# X_train, y_train: 모델 학습에 사용될 데이터
# X_test, y_test: 학습된 모델을 평가하는 데 사용될 데이터
# test_size=0.2: 전체 데이터 중 20%를 테스트 데이터로 사용
# random_state=42: 재현 가능성을 위해 난수 시드를 고정
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. 분할된 데이터 크기 확인......
print(f"원본 데이터 크기: {X.shape}")
print(f"학습용 데이터 크기: {X_train.shape}")
print(f"테스트용 데이터 크기: {X_test.shape}")
print("-" * 20)
print(f"원본 레이블 크기: {y.shape}")
print(f"학습용 레이블 크기: {y_train.shape}")
print(f"테스트용 레이블 크기: {y_test.shape}")
