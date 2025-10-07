from google.colab import drive
import wandb

# 구글 드라이브 마운트
drive.mount('/content/drive')

# wandb 로그인 (API 키 입력)
wandb.login()
