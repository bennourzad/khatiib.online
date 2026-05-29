import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";

const TOPICS = [
  { q: "كيف أبحث عن خطبة؟", a: "اكتب الموضوع في صندوق المحادثة، وسيعرض منصة خطيب أقرب النتائج من الأرشيف." },
  { q: "كيف أستكشف التصنيفات؟", a: "من الشريط الجانبي افتح «التصنيفات»، ثم اختر القسم الذي يناسبك." },
  { q: "كيف أصنع خطبة جديدة؟", a: "ابدأ محادثة جديدة واطلب صياغة خطبة، سيقودك منصة خطيب خطوة بخطوة حتى مسودة كاملة." },
  { q: "كيف أحفظ المحتوى؟", a: "كل خطبة أو كلمة فيها زر «حفظ في المفضلة»، وستجدها لاحقًا في صفحة المفضلة." },
  { q: "كيف أميّز بين الأصلي والمُصاغ؟", a: "المادة الأصلية تحمل شارة «من المصدر» مع الرابط، والمُصاغة تحمل شارة «صِيغت داخل منصة خطيب»." },
];

export const Route = createFileRoute("/help")({
  component: () => (
    <StaticPage title="مركز المساعدة" intro="إجابات سريعة لأكثر الأسئلة شيوعًا.">
      <div className="not-prose space-y-3">
        {TOPICS.map((t) => (
          <div key={t.q} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold">{t.q}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.a}</p>
          </div>
        ))}
      </div>
    </StaticPage>
  ),
});
