#!/bin/bash

# check dataset exists before attempting to train
if [ ! -f "data/Fake.csv" ] || [ ! -f "data/True.csv" ]; then
  echo "Error: dataset not found in data/"
  echo "Download Fake.csv and True.csv from:"
  echo "https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset"
  exit 1
fi

# train model if outputs don't exist yet
if [ ! -f "outputs/model.pkl" ]; then
  echo "Model not found — training now..."
  mkdir -p outputs
  python -m ml.train.main
fi

# install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install && cd ..
fi

# start ML service
uvicorn ml.service.main:app --port 8000 &
ML_PID=$!
echo "ML service started (pid $ML_PID)"

# start frontend
cd frontend && npm run dev &
FRONTEND_PID=$!
echo "Frontend started (pid $FRONTEND_PID)"

# kill both on Ctrl+C
trap "kill $ML_PID $FRONTEND_PID 2>/dev/null" EXIT

wait
