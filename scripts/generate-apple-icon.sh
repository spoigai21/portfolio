#!/usr/bin/env bash
# Regenerates app/apple-icon.png (180x180) from app/icon.svg.
#
#   ./scripts/generate-apple-icon.sh
#
# app/icon.svg is the source of truth for the site icon — edit that, then run
# this so the iOS home-screen icon doesn't drift from it. iOS doesn't accept an
# SVG icon, which is the only reason a PNG copy exists.
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/app/icon.svg"
OUT="$ROOT/app/apple-icon.png"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME" >&2
  echo "Set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$SRC" "$TMP/icon.svg"
cat > "$TMP/apple.html" <<'HTML'
<!doctype html><html><head><style>
html,body{margin:0;padding:0;width:180px;height:180px;overflow:hidden}
img{display:block;width:180px;height:180px}
</style></head><body><img src="icon.svg"></body></html>
HTML

"$CHROME" \
  --headless=new \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --virtual-time-budget=3000 \
  --window-size=180,180 \
  --screenshot="$OUT" \
  "file://$TMP/apple.html" 2>/dev/null

echo "Wrote $OUT"
