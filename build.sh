#!/bin/sh
# Baut die Erweiterung für Firefox und Chrome nach dist/.
set -eu
cd "$(dirname "$0")"

VERSION=$(sed -n 's/.*"version": "\(.*\)".*/\1/p' manifests/chrome.json)
rm -rf dist
mkdir -p dist

for target in firefox chrome; do
  out="dist/$target"
  mkdir -p "$out"
  cp -R src/. "$out/"
  cp "manifests/$target.json" "$out/manifest.json"
  find "$out" -name '.DS_Store' -delete
  (cd "$out" && zip -qr -X "../differentpay-$target-$VERSION.zip" .)
done

# Firefox erwartet .xpi als Endung
mv "dist/differentpay-firefox-$VERSION.zip" "dist/differentpay-firefox-$VERSION.xpi"

echo "Fertig:"
ls -1 dist/*.zip dist/*.xpi
