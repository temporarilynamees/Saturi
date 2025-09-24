import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
import numpy as np

# 1. 데이터 준비 (XOR 문제)
# 입력 데이터
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], "float32")
# 출력 데이터 (정답)
y = np.array([[0], [1], [1], [0]], "float32")

# 2. 모델 구성
# 순차적인 층을 쌓아 모델을 만듦
model = Sequential()
# 첫 번째 은닉층: 8개의 뉴런, 활성화 함수는 'relu'
model.add(Dense(8, input_dim=2, activation='relu'))
# 출력층: 1개의 뉴런, 활성화 함수는 'sigmoid' (0과 1 사이의 값 출력)
model.add(Dense(1, activation='sigmoid'))

# 3. 모델 컴파일
# 모델의 학습 과정 설정
# optimizer: 손실 함수를 최소화하는 방법 (adam)
# loss: 손실 함수 (binary_crossentropy, 이진 분류에 사용)
# metrics: 평가 지표 (accuracy, 정확도)
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# 4. 모델 학습
# epochs: 전체 데이터를 몇 번 반복하여 학습할지 결정
# verbose=2: 각 에포크마다 로그를 출력
model.fit(X, y, epochs=1000, verbose=2)

# 5. 예측 및 평가
predictions = model.predict(X)
print("\n--- 예측 결과 ---")
# 예측값이 0.5보다 크면 1, 작으면 0으로 변환..
rounded_predictions = [round(x[0]) for x in predictions]
print(rounded_predictions)
