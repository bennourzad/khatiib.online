// Tiny SSR-safe localStorage-backed store.
// Provides createPersistentStore() that returns a hook + imperative API.

import { useSyncExternalStore } from "react";

type Listener = () => void;

const STORAGE_PREFIX = "minbar:";

export interface PersistentStore<T> {
  get: () => T;
  set: (next: T | ((prev: T) => T)) => void;
  subscribe: (l: Listener) => () => void;
  use: () => T;
}

const isBrowser = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export function createPersistentStore<T>(
  key: string,
  initial: T,
): PersistentStore<T> {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const listeners = new Set<Listener>();
  let state: T = initial;
  let hydrated = false;

  const hydrate = () => {
    if (hydrated || !isBrowser()) return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) state = JSON.parse(raw) as T;
    } catch {
      /* ignore corrupted state */
    }
  };

  const persist = () => {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* quota / privacy mode — ignore */
    }
  };

  // Cross-tab sync
  if (isBrowser()) {
    window.addEventListener("storage", (e) => {
      if (e.key !== storageKey) return;
      try {
        state = e.newValue ? (JSON.parse(e.newValue) as T) : initial;
        listeners.forEach((l) => l());
      } catch {
        /* ignore */
      }
    });
  }

  const get = () => {
    hydrate();
    return state;
  };

  const set: PersistentStore<T>["set"] = (next) => {
    hydrate();
    const value =
      typeof next === "function" ? (next as (p: T) => T)(state) : next;
    state = value;
    persist();
    listeners.forEach((l) => l());
  };

  const subscribe = (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l) as unknown as void;
  };

  const use = () =>
    useSyncExternalStore(
      subscribe,
      () => {
        hydrate();
        return state;
      },
      () => initial,
    );

  return { get, set, subscribe, use };
}
