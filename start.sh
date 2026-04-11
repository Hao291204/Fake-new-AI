#!/bin/bash

# train model if outputs don't exist yet
if [ ! -f "outputs/model.pkl" ]; then
  echo "Model not found — training now..."
  mkdir -p outputs
  python -m ml.train.main
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
