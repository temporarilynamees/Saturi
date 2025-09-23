import numpy as np
from sklearn.linear_model import LinearRegression
import joblib # 모델 저장을 위한 라이브러리

# --- 1. 모델 학습 및 저장 ---

# 1-1. 데이터 생성
X_train = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
y_train = np.array([2, 4, 5, 4, 5])

# 1-2. 모델 생성 및 학습
model = LinearRegression()
model.fit(X_train, y_train)

# 1-3. 모델 저장
# joblib.dump를 사용하여 학습된 모델 객체를 파일로 저장
model_filename = 'linear_regression_model.pkl'
joblib.dump(model, model_filename)

print(f"모델이 '{model_filename}' 파일로 저장되었습니다.")
print("-" * 30)


# --- 2. 저장된 모델 불러오기 및 사용 ---

# 2-1. 모델 불러오기
# 저장된 모델 파일을 불러와서 loaded_model 변수에 할당
loaded_model = joblib.load(model_filename)
print(f"'{model_filename}' 파일에서 모델을 불러왔습니다.")

# 2-2. 불러온 모델로 예측 수행
# 새로운 데이터
X_new = np.array([[6], [7]])
predictions = loaded_model.predict(X_new)

print(f"\n새로운 데이터 {X_new.flatten()}에 대한 예측:")
for val, pred in zip(X_new.flatten(), predictions):
    print(f"{val} 시간 공부했을 때 예상 점수: {pred:.2f}")
