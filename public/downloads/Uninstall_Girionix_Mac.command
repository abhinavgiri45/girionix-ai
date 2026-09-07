#!/bin/bash
echo "Removing Girionix AI from macOS..."
killall "Girionix AI" 2>/dev/null || true
rm -rf "/Applications/Girionix AI.app" 2>/dev/null || true
rm -rf "$HOME/Applications/Girionix AI.app" 2>/dev/null || true
rm -rf "$HOME/Library/Application Support/Girionix AI" 2>/dev/null || true
echo "✅ Girionix AI has been cleanly uninstalled from macOS."
