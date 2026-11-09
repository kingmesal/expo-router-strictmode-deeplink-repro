#!/usr/bin/env bash
# Starts the dev web build in each setting and checks the deep links against it.
# EXPO_PUBLIC_STRICT=0 drops StrictMode. EXPO_PUBLIC_STABLE=1 keeps the provider above <Slot /> mounted from the first render.
set -u
cd "$(dirname "$0")"
base=${PORT:-8099}
i=0
for setting in "1 0" "1 1" "0 0"; do
  set -- $setting
  port=$((base + i)); i=$((i + 1))
  EXPO_PUBLIC_STRICT=$1 EXPO_PUBLIC_STABLE=$2 CI=1 BROWSER=none npx expo start --web --port "$port" --clear > "expo-$1-$2.log" 2>&1 &
  server=$!
  until curl -s -o /dev/null "http://localhost:$port/"; do
    kill -0 "$server" 2>/dev/null || { echo "server exited, see expo-$1-$2.log"; break; }
    sleep 1
  done
  echo "STRICT=$1 STABLE=$2"
  node check.mjs "http://localhost:$port"
  echo "exit $?"
  kill "$server"; wait "$server" 2>/dev/null
  fuser -k "$port/tcp" > /dev/null 2>&1
done
