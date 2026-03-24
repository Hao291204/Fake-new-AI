from flask import Flask, request, render_template
import joblib
from src.preprocess import clean_text

app = Flask(__name__)

model = joblib.load("../outputs/model.pkl")
vectorizer = joblib.load("../outputs/vectorizer.pkl")

@app.route("/", methods=["GET", "POST"])
def home():
    prediction = None
    if request.method == "POST":
        text = request.form["news"]
        clean = clean_text(text)
        vec = vectorizer.transform([clean])
        pred = model.predict(vec)[0]
        prediction = "REAL" if pred == 1 else "FAKE"

    return render_template("index.html", prediction=prediction)

app.run(debug=True)