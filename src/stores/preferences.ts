import { createPersistentStore } from "@/lib/store";

export interface UserPreferences {
  defaultDuration: number; // minutes
  defaultTone: string;
  defaultAudience: string;
  defaultContentType: "خطبة" | "كلمة" | "درس";
  language: "ar";
}

const DEFAULTS: UserPreferences = {
  defaultDuration: 15,
  defaultTone: "وعظي مؤثر",
  defaultAudience: "عامة المصلين",
  defaultContentType: "خطبة",
  language: "ar",
};

const store = createPersistentStore<UserPreferences>("preferences/v1", DEFAULTS);

export const preferencesStore = {
  use: store.use,
  get: () => store.get(),
  update: (patch: Partial<UserPreferences>) =>
    store.set((p) => ({ ...p, ...patch })),
  reset: () => store.set(DEFAULTS),
};

export const PREFERENCE_DEFAULTS = DEFAULTS;
