from transformers import AutoModelForSeq2SeqLM, Seq2SeqTrainingArguments, Seq2SeqTrainer

# 💡 [가장 중요!] 각자 자신의 실험을 식별할 수 있도록 이름을 정합니다.
# wandb 대시보드와 구글 드라이브 폴더명에 이 이름이 사용됩니다.
# 형식 예시: "실험자이름-핵심파라미터-값"
my_run_name = "Chulsoo-lr_3e-5-epochs_12"


# 모델 초기화
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

# TPU 학습을 위한 TrainingArguments 설정
training_args = Seq2SeqTrainingArguments(
    # 💡 결과가 저장될 경로. run_name에 따라 자동으로 생성됩니다.
    output_dir=f"/content/drive/MyDrive/kobart_experiments/{my_run_name}",
    optim="adafactor",

    # 💡 wandb에 보고하고, run_name을 설정합니다.
    report_to="wandb",
    run_name=my_run_name,

    # --- 각자 다르게 설정할 하이퍼파라미터 ---
    learning_rate=3e-5,
    num_train_epochs=12,
    per_device_train_batch_size=32,
    weight_decay=0.01,

    # --- 공통 설정 ---
    tpu_num_cores=8,
    per_device_eval_batch_size=32,
    eval_strategy="epoch",
    save_strategy="epoch",
    logging_steps=200,
    save_total_limit=2,
    predict_with_generate=True,
    load_best_model_at_end=True,
    metric_for_best_model="eval_loss",
    greater_is_better=False,
)

# Trainer 객체 생성
trainer = Seq2SeqTrainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_datasets["train"],
    eval_dataset=tokenized_datasets["validation"],
    tokenizer=tokenizer,
)

# 🚀 모델 학습 시작
print(f"✅ 실험 '{my_run_name}' 학습을 시작합니다!")
trainer.train()

print(f"🎉 실험 '{my_run_name}' 학습 완료! 모델이 Drive에 저장되었습니다.")
