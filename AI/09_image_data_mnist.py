import tensorflow as tf
import matplotlib.pyplot as plt

# 1. MNIST 데이터셋 불러오기
# TensorFlow/Keras에 내장된 MNIST 데이터셋 로드
# x_train, y_train: 학습용 이미지와 레이블.
# x_test, y_test: 테스트용 이미지와 레이블
(x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()

# 2. 데이터 확인
print(f"학습용 이미지 데이터 형태: {x_train.shape}")
print(f"학습용 레이블 데이터 형태: {y_train.shape}")
print(f"첫 번째 이미지의 레이블: {y_train[0]}")

# 3. 데이터 정규화
# 픽셀 값을 0~255에서 0~1 사이의 값으로 변환
x_train = x_train / 255.0
x_test = x_test / 255.0

# 4. 이미지 시각화
# 첫 10개의 이미지를 화면에 출력
plt.figure(figsize=(10, 5))
for i in range(10):
    plt.subplot(2, 5, i + 1)
    plt.imshow(x_train[i], cmap='gray')
    plt.title(f"Label: {y_train[i]}")
    plt.axis('off') # 축 정보 숨기기....
plt.tight_layout()
plt.show()
