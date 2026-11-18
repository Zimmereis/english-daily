#!/bin/bash
# Builds the Android shell into public/EnglishDaily.apk (served at /EnglishDaily.apk).
# Needs: aapt, javac, dalvik-exchange (dx), zipalign, apksigner, android-23 platform jar.
# Signing key: KEYSTORE=/path/to/release.keystore KS_PASS=... ./android/build.sh
# The same key must be used every time, otherwise phones refuse to update the installed app.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
A="$ROOT/android"; B="$(mktemp -d)"; JAR=/usr/lib/android-sdk/platforms/android-23/android.jar
: "${KEYSTORE:?set KEYSTORE to the release keystore}"; : "${KS_PASS:?set KS_PASS}"
mkdir -p "$B/gen" "$B/obj" "$B/dex"
aapt package -f -m -J "$B/gen" -M "$A/AndroidManifest.xml" -S "$A/res" -A "$A/assets" -I "$JAR" -0 arsc -F "$B/app.unsigned.apk"
javac -nowarn -Xlint:-options -source 8 -target 8 -bootclasspath "$JAR" -classpath "$JAR" -d "$B/obj" $(find "$A/src" "$B/gen" -name '*.java')
dalvik-exchange --dex --min-sdk-version=21 --output="$B/dex/classes.dex" "$B/obj"
(cd "$B/dex" && aapt add "$B/app.unsigned.apk" classes.dex >/dev/null)
zipalign -f -p 4 "$B/app.unsigned.apk" "$B/app.aligned.apk"
apksigner sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" --ks-key-alias ed --min-sdk-version 21 \
  --out "$ROOT/public/EnglishDaily.apk" "$B/app.aligned.apk"
rm -rf "$B"
echo "built public/EnglishDaily.apk"
