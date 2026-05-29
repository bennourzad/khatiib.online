import { createPersistentStore } from "@/lib/store";
import type { SermonSection } from "@/types";

export interface SavedSermon {
  id: string;
  title: string;
  topic: string;
  contentType: "خطبة" | "كلمة" | "درس";
  audience: string;
  duration: number;
  tone: string;
  axes: string[];
  sections: SermonSection[];
  createdAt: string;
  updatedAt: string;
}

const store = createPersistentStore<SavedSermon[]>("saved-sermons/v1", []);

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const savedSermonsStore = {
  use: store.use,
  list: () => store.get(),
  get: (id: string) => store.get().find((s) => s.id === id),
  add: (sermon: Omit<SavedSermon, "id" | "createdAt" | "updatedAt">): string => {
    const id = newId();
    const now = new Date().toISOString();
    store.set((p) => [{ ...sermon, id, createdAt: now, updatedAt: now }, ...p]);
    return id;
  },
  update: (id: string, patch: Partial<Omit<SavedSermon, "id" | "createdAt">>) =>
    store.set((p) =>
      p.map((s) =>
        s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s,
      ),
    ),
  remove: (id: string) => store.set((p) => p.filter((s) => s.id !== id)),
  clear: () => store.set([]),
};
