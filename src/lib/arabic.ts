// Arabic text utilities — diacritics removal, letter normalization, tokenizing.
// Built for search indexing; preserve original text for display.

const DIACRITICS = /[\u064B-\u0652\u0670\u0640]/g; // tashkeel + tatweel
const NON_WORD = /[^\u0600-\u06FFa-zA-Z0-9\s]/g;
const WHITESPACE = /\s+/g;

/** Normalize Arabic text for search:
 *  - strip diacritics + tatweel
 *  - unify alif (إأآا), yaa (ىي), taa marbouta (ة→ه)
 *  - lowercase Latin, collapse whitespace, drop punctuation.
 */
export function normalizeArabic(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase()
    .replace(DIACRITICS, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(NON_WORD, " ")
    .replace(WHITESPACE, " ")
    .trim();
}

export function tokenize(input: string): string[] {
  const n = normalizeArabic(input);
  if (!n) return [];
  return n.split(" ").filter((t) => t.length > 1);
}

/** Tiny Arabic stop-words list — keeps search results meaningful. */
const STOP = new Set([
  "في","من","على","الى","إلى","عن","هو","هي","هذا","هذه","ذلك","تلك",
  "ما","لا","ان","أن","إن","او","أو","كان","يكون","كل","بعض","قد",
  "مع","هل","ثم","لقد","حين","حيث","عند","هنا","هناك","لكن","بين",
  "خطبه","خطبة","درس","كلمه","كلمة","مادة","ماده",
]);

export function meaningfulTokens(input: string): string[] {
  return tokenize(input).filter((t) => !STOP.has(t));
}
