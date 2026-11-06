#!/data/data/com.termux/files/usr/bin/sh
set -eu

PROJECT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
APP_DIR="$PROJECT_DIR/app"
WEB_PROJECT_DIR=$(CDPATH= cd -- "$PROJECT_DIR/.." && pwd)

cd "$WEB_PROJECT_DIR"
npm run build

rm -rf "$APP_DIR/src/main/assets/www"
mkdir -p "$APP_DIR/src/main/assets/www"
cp -R "$WEB_PROJECT_DIR/dist/." "$APP_DIR/src/main/assets/www/"

cd "$PROJECT_DIR"
ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}" ./gradlew --no-daemon assembleDebug

APK="$APP_DIR/build/outputs/apk/debug/app-debug.apk"
mkdir -p "$WEB_PROJECT_DIR/output"
cp "$APK" "$WEB_PROJECT_DIR/output/Dark-Calculadora-2.0.apk"
if [ -d /storage/emulated/0/Download ]; then
    cp "$APK" /storage/emulated/0/Download/Dark-Calculadora-2.0.apk
fi
printf 'APK criado: %s\n' "$WEB_PROJECT_DIR/output/Dark-Calculadora-2.0.apk"
