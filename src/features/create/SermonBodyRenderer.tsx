import { Fragment, type ReactNode } from "react";

/**
 * يعرض نص قسم خطبة مع تمييز بصري:
 * - الآيات القرآنية المحصورة بين ﴿ و﴾  → فئة sermon-ayah
 * - الأحاديث النبوية المحصورة بين « و»  → رابط بفئة sermon-hadith يفتح الدرر السنية
 * - عبارات التخريج (رواه ... / أخرجه ... / متفق عليه ...) → رابط بفئة sermon-hadith-source
 * - التشكيل **bold** القديم (للتوافق مع الخطب المحفوظة)
 */
export function SermonBodyRenderer({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  const paragraphs = body.split(/\n{2,}/);

  return (
    <div className={className}>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className="whitespace-pre-wrap leading-loose text-foreground/90 [&:not(:last-child)]:mb-4"
        >
          {renderInline(para)}
        </p>
      ))}
    </div>
  );
}

const PATTERN =
  /(﴿[^﴾]+﴾)|(«[^»]+»)|(\((?:رواه|أخرجه|متفق عليه|صحَّحه|صححه|صحيح|حسَّنه|حسنه|حسن|ضعَّفه|ضعفه)[^)]*\))|(\*\*[\s\S]+?\*\*)/g;

function buildHadithSearchUrl(text: string): string {
  const clean = text
    .replace(/[«»﴿﴾()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return `https://hdith.com/?s=${encodeURIComponent(clean)}`;
}

function renderInline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;

  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);

    if (m[1]) {
      out.push(
        <span key={k++} className="sermon-ayah">
          {m[1]}
        </span>,
      );
    } else if (m[2]) {
      out.push(
        <a
          key={k++}
          href={buildHadithSearchUrl(m[2])}
          target="_blank"
          rel="noopener noreferrer"
          title="البحث عن الحديث في الباحث الحديثي"
          className="sermon-hadith"
        >
          {m[2]}
        </a>,
      );
    } else if (m[3]) {
      out.push(
        <span key={k++} className="sermon-hadith-source">
          {m[3]}
        </span>,
      );
    } else if (m[4]) {
      out.push(
        <strong key={k++} className="font-bold text-foreground">
          {m[4].slice(2, -2)}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return out;
}
