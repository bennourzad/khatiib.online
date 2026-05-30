import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  ShieldCheck,
  BookOpen,
  Layers,
  Target,
  Users,
  CheckCircle2,
  Wand2,
  Quote,
  Activity,
  ArrowLeft,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingChrome";
import challengeBg from "@/assets/bg-khatiib-01.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن خطيب — أمانة الكلمة وعصرية التقنية" },
      {
        name: "description",
        content: "تعرف على رؤية وفلسفة منصة خطيب لمساعدة خطباء وأئمة المساجد في كتابة وصياغة خطبهم بطريقة شرعية وعلمية موثوقة.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div dir="rtl" className="min-h-svh bg-background text-foreground overflow-x-hidden">
      <MarketingHeader />
      <HeroSection />
      <ShariaSensitivitySection />
      <SacredTrustSection />
      <SermonJourneySection />
      <GuaranteesSection />
      <MarketingFooter />
    </div>
  );
}

/* ---------- Islamic Ornament Component ---------- */
function IslamicOrnament() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center opacity-[0.08] mix-blend-screen">
      <svg
        width="600"
        height="600"
        viewBox="0 0 200 200"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="0.5"
        className="w-[45rem] h-[45rem] text-primary animate-spin-slow"
        style={{ animationDuration: "160s" }}
      >
        {/* Intricate Islamic Geometric Star Rosette */}
        <rect x="50" y="50" width="100" height="100" transform="rotate(0 100 100)" />
        <rect x="50" y="50" width="100" height="100" transform="rotate(45 100 100)" />
        <rect x="50" y="50" width="100" height="100" transform="rotate(22.5 100 100)" />
        <rect x="50" y="50" width="100" height="100" transform="rotate(67.5 100 100)" />

        <circle cx="100" cy="100" r="70" strokeDasharray="2,2" />
        <circle cx="100" cy="100" r="50" />
        <circle cx="100" cy="100" r="35" strokeDasharray="3,3" />
        <circle cx="100" cy="100" r="18" />

        {/* Intricate rays */}
        {Array.from({ length: 32 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + 95 * Math.cos((i * 11.25 * Math.PI) / 180)}
            y2={100 + 95 * Math.sin((i * 11.25 * Math.PI) / 180)}
            strokeDasharray={i % 2 === 0 ? "none" : "1,3"}
          />
        ))}

        {/* Outer majestic polygon points */}
        <polygon
          points="100,8 115,35 150,35 135,65 170,80 135,95 150,125 115,125 100,152 85,125 50,125 65,95 30,80 65,65 50,35 85,35"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
}

