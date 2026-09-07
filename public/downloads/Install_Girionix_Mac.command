#!/bin/bash
# ==========================================================
# Girionix AI - macOS 1-Click Native App Installer
# Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)
# ==========================================================
set -e
echo "=========================================================="
echo " Girionix AI - macOS Native Desktop Workstation Setup"
echo " Envisioned & Engineered by Abhinav Giri (@abhinavgiri45)"
echo "=========================================================="

APP_NAME="Girionix AI"
INSTALL_DIR="/Applications"
if [ ! -w "/Applications" ]; then
  INSTALL_DIR="$HOME/Applications"
fi
mkdir -p "$INSTALL_DIR"

BUNDLE="$INSTALL_DIR/$APP_NAME.app"
mkdir -p "$BUNDLE/Contents/MacOS"
mkdir -p "$BUNDLE/Contents/Resources"

DATA_DIR="$HOME/Library/Application Support/Girionix AI/Data"
mkdir -p "$DATA_DIR"

cat << 'EOF' > "$BUNDLE/Contents/MacOS/Girionix AI"
#!/bin/bash
TARGET_URL="https://girionix-ai.site.je/?app=true"
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
EOF

chmod +x "$BUNDLE/Contents/MacOS/Girionix AI"

cat << EOF > "$BUNDLE/Contents/Info.plist"
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>Girionix AI</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>ai.girionix.desktop</string>
    <key>CFBundleName</key>
    <string>Girionix AI</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>2.4.0</string>
    <key>CFBundleVersion</key>
    <string>2.4.0</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Clear quarantine from bundle
xattr -cr "$BUNDLE" 2>/dev/null || true

echo "✅ Girionix AI successfully installed to $BUNDLE"
echo "🚀 Launching Girionix AI..."
open "$BUNDLE"
