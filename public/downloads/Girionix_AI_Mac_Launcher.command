#!/bin/bash
# ==========================================================
# Girionix AI - macOS Native Standalone Launcher
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# Official Cloud Mirror: https://girionix-ai.pages.dev/
# ==========================================================
DIR="$(cd "$(dirname "$0")/../Resources/app" && pwd)"
PORT=3456
while lsof -i:$PORT >/dev/null 2>&1; do
  PORT=$((PORT + 1))
done

# Start local loopback HTTP server in background for offline support
if command -v python3 >/dev/null 2>&1 && [ -f "$DIR/index.html" ]; then
  python3 -m http.server $PORT --directory "$DIR" >/dev/null 2>&1 &
  SERVER_PID=$!
  trap "kill $SERVER_PID 2>/dev/null" EXIT
fi

# Connect to the official website link https://girionix-ai.pages.dev/
TARGET_URL="https://girionix-ai.pages.dev/?app=true"

# Fallback to local loopback server if internet is disconnected
if ! curl -s --connect-timeout 2 -I "https://girionix-ai.pages.dev" >/dev/null 2>&1; then
  if [ -n "$SERVER_PID" ]; then
    TARGET_URL="http://127.0.0.1:$PORT/?app=true"
  fi
fi

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
wait $SERVER_PID 2>/dev/null || true
