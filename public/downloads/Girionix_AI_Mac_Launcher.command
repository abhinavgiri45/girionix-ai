#!/bin/bash
# ==========================================================
# Girionix AI - macOS Native Standalone Launcher
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
DATA_DIR="$HOME/Library/Application Support/Girionix AI/Data"
mkdir -p "$DATA_DIR"

TARGET_URL="https://girionix-ai.site.je/?app=true"

# Unquarantine self
xattr -d com.apple.quarantine "$0" 2>/dev/null || true

if [ -d "/Applications/Google Chrome.app" ]; then
  open -n -a "Google Chrome" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1400,900"
elif [ -d "/Applications/Microsoft Edge.app" ]; then
  open -n -a "Microsoft Edge" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1400,900"
elif [ -d "/Applications/Brave Browser.app" ]; then
  open -n -a "Brave Browser" --args "--app=$TARGET_URL" "--user-data-dir=$DATA_DIR" "--window-size=1400,900"
else
  open "$TARGET_URL"
fi
