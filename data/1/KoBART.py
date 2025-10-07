from transformers import AutoTokenizer

# 사전 학습된 KoBART 모델 및 토크나이저 불러오기
model_name = 'gogamza/kobart-base-v2'
tokenizer = AutoTokenizer.from_pretrained(model_name)

def preprocess_function(examples):
    inputs = ["<s>" + doc + "</s>" for doc in examples["source"]]
    labels = ["<s>" + doc + "</s>" for doc in examples["target"]]
    model_inputs = tokenizer(inputs, max_length=128, truncation=True, padding="max_length")
    with tokenizer.as_target_tokenizer():
        labels_encodings = tokenizer(labels, max_length=128, truncation=True, padding="max_length")
    model_inputs["labels"] = labels_encodings["input_ids"]
    return model_inputs

# 전체 데이터셋에 전처리 함수 적용..
print("데이터셋 토큰화 작업을 시작합니다...")
tokenized_datasets = dataset_dict.map(preprocess_function, batched=True, remove_columns=dataset_dict["train"].column_names)
print("\n토큰화 작업 완료!")
