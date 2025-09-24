from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

# 1. 데이터 준비
iris = load_iris()
X = iris.data
y = iris.target

# 2. 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 3. 모델 생성 및 학습
# 의사결정나무(Decision Tree) 분류기 모델 생성
model = DecisionTreeClassifier()
# 학습용 데이터로 모델 학습
model.fit(X_train, y_train)

# 4. 예측
# 테스트 데이터로 품종 예측
predictions = model.predict(X_test)

# 5. 모델 평가
# 실제 값(y_test)과 예측 값(predictions)을 비교하여 정확도 계산..
accuracy = accuracy_score(y_test, predictions)
print(f"예측 결과 (처음 5개): {predictions[:5]}")
print(f"실제 값 (처음 5개): {y_test[:5]}")
print(f"모델 정확도: {accuracy * 100:.2f}%")
