import { Slot } from "expo-router";
import { createContext, Fragment, StrictMode, useEffect, useState } from "react";

// EXPO_PUBLIC_STRICT=0 renders the same tree without StrictMode, the control.
const Root = process.env.EXPO_PUBLIC_STRICT === "0" ? Fragment : StrictMode;

const Late = createContext(null);

// Stands in for any provider that mounts once something async lands (a translation catalog, a theme, a session):
// until then it renders its children bare, afterwards inside a context provider, which remounts them.
function LateProvider({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(timer);
  }, []);
  // EXPO_PUBLIC_STABLE=1 keeps the provider mounted from the first render, so nothing above the Slot remounts.
  if (process.env.EXPO_PUBLIC_STABLE === "1") return <Late value={ready ? "ready" : null}>{children}</Late>;
  return ready ? <Late value="ready">{children}</Late> : children;
}

export default function Layout() {
  return (
    <Root>
      <LateProvider>
        <Slot />
      </LateProvider>
    </Root>
  );
}
