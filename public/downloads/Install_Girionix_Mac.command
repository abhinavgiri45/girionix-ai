#!/bin/bash
# ==========================================================
# Girionix AI - macOS 1-Click Native App Installer
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
set -e
APP_NAME="Girionix AI"
INSTALL_DIR="/Applications"
if [ ! -w "/Applications" ]; then
  INSTALL_DIR="$HOME/Applications"
fi
mkdir -p "$INSTALL_DIR"

BUNDLE="$INSTALL_DIR/$APP_NAME.app"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

if [ -d "$SCRIPT_DIR/Girionix AI.app" ]; then
  cp -R "$SCRIPT_DIR/Girionix AI.app" "$INSTALL_DIR/"
  xattr -cr "$BUNDLE" 2>/dev/null || true
  echo "✅ Girionix AI successfully installed to $BUNDLE"
  open "$BUNDLE"
else
  echo "Opening Girionix AI..."
  open "$BUNDLE" 2>/dev/null || true
fi
