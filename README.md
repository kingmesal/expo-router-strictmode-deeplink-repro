# expo-router: a remount above `<Slot />` under StrictMode resets a deep link

Minimal reproduction for an expo-router issue. In a dev web build, when the root `_layout` renders under `StrictMode` and something above `<Slot />` remounts it once, a deep link such as `/sign-in` ends on `/`.

`app/_layout.js` holds the whole case. `LateProvider` renders its children bare until a timer fires, then inside a context provider, which remounts the slot once.

## Run it

```bash
npm install
npx expo start --web
# open http://localhost:8081/sign-in as a fresh page load, wait a second
```

Two switches, read at bundle time:

- `EXPO_PUBLIC_STRICT=0` drops `StrictMode`.
- `EXPO_PUBLIC_STABLE=1` keeps the provider mounted from the first render, so nothing above the slot remounts.

## Headless

`./run-both.sh` starts the dev server in each setting and checks two deep links with Playwright (`npx playwright install chromium` first):

```text
STRICT=1 STABLE=0   /sign-in -> / | home screen
STRICT=1 STABLE=1   /sign-in -> /sign-in | sign-in screen
STRICT=0 STABLE=0   /sign-in -> /sign-in | sign-in screen
```
