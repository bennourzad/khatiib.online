import { createPersistentStore } from "@/lib/store";

export interface ConversationRecord {
  id: string;
  title: string;
  /** human-friendly snippet from last user message */
  preview: string;
  mode: "search" | "create" | "browse";
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
}

const store = createPersistentStore<ConversationRecord[]>("history/v1", []);

const newId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const historyStore = {
  use: store.use,
  list: () => store.get(),
  startConversation: (initialMessage: string, mode: ConversationRecord["mode"]): string => {
    const id = newId();
    const now = new Date().toISOString();
    const title =
      initialMessage.trim().slice(0, 60) || "محادثة جديدة";
    store.set((p) => [
      { id, title, preview: initialMessage.slice(0, 120), mode, createdAt: now, updatedAt: now, pinned: false },
      ...p,
    ]);
    return id;
  },
  touch: (id: string, lastMessage: string) =>
    store.set((p) =>
      p.map((c) =>
        c.id === id
          ? { ...c, preview: lastMessage.slice(0, 120), updatedAt: new Date().toISOString() }
          : c,
      ),
    ),
  rename: (id: string, title: string) =>
    store.set((p) => p.map((c) => (c.id === id ? { ...c, title } : c))),
  togglePin: (id: string) =>
    store.set((p) => p.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))),
  remove: (id: string) => store.set((p) => p.filter((c) => c.id !== id)),
  clear: () => store.set([]),
};
