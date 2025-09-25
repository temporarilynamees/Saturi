import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix, accuracy_score

# 1. 데이터 준비
cancer = load_breast_cancer()
X, y = cancer.data, cancer.target

# 2. 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=101)

# 3. 모델 학습
model = LogisticRegression(solver='liblinear')
model.fit(X_train, y_train)

# 4. 예측
predictions = model.predict(X_test)

# 5. 오차 행렬 생성 및 시각화
cm = confusion_matrix(y_test, predictions)
acc = accuracy_score(y_test, predictions)

print(f"모델 정확도: {acc*100:.2f}%")
print("\n오차 행렬 (Confusion Matrix):")
print(cm)

# Seaborn을 이용한 히트맵 시각화....
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=cancer.target_names, yticklabels=cancer.target_names)
plt.xlabel('Predicted Label')
plt.ylabel('True Label')
plt.title('Confusion Matrix')
plt.show()
