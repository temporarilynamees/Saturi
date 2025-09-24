import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

# 1. 데이터 생성
# 공부 시간 (독립 변수)
X = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
# 시험 성적 (종속 변수)
y = np.array([2, 4, 5, 4, 5])

# 2. 모델 생성 및 학습
# 선형 회귀 모델 객체 생성
model = LinearRegression()
# 데이터(X, y)를 사용하여 모델 학습
model.fit(X, y)

# 3. 예측
# 공부 시간이 6시간일 때의 성적 예측
predicted_score = model.predict([[6]])
print(f"6시간 공부했을 때 예상 점수: {predicted_score[0]:.2f}")

# 4. 시각화
plt.scatter(X, y, label='Actual data') # 실제 데이터 점
plt.plot(X, model.predict(X), color='red', label='Regression line') # 학습된 회귀선
plt.xlabel("Study Hours")
plt.ylabel("Test Score")
plt.title("Study Hours vs Test Score")
plt.legend()
plt.grid(True)
plt.show()

# 학습된 모델의 기울기와 절편 출력..
print(f"기울기 (Coefficient): {model.coef_[0]:.2f}")
print(f"y절편 (Intercept): {model.intercept_:.2f}")
