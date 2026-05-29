import type { Intent } from "@/types";
import { normalizeArabic } from "@/lib/arabic";

// Lightweight intent classifier — keyword heuristics over a normalized query.
// Returns one of: search | create | browse | ambiguous.

const CREATE_HINTS = [
  "اصنع","انشئ","أنشئ","اكتب لي","صياغه","صياغة","ولد لي","ولّد","ابن لي",
  "ابني","اعمل لي","صمم لي","صمّم","حضر لي","حضّر لي","اقترح علي",
  "اريد صناعه","أريد صناعة","اريد صياغه","أريد صياغة","ابدا صياغه","ابدأ صياغة",
];

const BROWSE_HINTS = ["تصنيف","استعرض","اعرض التصنيفات","قائمة","استكشف"];

export function classifyIntent(rawQuery: string): Intent {
  const q = rawQuery.trim();
  if (!q) return { kind: "ambiguous", query: q };
  const n = normalizeArabic(q);

  if (CREATE_HINTS.some((h) => n.includes(normalizeArabic(h)))) {
    return { kind: "create", topic: q };
  }
  if (BROWSE_HINTS.some((h) => n.includes(normalizeArabic(h)))) {
    return { kind: "browse", query: q };
  }
  // Very short or single token — ambiguous unless it looks like a topic word.
  if (n.length < 3) return { kind: "ambiguous", query: q };
  return { kind: "search", query: q };
}
