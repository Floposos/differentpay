#!/bin/sh
# Rendert die Chrome-Web-Store-Grafiken aus assets-src/ nach images/ (benötigt Chrome, Chromium oder Edge).
set -eu
cd "$(dirname "$0")"

for candidate in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"; do
  [ -x "$candidate" ] && BROWSER="$candidate" && break
done
: "${BROWSER:?Kein Chromium-Browser gefunden}"

mkdir -p images
PROFILE=$(mktemp -d)
SRC="$(pwd)/assets-src"

render() { # name breite höhe
  out="$(pwd)/images/$1.png"
  rm -f "$out"
  "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
    --allow-file-access-from-files --user-data-dir="$PROFILE" --virtual-time-budget=3000 \
    --window-size="$2,$3" --screenshot="$out" "file://$SRC/$1.html" >/dev/null 2>&1 &
  pid=$!
  # Manche Browser-Versionen beenden sich nach dem Screenshot nicht von selbst
  i=0
  while [ ! -s "$out" ] && [ $i -lt 30 ]; do sleep 1; i=$((i + 1)); done
  sleep 1
  kill "$pid" 2>/dev/null || true
  wait "$pid" 2>/dev/null || true
  [ -s "$out" ] || { echo "Fehler: $1" >&2; exit 1; }
  echo "images/$1.png"
}

render screenshot-1 1280 800
render screenshot-2 1280 800
render screenshot-3 1280 800
render promo-small 440 280
render promo-marquee 1400 560
# Store-Icon: 96px Motiv mit 16px transparentem Rand (Vorgabe des Chrome Web Store)
sed 's/viewBox="0 0 64 64"/viewBox="-10.667 -10.667 85.333 85.333"/' ../src/icons/icon.svg > "$PROFILE/store-icon.svg"
sips -s format png -z 128 128 "$PROFILE/store-icon.svg" --out images/store-icon-128.png >/dev/null
echo "images/store-icon-128.png"
rm -rf "$PROFILE"
