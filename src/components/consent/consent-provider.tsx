"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { isStandaloneRoute } from "@/lib/standalone-routes";

type Consent = "granted" | "denied" | null;

interface ConsentContextValue {
  /** "granted" | "denied" | null (no choice made yet) */
  consent: Consent;
  /** false during SSR / first hydration render, true once on the client */
  ready: boolean;
  accept: () => void;
  decline: () => void;
  /** clears the stored choice so the banner shows again */
  reset: () => void;
}

const STORAGE_KEY = "valar-cookie-consent";
const CHANGE_EVENT = "valar-consent-change";

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readConsent(): Consent {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // localStorage blocked (private mode etc.) — treat as no choice yet.
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function writeConsent(value: Consent) {
  try {
    if (value === null) {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // Ignore write failures — the event below still updates this tab.
  }
  // Notify this tab's subscribers (the native "storage" event only fires
  // in *other* tabs, so we dispatch our own for the current one).
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Stable no-op subscription used only for the "has the client hydrated" flag.
const noopSubscribe = () => () => {};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribe, readConsent, () => null);
  // false on the server and during the first hydration render, true after —
  // keeps server and client markup identical so nothing flashes.
  const ready = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const accept = useCallback(() => writeConsent("granted"), []);
  const decline = useCallback(() => writeConsent("denied"), []);
  const reset = useCallback(() => writeConsent(null), []);

  return (
    <ConsentContext.Provider value={{ consent, ready, accept, decline, reset }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const ctx = useContext(ConsentContext);
  if (!ctx) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return ctx;
}

/**
 * Whether Google Analytics and the Meta pixel may load.
 *
 * Opt-out, not opt-in (Lena, 2026-10-21): with ads running, a pixel that only
 * saw the minority who pressed Accept left Meta optimising blind. The banner
 * says the site uses cookies from the first page view, and "Switch off" turns
 * them off; a choice to switch off is remembered and always respected.
 *
 * The exception is a standalone route, where the banner is never shown: no
 * notice there, so nothing loads until the visitor has said OK elsewhere.
 * Nothing loads before `ready` either, which keeps the server render and the
 * first client render identical.
 */
export function useTrackingAllowed() {
  const { consent, ready } = useConsent();
  const pathname = usePathname();
  if (!ready) return false;
  if (consent === "granted") return true;
  return consent === null && !isStandaloneRoute(pathname);
}
