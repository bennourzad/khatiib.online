// Template-based outline + draft generator. Produces editorially-valid Arabic
// scaffolding for a sermon/lesson/short word, given a structured brief.
// This will be swapped for an LLM call once the AI gateway is wired in Phase 4.

import type { SermonSection } from "@/types";

export type ContentKind = "خطبة" | "كلمة" | "درس";

export interface SermonBrief {
  topic: string;
  contentType: ContentKind;
  audience: string;
  duration: number; // minutes
  tone: string;
  axes: string[]; // 1-5 axes
}

export interface OutlineSection {
  heading: string;
  intent: string;
}

export function generateOutline(brief: SermonBrief): OutlineSection[] {
  const base: OutlineSection[] = [
    {
      heading: "المقدمة",
      intent: `حمد وثناء وافتتاح يربط الجمهور (${brief.audience}) بموضوع «${brief.topic}».`,
    },
  ];

  brief.axes.forEach((axis, i) => {
    base.push({
      heading: `المحور ${ordinal(i + 1)}: ${axis}`,
      intent: `تفصيل المحور «${axis}» بنبرة ${brief.tone}، مع شاهد شرعي وتطبيق عملي.`,
    });
  });

  base.push({
    heading: "الخاتمة",
    intent: `تلخيص الفكرة الرئيسية ودعوة الجمهور للعمل، بما يناسب ${brief.duration} دقيقة.`,
  });

  if (brief.contentType !== "كلمة") {
    base.push({
      heading: "الدعاء",
      intent: "ختام بدعاء جامع يناسب الموضوع.",
    });
  }

  return base;
}

export function generateDraft(
  brief: SermonBrief,
  outline: OutlineSection[],
): SermonSection[] {
  return outline.map((o) => ({
    heading: o.heading,
    body: composeBody(brief, o),
  }));
}

function composeBody(brief: SermonBrief, o: OutlineSection): string {
  if (o.heading === "المقدمة") {
    return [
      "الحمد لله رب العالمين، والصلاة والسلام على أشرف الأنبياء والمرسلين، نبينا محمد وعلى آله وصحبه أجمعين، أما بعد:",
      `فيا ${audienceVocative(brief.audience)}، حديثنا اليوم عن «${brief.topic}»، وهو موضوع يمسّ حياتنا اليومية ويصلح به حال القلب والمجتمع.`,
      `وسنتناوله — بإذن الله — في ${ordinal(brief.axes.length)} ${arabicAxisNoun(brief.axes.length)} رئيس${brief.axes.length > 1 ? "ة" : "ي"}، في حدود ${brief.duration} دقيقة.`,
    ].join(" ");
  }

  if (o.heading === "الخاتمة") {
    return [
      `وفي ختام هذه ال${brief.contentType}، تذكّروا أن «${brief.topic}» ليس شعارًا نرفعه، بل سلوك نعيشه ونغرسه في أبنائنا ومجتمعنا.`,
      "فاتقوا الله عباد الله، واعملوا الصالحات قبل أن يأتي يوم لا ينفع فيه مال ولا بنون إلا من أتى الله بقلب سليم.",
    ].join(" ");
  }

  if (o.heading === "الدعاء") {
    return [
      "اللهم اجعلنا ممن سمع القول فاتبع أحسنه، اللهم وفّقنا لما تحب وترضى،",
      `اللهم اجعل لنا في ${brief.topic} نصيبًا وافرًا، وانفعنا بما علّمتنا، وعلّمنا ما ينفعنا، وزدنا علمًا.`,
      "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار، وصلى الله على نبينا محمد وعلى آله وصحبه أجمعين.",
    ].join(" ");
  }

  // axis body
  const axis = o.heading.split(": ").slice(1).join(": ");
  return [
    `إن من أبرز ما يتصل بـ«${brief.topic}» هو ${axis}.`,
    `وقد جاءت النصوص الشرعية مؤكدةً هذا المعنى، وموجِّهةً المسلم — وخاصة ${brief.audience} — إلى ترجمته في الواقع العملي.`,
    `والمتأمل في حال السلف الصالح يرى أنهم كانوا يجعلون ${axis} ركيزةً من ركائز حياتهم، يعرفون ثمرته العاجلة في صفاء القلب، والآجلة في الأجر العظيم.`,
    `فبادروا — ${audienceVocative(brief.audience)} — إلى تطبيق هذا المعنى في يومكم، ولو بخطوة صغيرة محدّدة قابلة للقياس.`,
  ].join(" ");
}

function audienceVocative(a: string): string {
  if (a.includes("شباب")) return "معاشر الشباب";
  if (a.includes("نساء") || a.includes("أخوات")) return "أخواتي الفاضلات";
  if (a.includes("أطفال") || a.includes("ناشئة")) return "أحبتي الصغار";
  if (a.includes("عمال")) return "إخواني العمال";
  return "عباد الله";
}

function ordinal(n: number): string {
  const map = ["", "محورًا واحدًا", "محورين", "ثلاثة محاور", "أربعة محاور", "خمسة محاور"];
  // For ordinal numbering in heading we want plain numerals if >5
  if (arguments.length === 1 && map[n] && /محور/.test(map[n])) return map[n];
  const ordinals = ["", "الأول", "الثاني", "الثالث", "الرابع", "الخامس"];
  return ordinals[n] ?? `رقم ${n}`;
}

function arabicAxisNoun(n: number): string {
  if (n === 1) return "محور";
  if (n === 2) return "محورين";
  return "محاور";
}

export function estimateMinutes(sections: SermonSection[]): number {
  const words = sections.reduce(
    (acc, s) => acc + s.heading.split(/\s+/).length + s.body.split(/\s+/).length,
    0,
  );
  // ~110 Arabic words per minute when read at sermon pace.
  return Math.max(2, Math.round(words / 110));
}

export function buildTitle(brief: SermonBrief): string {
  const prefix =
    brief.contentType === "كلمة"
      ? "كلمة عن"
      : brief.contentType === "درس"
      ? "درس في"
      : "خطبة بعنوان";
  return `${prefix} ${brief.topic}`.trim();
}
