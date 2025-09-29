from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# 1. 텍스트 데이터 준비
sentences = [
    'I love my dog',
    'I love my cat',
    'You love my dog!',
    'Do you think my dog is amazing?'
]

# 2. 토큰화
# Tokenizer 객체 생성, num_words=100 -> 가장 빈도가 높은 100개 단어만 사용
tokenizer = Tokenizer(num_words=100, oov_token="<OOV>")

# 단어장(vocabulary) 생성
tokenizer.fit_on_texts(sentences)

# 단어와 인덱스 매핑 정보 출력
word_index = tokenizer.word_index
print("단어 인덱스:", word_index)

# 3. 텍스트를 시퀀스(정수 인덱스)로 변환
sequences = tokenizer.texts_to_sequences(sentences)
print("\n변환된 시퀀스:", sequences)

# 4. 패딩 (Padding)
# 문장의 길이를 통일하기 위해 가장 긴 문장을 기준으로 나머지 문장의 뒤에 0을 채움........
padded = pad_sequences(sequences, padding='post')
print("\n패딩된 시퀀스:")
print(padded)
