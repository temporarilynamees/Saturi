import os
import random

# 설정값---
metadata_path = "dataset/metadata.csv"
train_ratio = 0.95
output_train_path = "dataset/train_list.txt"
output_val_path = "dataset/val_list.txt"

# 현재 스크립트 파일의 디렉토리를 기준으로 경로 설정
base_dir = os.path.dirname(os.path.abspath(__file__))
metadata_abs_path = os.path.join(base_dir, metadata_path)
output_train_abs_path = os.path.join(base_dir, output_train_path)
output_val_abs_path = os.path.join(base_dir, output_val_path)

# 데이터 읽기
with open(metadata_abs_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# 데이터 섞기
random.shuffle(lines)

# 데이터 분할
split_index = int(len(lines) * train_ratio)
train_lines = lines[:split_index]
val_lines = lines[split_index:]

# 학습용 리스트 저장
with open(output_train_abs_path, 'w', encoding='utf-8') as f:
    f.writelines(train_lines)

# 검증용 리스트 저장
with open(output_val_abs_path, 'w', encoding='utf-8') as f:
    f.writelines(val_lines)

print(f"데이터 분할 완료!")
print(f" - 학습용 데이터: {len(train_lines)}개, 경로: {output_train_path}")
print(f" - 검증용 데이터: {len(val_lines)}개, 경로: {output_val_path}")
