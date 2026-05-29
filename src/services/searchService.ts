import type { SearchResult, Sermon } from "@/types";
import { SERMONS } from "@/data/sermons";
import { meaningfulTokens, normalizeArabic } from "@/lib/arabic";

// Scoring weights — title > tags > category > body.
const W_TITLE = 6;
const W_TAG = 4;
const W_CATEGORY = 3;
const W_BODY = 1;

export interface SearchOptions {
  /** Constrain results to a single category slug. */
  categorySlug?: string;
  limit?: number;
  minScore?: number;
}

function scoreSermon(
  sermon: Sermon,
  tokens: string[],
): { score: number; matchedOn: SearchResult["matchedOn"] } {
  const matched = new Set<SearchResult["matchedOn"][number]>();
  let score = 0;

  const normTitle = normalizeArabic(sermon.title);
  const normTags = sermon.tags.map((t) => normalizeArabic(t));
  const normCategory = normalizeArabic(sermon.categoryName);

  for (const t of tokens) {
    if (normTitle.includes(t)) {
      score += W_TITLE;
      matched.add("title");
    }
    if (normTags.some((tag) => tag.includes(t))) {
      score += W_TAG;
      matched.add("tags");
    }
    if (normCategory.includes(t)) {
      score += W_CATEGORY;
      matched.add("category");
    }
    if (sermon.normalizedText.includes(t)) {
      score += W_BODY;
      matched.add("body");
    }
  }

  return { score, matchedOn: Array.from(matched) };
}

function relevanceHint(matched: SearchResult["matchedOn"]): string {
  if (matched.includes("title")) return "تطابق في العنوان";
  if (matched.includes("tags")) return "تطابق في الوسوم";
  if (matched.includes("category")) return "تطابق في التصنيف";
  return "تطابق في النص";
}

export function searchSermons(query: string, opts: SearchOptions = {}): SearchResult[] {
  const tokens = meaningfulTokens(query);
  if (tokens.length === 0) return [];

  // Require a strong match (title / tag / category). Body-only matches are
  // too noisy — a single passing mention of a word doesn't make the sermon
  // about that topic.
  const minScore = opts.minScore ?? W_CATEGORY;
  const limit = opts.limit ?? 6;

  const pool = opts.categorySlug
    ? SERMONS.filter((s) => s.categorySlug === opts.categorySlug)
    : SERMONS;

  const results: SearchResult[] = [];
  for (const s of pool) {
    const { score, matchedOn } = scoreSermon(s, tokens);
    if (score >= minScore) {
      results.push({ sermon: s, score, matchedOn, hint: relevanceHint(matchedOn) });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/** Suggest related categories when search returns no result. */
export function suggestRelatedCategories(query: string, limit = 3): string[] {
  const tokens = meaningfulTokens(query);
  const counts = new Map<string, number>();
  for (const s of SERMONS) {
    let weight = 0;
    for (const t of tokens) {
      if (s.normalizedText.includes(t)) weight += 1;
    }
    if (weight === 0) continue;
    counts.set(s.categoryName, (counts.get(s.categoryName) ?? 0) + weight);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name]) => name);
}
