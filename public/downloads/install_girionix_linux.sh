#!/bin/bash
# ==========================================================
# Girionix AI - Linux Native 1-Click Desktop Installer
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
set -e
echo "=========================================================="
echo " Girionix AI - Linux Native Desktop Setup"
echo " Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)"
echo "=========================================================="

BIN_DIR="$HOME/.local/bin"
APP_DIR="$HOME/.local/share/applications"
DATA_DIR="$HOME/.local/share/girionix-ai/data"
mkdir -p "$BIN_DIR" "$APP_DIR" "$DATA_DIR"

RUNNER="$BIN_DIR/girionix-ai"
cat << 'EOF' > "$RUNNER"
#!/bin/bash
TARGET_URL="https://girionix-ai.site.je/?app=true"
DATA_DIR="$HOME/.local/share/girionix-ai/data"
mkdir -p "$DATA_DIR"

if command -v google-chrome &>/dev/null; then
  google-chrome --app="$TARGET_URL" --user-data-dir="$DATA_DIR" --window-size=1400,900 &
elif command -v google-chrome-stable &>/dev/null; then
  google-chrome-stable --app="$TARGET_URL" --user-data-dir="$DATA_DIR" --window-size=1400,900 &
elif command -v chromium &>/dev/null; then
  chromium --app="$TARGET_URL" --user-data-dir="$DATA_DIR" --window-size=1400,900 &
elif command -v chromium-browser &>/dev/null; then
  chromium-browser --app="$TARGET_URL" --user-data-dir="$DATA_DIR" --window-size=1400,900 &
elif command -v microsoft-edge &>/dev/null; then
  microsoft-edge --app="$TARGET_URL" --user-data-dir="$DATA_DIR" --window-size=1400,900 &
elif command -v brave-browser &>/dev/null; then
  brave-browser --app="$TARGET_URL" --user-data-dir="$DATA_DIR" --window-size=1400,900 &
else
  xdg-open "$TARGET_URL" &
fi
EOF

chmod +x "$RUNNER"

cat << EOF > "$APP_DIR/girionix-ai.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=Girionix AI
Comment=Sovereign Polymath Neural Workstation by Abhinav Giri
Exec=$RUNNER
Icon=applications-development
Terminal=false
Categories=Development;Science;AudioVideo;Utility;
StartupWMClass=girionix-ai
EOF

chmod +x "$APP_DIR/girionix-ai.desktop"

if [ -d "$HOME/Desktop" ]; then
  cp "$APP_DIR/girionix-ai.desktop" "$HOME/Desktop/" 2>/dev/null || true
  chmod +x "$HOME/Desktop/girionix-ai.desktop" 2>/dev/null || true
fi

echo "✅ Girionix AI successfully installed to your Linux desktop applications!"
echo "🚀 Launching Girionix AI..."
"$RUNNER" &
