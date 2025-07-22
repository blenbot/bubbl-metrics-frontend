#!/usr/bin/env bash

cd "$HOME/Desktop/bubbl-metrics-frontend" || { echo "Project folder not found"; exit 1; }

PID=$(sudo lsof -ti tcp:5173)
if [ -n "${PID}" ]; then
  echo "Killing process(es) on port 8080: ${PID}"
  echo "${PID}" | xargs sudo kill -9
fi


npm install

echo "Starting frontend..."
npm run dev
