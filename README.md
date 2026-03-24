# Fake-new-AI
Project AI
# 📰 Fake News Detection using AI

## 📌 Overview
This project uses Artificial Intelligence and Natural Language Processing (NLP) to classify news articles as **FAKE** or **REAL**.

## 🎯 Objective
The goal is to help detect misinformation by analyzing textual content using machine learning.

## 📊 Dataset
- Source: Kaggle
- Fake and Real News Dataset
- Contains labeled news articles

## ⚙️ Methodology
1. Text preprocessing (cleaning, stopwords removal)
2. Feature extraction using TF-IDF
3. Model training using Logistic Regression
4. Evaluation using accuracy and confusion matrix

## 🧠 Model
- Logistic Regression
- TF-IDF vectorization

## 📈 Results
- Accuracy: ~90–95%
- Evaluation metrics:
  - Precision
  - Recall
  - F1-score

## 🧪 Demo
User inputs a news article → model predicts FAKE or REAL.

## 🚀 How to Run

```bash
pip install -r requirements.txt
cd src
python main.py
python predict.py
