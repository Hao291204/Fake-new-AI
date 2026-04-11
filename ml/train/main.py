import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

from ml.preprocess import clean_text
from ml.train.model import train_model

# ===============================
# 1. LOAD DATA
# ===============================
fake = pd.read_csv("data/Fake.csv")
real = pd.read_csv("data/True.csv")

fake["label"] = 0
real["label"] = 1

data = pd.concat([fake, real]).sample(frac=1).reset_index(drop=True)

# ===============================
# 2. CLEAN TEXT
# ===============================
data["text"] = data["text"].apply(clean_text)

# ===============================
# 3. SPLIT DATA
# ===============================
X = data["text"]
y = data["label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# ===============================
# 4. TF-IDF VECTOR
# ===============================
vectorizer = TfidfVectorizer(max_features=5000)
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# ===============================
# 5. TRAIN MODEL
# ===============================
model = train_model(X_train_vec, y_train)

# ===============================
# 6. EVALUATE MODEL
# ===============================
y_pred = model.predict(X_test_vec)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred))

# ===============================
# 7. CONFUSION MATRIX
# ===============================
cm = confusion_matrix(y_test, y_pred)

sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.title("Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()

# ===============================
# 8. SAVE MODEL & VECTORIZER
# ===============================
joblib.dump(model, "outputs/model.pkl")
joblib.dump(vectorizer, "outputs/vectorizer.pkl")

print("Model and vectorizer saved in outputs/")