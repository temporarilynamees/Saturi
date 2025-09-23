import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans

# 1. 데이터 생성
# 군집화를 위한 가상의 2차원 데이터 생성
# n_samples: 데이터 포인트 개수
# centers: 군집의 중심점 개수
# cluster_std: 군집 내 데이터의 표준편차
# random_state: 재현성을 위한 시드
X, _ = make_blobs(n_samples=300, centers=4, cluster_std=0.60, random_state=0)

# 2. 모델 생성 및 학습
# K-Means 모델 생성 (n_clusters=4 -> 4개의 군집으로 묶음)
kmeans = KMeans(n_clusters=4, random_state=0, n_init=10)
# 데이터에 대한 군집화 수행
kmeans.fit(X)

# 3. 결과 확인
# 각 데이터 포인트가 속한 군집의 레이블
labels = kmeans.labels_
# 군집의 중심점 좌표
centers = kmeans.cluster_centers_

# 4. 시각화
plt.scatter(X[:, 0], X[:, 1], c=labels, s=50, cmap='viridis')
plt.scatter(centers[:, 0], centers[:, 1], c='red', s=200, alpha=0.75, marker='X')
plt.title("K-Means Clustering")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.grid(True)
plt.show()
