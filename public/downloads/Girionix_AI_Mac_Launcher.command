#!/bin/bash
# ==========================================================
# Girionix AI - macOS Native Standalone Offline Launcher
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
DIR="$(cd "$(dirname "$0")/../Resources/app" && pwd)"
PORT=3456
while lsof -i:$PORT >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

# Start local loopback HTTP server
python3 -m http.server $PORT --directory "$DIR" >/dev/null 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null" EXIT

TARGET_URL="http://127.0.0.1:$PORT/?app=true"
sleep 0.4

DATA_DIR="$HOME/Library/Application Support/Girionix AI/Data"
mkdir -p "$DATA_DIR"

if [ -d "/Applications/Google Chrome.app" ]; then
  open -n -a "Google Chrome" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1400,900"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  open -n -a "Microsoft Edge" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1400,900"
elif [ -d "/Applications/Brave Browser.app" ]; then
  open -n -a "Brave Browser" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1400,900"
else
  open "$TARGET_URL"
fi
wait $SERVER_PID
