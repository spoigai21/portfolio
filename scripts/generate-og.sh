#!/usr/bin/env bash
# Regenerates public/og.png — the 1200x630 card that LinkedIn, X, iMessage, and
# Slack show when the site is shared.
#
#   ./scripts/generate-og.sh
#
# Edit scripts/og-image.html first if the name, role, bio, or domain changed —
# the domain is baked into the image, so it must be updated by hand there.
#
# Rendered with headless Chrome rather than a screenshot of the live site: the
# homepage is a WebGL canvas, and headless Chrome has no GPU context, so a real
# screenshot of it comes out as an error page.
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/scripts/og-image.html"
OUT="$ROOT/public/og.png"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME" >&2
  echo "Set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi

# --virtual-time-budget lets the webfonts load before the frame is captured.
"$CHROME" \
  --headless=new \
  --hide-scrollbars \
  --force-device-scale-factor=1 \
  --virtual-time-budget=6000 \
  --window-size=1200,630 \
  --screenshot="$OUT" \
  "file://$SRC" 2>/dev/null

echo "Wrote $OUT"