/* ---------- Hero Section ---------- */
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#031d18] text-foreground py-24 sm:py-32">
      {/* Background challenge image overlay */}
      <img
        src={challengeBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
      />
      {/* Dark theme overlay with transparency */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#031d18]/85"
      />

      {/* Islamic Ornament Overlay */}
      <IslamicOrnament />

      {/* Central vibrant primary glow (Less calm, more dynamic) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-primary-soft)_0%,_transparent_30%)] opacity-30 mix-blend-screen"
      />

      {/* Background glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 right-1/4 h-[30rem] w-[30rem] rounded-full bg-primary/30 blur-3xl opacity-80 animate-pulse-slow" />
        <div className="absolute bottom-10 left-1/4 h-[25rem] w-[25rem] rounded-full bg-primary/20 blur-3xl opacity-80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 animate-fade-in-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
          رؤيتنا: دمج الأصالة بالمعاصرة
        </span>

        <h1 className="mt-8 font-black text-4xl leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl text-white">
          أمانة الكلمة..
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">وعصرية التقنية.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-loose text-white/95 sm:text-lg">
          منصة خطيب ليست بديلاً عن الخطيب صاحب البصيرة والرسالة، بل هي ورشته الذكية التي تكسر جمود الصفحة البيضاء، وتنظم أفكاره، وتوثق مصادره، ليتفرغ لروح موعظته وتأثيرها.
        </p>

      </div>
    </section>
  );
}
/* ---------- Sharia Sensitivity & Responsibility Section ---------- */
function ShariaSensitivitySection() {
  return (
    <section className="relative overflow-hidden bg-[#f4faf7] py-24 text-[#0a352c] border-y border-emerald-100/80">
      {/* Absolute Decorative Glow Elements (Light Version) */}
      <div className="absolute top-0 right-1/4 h-80 w-80 rounded-full bg-emerald-200/20 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-amber-200/20 blur-[100px] pointer-events-none" />

      {/* Intricate Arabic Geometric Patterns in Background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none select-none"
        style={{
          backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Heading with high spiritual and emotional appeal */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-600/30 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-700 backdrop-blur animate-pulse">
            ⚠️ توضيح شرعي هام وميثاق أمانة
          </span>
          <h2 className="font-display text-3xl font-black leading-tight sm:text-4xl lg:text-5xl text-[#073229]">
            ميثاق المنبر: <span className="text-gradient-brand">أمانة الكلمة</span> والمسؤولية الشرعية
          </h2>
          <p className="mt-6 text-base leading-loose text-[#2b534b]">
            إن فكرة منصة <strong className="text-primary font-bold">«خطيب»</strong> فكرة دقيقة وحساسة للغاية؛ لارتباطها الوثيق بـ <strong className="text-amber-700 font-bold">شريعة رب العالمين وعقيدة الأمة</strong> وسير منبر رسول الله ﷺ. ونحن نؤمن يقيناً أن التوجيه والفتوى والموعظة لا تؤخذ من آلة صماء، بل من قلوب وعقول علمائها.
          </p>
        </div>

        {/* Cinematic Split Comparison: Helper Tool vs Preacher's Spirit */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2 items-stretch">
          {/* Right Box: What the platform does (The Tool) */}
          <div className="relative overflow-hidden rounded-[2rem] border border-emerald-200 bg-white/95 p-8 sm:p-10 shadow-sm backdrop-blur flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.015] hover:border-emerald-400 hover:shadow-elegant hover:ring-4 hover:ring-emerald-500/10">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">مهمتنا التقنية</span>
                  <h3 className="text-xl font-black text-[#073229] mt-0.5">منصة خطيب (الورشة التحضيرية)</h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-loose text-[#2b534b]">
                نهيئ لك الأرضية الخصبة، ونوفر عليك ساعات العناء الذهني من خلال:
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "بناء الهياكل الموضوعية المتماسكة بلا تشتت أو فوضى.",
                  "التخريج والتوثيق والتحقق من صحة الأدلة والآيات بنقرة واحدة.",
                  "كسر جمود الصفحة البيضاء باقتراح أفكار ومحاور بلاغية مترابطة.",
                  "حفظ أرشيفك وصياغاتك الخاصة لتكون مرجعك الدائم بمكان واحد آمن."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[#234b43]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-emerald-100 pt-6 text-[11px] text-emerald-600 font-mono font-bold">
              // أداة ذكية للمساندة والترتيب وصناعة المسودات الأولية فقط
            </div>
          </div>

          {/* Left Box: The Preacher's Role (The Soul) - Designed to look majestic and high-priority */}
          <div className="relative overflow-hidden rounded-[2rem] border border-amber-300 bg-gradient-to-br from-amber-50/60 via-white to-white p-8 sm:p-10 shadow-md backdrop-blur flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.015] hover:border-amber-400 hover:shadow-elegant hover:ring-4 hover:ring-amber-500/10">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl animate-pulse" />

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-750">
                  <ShieldCheck className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">أمانتك الشرعية</span>
                  <h3 className="text-xl font-black text-[#3d2e0f] mt-0.5">الخطيب والإمام (روح المنبر وبصيرته)</h3>
                </div>
              </div>

              <p className="mt-5 text-sm leading-loose text-[#52411b]">
                تقع المسؤولية العلمية والفقهية بالكامل على عاتقك كقائد روحي للأمة عبر:
              </p>

              <ul className="mt-6 space-y-4">
                {[
                  "المراجعة العلمية الدقيقة لكل ما تُخرجه منصة خطيب وضمان موافقته الشرعية.",
                  "مواءمة الموعظة لواقع جماعتك الفعلي وما يصلح شأنهم وحالهم الفردي والمجتمعي.",
                  "التعديل، الحذف، والإضافة من مخزونك المعرفي وعلمك الشرعي المتراكم.",
                  "بث اليقين وصدق العاطفة والإلقاء المؤثر الذي لا تستطيع أي آلة مجاراته."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs leading-relaxed text-[#4d3b16]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold text-[10px]">★</span>
                    <span className="font-bold text-[#2e2103]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border-t border-amber-200 pt-6 text-[11px] text-amber-750 font-mono font-bold">
              // المنبر أمانتك ومستقرك.. التقنية ورقتك الذكية، وأنت العقل والبصيرة
            </div>
          </div>
        </div>

        {/* Solemn warning box at the bottom */}
        <div className="mt-12 rounded-[1.5rem] border border-amber-300 bg-gradient-to-r from-amber-50/80 to-[#fdfcfa]/90 p-6 sm:p-8 backdrop-blur shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Quote className="h-6 w-6 shrink-0" />
            </div>
            <div>
              <p className="text-sm font-black text-amber-800">ميثاق التوقيع العلمي والشرعي المعتمد</p>
              <p className="mt-1.5 text-lg leading-relaxed text-[#4d3f23] font-medium">
                يُحظر شرعاً وأخلاقاً استخدام منصة **«خطيب»** لإنشاء مسودات وإلقائها من على المنبر مباشرة دون قراءة، مراجعة وتعديل مسبق من الخطيب. إن بناء المسودة هو أداة تسهيل وورشة عمل تدعم إبداعك، والمسودة لا تكتسب شرعيتها ومصداقيتها إلا بمرورها على قلب وعقل وبصيرة الإمام.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ---------- Sacred Trust Section ---------- */
function SacredTrustSection() {
  return (
    <section className="relative bg-surface-muted/30 py-20 border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Right Column: Statement of sensitivity */}
          <div className="space-y-6 lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              المنطلق الفلسفي والشرعي
            </span>
            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              نعلم يقيناً أن الكلمة على المنبر <span className="text-primary">أمانة عظيمة</span>.. والموقف جد حساس.
            </h2>
            <p className="text-base leading-loose text-muted-foreground">
              لهذا السبب تحديداً، لم نصمم **خطيب** ليكون كاتب خطب جاهزة يُلقيها الإمام دون وعي. إن التجربة الحقيقية هي التي تبرهن كيف يظل الإمام هو صاحب البصيرة والقرار الفقهي والتربوي، بينما تقوم المنصة بدور "الورشة التحضيرية" التي تختصر عليه ساعات التعب والترتيب والبحث المشتت.
            </p>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/90">
              <Quote className="h-4 w-4 text-primary mb-2" />
              «أنت البصيرة والروح، ونحن الورقة والقلم الذكي. لا خطبة تخرج للنور دون توقيعك وعلمك.»
            </div>
          </div>

          {/* Left Column: Core pillars with clean UI cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {[
              {
                icon: Users,
                title: "فهم واقع المصلين",
                desc: "أنت أدرى الناس بجماعتك، حاجاتهم وهمومهم. المنصة تدعمك بهياكل ذكية تطوعها لواقع مصلّيك الفعلي.",
              },
              {
                icon: ShieldCheck,
                title: "التوثيق العلمي الأصيل",
                desc: "دعم فوري ومباشر بالآيات الكريمة والأحاديث النبوية المخرّجة عبر 7 مصادر علمية إسلامية موثوقة.",
              },
              {
                icon: Layers,
                title: "كسر الجمود البصري",
                desc: "تجاوز تعب البداية والصفحة الفارغة بمحاور وأفكار تفتح لك آفاقاً جديدة ومترابطة علمياً وبلاغياً.",
              },
              {
                icon: Clock,
                title: "توفير 75% من الوقت",
                desc: "اختصر ساعات البحث الشاق والصياغة الأولية، لتركز وقتك في المراجعة والدراسة وتهذيب الإلقاء.",
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sermon Journey Section ---------- */
function SermonJourneySection() {
  const steps = [
    {
      num: "01",
      title: "الفكرة والبذرة",
      desc: "أنت من يزرع الفكرة الأولى ويحدد الاتجاه للورشة.",
      query: "صياغة بذرة الموضوع: «البر في زمن التقنية»",
      logs: [
        "تلقي فكرة الخطيب الرئيسية وضبط النبرة المطلوبة...",
        "تحليل الجمهور المستهدف (شباب وعائلات).",
        "تحديد الإطار الزمن المناسب (15 دقيقة).",
        "توليد البذرة الإيمانية التوجيهية للخطبة."
      ],
      result: "الموضوع: البر الرقمي · النبرة: وجدانية مؤثرة · الجمهور: عام والشباب · المدة: 15 دقيقة.",
      tag: "تحديد المعالم"
    },
    {
      num: "02",
      title: "التشييد البلاغي",
      desc: "توزيع الأفكار وبناء الهيكل بشكل مترابط ومتناسق.",
      query: "تشييد الهيكل: مقدمة، 3 محاور، خاتمة، ودعاء",
      logs: [
        "بناء مقدمة منبرية استهلالية بليغة تناسب الموضوع...",
        "تقسيم الأفكار إلى محاور مترابطة بلا تشتت.",
        "تثبيت نقاط واقعية للمصلين (تطبيقات عملية).",
        "هيكلة خاتمة تشتمل على دعاء شامل ومأثور."
      ],
      result: "تم بناء هيكل من 3 محاور رئيسية تتدرج من التأصيل الشرعي إلى التطبيق الواقعي والسلوكي في حياة المسلم.",
      tag: "هندسة المحاور"
    },
    {
      num: "03",
      title: "التدقيق والتوثيق",
      desc: "طواف الذكاء الاصطناعي بالقواعد السبعة لتوثيق الأدلة.",
      query: "تخريج فوري: حديث «من أدرك أبويه عند الكبر...»",
      logs: [
        "الاستعلام عن الآيات بالرسم العثماني بـ tafsir.app...",
        "فحص السند وحكم المحدثين للحديث بـ hdith.com.",
        "التحقق من صحة وموثوقية الرواية في الموسوعة بالدرر السنية.",
        "النتيجة: حديث صحيح [رواه مسلم في صحيحه]."
      ],
      result: "﴿وَبِالْوَالِدَيْنِ إِحْسَانًا﴾ بالرسم العثماني المعزز بحديث صحيح مخرّج وموثق علمياً في مسودة الخطبة.",
      tag: "الأمان الفقهي"
    },
    {
      num: "04",
      title: "توقيع الخطيب وروحه",
      desc: "المسودة الكاملة ملكك، تعدلها لتناسب علمك وحنجرتك.",
      query: "تجهيز المسودة للنشر والتنزيل بصيغة Word/PDF",
      logs: [
        "تحويل المحتوى لمحرر متكامل يقبل الحذف والإضافة الفورية...",
        "توفير خيارات الحفظ الفوري في أرشيفك الشخصي.",
        "تصدير الخطبة بصيغة نظيفة جاهزة للمطالعة على المنبر.",
        "اكتمال التحضير بنجاح وأمان علمي مطلق."
      ],
      result: "مسودة متكاملة بآياتها وأحاديثها الموثقة جاهزة للتنزيل بين يديك لتضع فيها روحك وعلمك وبصيرتك.",
      tag: "روح المنبر"
    }
  ];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 4200);
    return () => clearInterval(interval);
  }, [paused, steps.length]);

  const current = steps[active];
  const progress = ((active + 1) / steps.length) * 100;

  return (
    <section className="relative overflow-hidden bg-[#051311] py-24 text-white">
      {/* Decorative dark background layout */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -start-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 end-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-primary-foreground) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
            <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            رحلة إعداد وتأصيل الخطبة المنبرية
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl text-white">
            شاهد كيف تتشكل <span className="text-gradient-brand">مسودة خطبتك</span> لحظة بلحظة
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            تتبع مسار توليد وتوثيق الأفكار والأدلة الشرعية داخل الورشة، واكتشف التزامنا الصارم بحفظ موثوقية كل حرف وكلمة.
          </p>
        </div>

        <div
          className="relative mx-auto mt-16 max-w-5xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Glowing halo */}
          <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-brand opacity-10 blur-3xl" />

          {/* Main Stage Card */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {/* Header info */}
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-slate-300">
                  محاكاة عملية التوليد والتوثيق الفوري
                </span>
              </div>
              <span className="text-xs font-mono">
                المرحلة {active + 1} / {steps.length}
              </span>
            </div>

            {/* Progress line */}
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Step Content */}
            <div className="mt-8 grid gap-8 md:grid-cols-[18rem_1fr]">
              {/* Mobile horizontal stepper (shown only on mobile) */}
              <div className="flex flex-col items-center gap-4 md:hidden">
                <div className="relative flex items-center justify-between w-full max-w-[20rem] px-2 mb-2">
                  {/* Background line */}
                  <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-white/10 -z-10" />
                  {/* Progress line */}
                  <div
                    className="absolute start-4 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-brand -z-10 transition-all duration-500 ease-out"
                    style={{ width: `calc(${((active) / (steps.length - 1)) * 100}% - 1.5rem)` }}
                  />

                  {steps.map((st, idx) => {
                    const isActive = idx === active;
                    const isDone = idx < active;
                    return (
                      <button
                        key={st.num}
                        type="button"
                        onClick={() => setActive(idx)}
                        className="relative focus:outline-none"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${isActive
                            ? "bg-gradient-brand text-slate-950 scale-110 shadow-lg ring-4 ring-primary/20 animate-pulse-slow font-mono font-bold"
                            : isDone
                              ? "bg-gradient-brand text-slate-950 font-mono font-bold"
                              : "bg-white/5 text-slate-400 border border-white/10 font-mono"
                            }`}
                        >
                          {isDone ? "✓" : st.num}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* Active step name and subtext */}
                <div className="text-center">
                  <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                    {current.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">{current.desc}</p>
                </div>
              </div>

              {/* Selector Buttons (Desktop) */}
              <ol className="relative hidden space-y-3 md:block">
                <span aria-hidden className="absolute end-[1.45rem] top-3 bottom-3 w-px bg-white/10" />
                {steps.map((st, idx) => {
                  const isActive = idx === active;
                  const isDone = idx < active;
                  return (
                    <li key={st.num}>
                      <button
                        type="button"
                        onClick={() => setActive(idx)}
                        className={`group relative flex w-full items-center gap-3 rounded-xl border p-3 text-right transition-all duration-300 ${isActive
                          ? "border-primary/50 bg-primary/10 text-white"
                          : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5"
                          }`}
                      >
                        <div className="relative shrink-0">
                          {isActive && (
                            <span className="absolute -inset-1 rounded-xl bg-gradient-brand opacity-40 blur-md" />
                          )}
                          <div
                            className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black transition-all ${isActive || isDone
                              ? "bg-gradient-brand text-slate-950 font-bold font-mono"
                              : "bg-white/5 text-slate-400"
                              }`}
                          >
                            {isDone ? "✓" : st.num}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1 font-sans">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/80 block">
                            {st.tag}
                          </span>
                          <span className="text-sm font-bold block mt-0.5">{st.title}</span>
                        </div>
                        {isActive && <ChevronLeft className="h-4 w-4 shrink-0 text-primary" />}
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* Terminal & Preview Screen */}
              <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
                {/* Console Log Title */}
                <div className="border-b border-white/5 pb-3">
                  <p className="text-xs font-mono text-primary">console_logs &gt; {current.query}</p>
                </div>

                {/* Console Logs list */}
                <div className="flex-1 space-y-2 font-mono text-xs text-slate-300">
                  {current.logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary/70 select-none">&gt;&gt;</span>
                      <p>{log}</p>
                    </div>
                  ))}
                </div>

                {/* Result Block */}
                <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                    <Sparkles className="h-4 w-4" />
                    <span>مخرج عملية الصياغة الذكية:</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">
                    {current.result}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Guarantees Section ---------- */
function GuaranteesSection() {
  return (
    <section className="relative py-24 bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">الضمانات التقنية والشرعية</span>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl">
            ضمانات المنصة لخطباء منبر رسول الله ﷺ
          </h2>
          <p className="max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed">
            المنصة صممت بالكامل لتوفير حماية كاملة ودقيقة لخطبتك، مع ميزات أمان علمية متفوقة تضع قراراتك وخبرتك الفقهية في المقدمة.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "المسؤولية الشرعية لك وحدك",
              desc: "لا تقوم المنصة بفرض أسلوب أو استنتاج فقهي عليك. المسودة تُقدّم كمخطط أولي كامل القابلية للتعديل والحذف وتغيير الأحكام وفقاً لعلمك وبصيرتك.",
              badge: "كامل الحرية"
            },
            {
              title: "أصالة المصادر العلمية",
              desc: "جميع أدلتنا القرآنية والحديثية تُسحب مباشرة وبالرسم العثماني المعترف به من المنصات العلمية السبعة المعتمدة، مع تخريج فوري بدرجة الصحة.",
              badge: "موثقة 100%"
            },
            {
              title: "أمان البيانات والخصوصية",
              desc: "محادثاتك وأفكارك ومسوداتك تُحفظ في مساحة عمل آمنة ومشفرة بالكامل وخاصة بك وحدك، ولا يتم مشاركتها أو استخدامها لتدريب نماذج ذكاء عامة.",
              badge: "سرية تامة"
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col justify-between p-6 border border-border/80 rounded-2xl bg-card shadow-sm hover:shadow-md transition-all">
              <div>
                <span className="inline-flex px-2.5 py-1 text-[10px] font-semibold text-primary bg-primary/10 rounded-full mb-4">
                  {item.badge}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cinematic CTA banner with elastic hover animation */}
        <div className="relative mt-20 overflow-hidden rounded-[2rem] bg-gradient-brand p-8 text-primary-foreground text-center sm:p-12 shadow-elegant transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:scale-[1.012] hover:shadow-2xl hover:ring-4 hover:ring-primary/20">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_10%,_transparent_100%)]" />
          <h3 className="relative text-2xl font-black sm:text-3xl leading-snug">
            التجربة أفضل برهان.. صغ خطبتك المقبلة في دقائق معدودة!
          </h3>
          <p className="relative max-w-xl mx-auto mt-4 text-sm text-primary-foreground/90 leading-loose">
            تخلص من رهبة الصفحة البيضاء وتعب التفتيش. انضم لمئات الأئمة والخطباء الذين يبنون هياكل خطبهم وأدلتهم بذكاء وسرعة، مع الحفاظ الكامل على أصالة وعمق الرسالة الدعوية.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Link to="/workshop">
              <Button size="lg" variant="secondary" className="group rounded-full px-8 py-6 text-base font-semibold text-primary hover:bg-white transition-all hover:scale-105 cursor-pointer shadow-lg">
                <Wand2 className="ms-2 h-5 w-5" />
                ابدأ ورشتك الأولى مجاناً
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
