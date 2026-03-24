import joblib
from preprocess import clean_text

model = joblib.load("../outputs/model.pkl")
vectorizer = joblib.load("../outputs/vectorizer.pkl")

def predict_news(text):
    text = clean_text(text)
    vec = vectorizer.transform([text])
    pred = model.predict(vec)[0]
    return "REAL" if pred == 1 else "FAKE"

# Demo
if __name__ == "__main__":
    user_input = input("Enter news text: ")
    print("Prediction:", predict_news(user_input))