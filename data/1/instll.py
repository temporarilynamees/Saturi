# TPU 관련 라이브러리 및 기타 필수 패키지 설치..
!pip install cloud-tpu-client==0.10 torch==2.0.0 torchvision==0.15.1 torch_xla[tpu]~=2.0.0 --quiet
!pip install transformers[torch] sentencepiece datasets openpyxl wandb
