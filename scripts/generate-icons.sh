#!/usr/bin/env bash
# Regenerates the raster icons from app/icon.svg:
#
#   app/apple-icon.png  180x180      — iOS home screen
#   app/favicon.ico     16/32/48/96  — legacy browsers and Google Search
#
#   ./scripts/generate-icons.sh
#
# app/icon.svg is the source of truth for the site icon — edit that, then run
# this so the raster copies don't drift from it. The copies exist because iOS
# won't take an SVG icon, and Google Search's favicon fetcher only reliably
# picks up a raster favicon.ico served from the site root.
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/app/icon.svg"
APPLE_OUT="$ROOT/app/apple-icon.png"
ICO_OUT="$ROOT/app/favicon.ico"

if [ ! -x "$CHROME" ]; then
  echo "Chrome not found at: $CHROME" >&2
  echo "Set CHROME=/path/to/chrome and re-run." >&2
  exit 1
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp "$SRC" "$TMP/icon.svg"

# shoot <size> <out.png> [transparent]
# Renders icon.svg at size x size. iOS flattens transparency against black, so
# the apple icon stays opaque; the favicon renders transparent to keep the
# icon's rounded corners rounded on whatever surface it lands on.
shoot() {
  local size="$1" out="$2" transparent="${3:-}"
  local bg_css="background:#fff" bg_hex="ffffffff"
  if [ -n "$transparent" ]; then
    bg_css="background:transparent"
    bg_hex="00000000"
  fi

  cat > "$TMP/shot.html" <<HTML
<!doctype html><html><head><style>
html,body{margin:0;padding:0;width:${size}px;height:${size}px;overflow:hidden;${bg_css}}
img{display:block;width:${size}px;height:${size}px}
</style></head><body><img src="icon.svg"></body></html>
HTML

  "$CHROME" \
    --headless=new \
    --hide-scrollbars \
    --default-background-color="$bg_hex" \
    --force-device-scale-factor=1 \
    --virtual-time-budget=3000 \
    --window-size="$size,$size" \
    --screenshot="$out" \
    "file://$TMP/shot.html" 2>/dev/null
}

shoot 180 "$APPLE_OUT"
shoot 256 "$TMP/icon-256.png" transparent

# Pack the 256px render down into a multi-size .ico. Google wants a favicon
# comfortably larger than 48x48; the smaller frames keep browser chrome sharp.
#
# The container is written by hand rather than with Image.save(format="ICO")
# because that always orders frames smallest-first, and Next reads the *first*
# directory entry to fill in the sizes="" attribute on the <link> tag — which
# would advertise this icon to crawlers as a 16x16.
python3 - "$TMP/icon-256.png" "$ICO_OUT" <<'PY'
import io
import struct
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
img = Image.open(src).convert("RGBA")

frames = []
for size in (96, 48, 32, 16):
    buf = io.BytesIO()
    img.resize((size, size), Image.LANCZOS).save(buf, format="PNG")
    frames.append((size, buf.getvalue()))

# ICONDIR, then one ICONDIRENTRY per frame, then the PNG payloads.
offset = 6 + 16 * len(frames)
entries, payload = b"", b""
for size, png in frames:
    entries += struct.pack("<BBBBHHII", size, size, 0, 0, 1, 32, len(png), offset)
    offset += len(png)
    payload += png

with open(out, "wb") as fh:
    fh.write(struct.pack("<HHH", 0, 1, len(frames)) + entries + payload)
PY

echo "Wrote $APPLE_OUT"
echo "Wrote $ICO_OUT"
