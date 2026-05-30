import { useEffect, useState, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Sparkles,
  Target,
  Users,
  Clock,
  Layers,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Wand2,
  FileText,
  Quote,
  Star,
  ChevronRight,
  ChevronLeft,
  Terminal,
  Lock,
  Activity,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingChrome";
import challengeBg from "@/assets/bg-khatiib-01.png";
import { Logo } from "@/components/brand/Logo";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "منصة خطيب — ورشة صياغة الخطبة" },
      {
        name: "description",
        content:
          "ورشة موجَّهة لصياغة خطبك الإسلامية: من الفكرة إلى المسودة الكاملة، خطوة بخطوة، بأسلوبك أنت.",
      },
      { property: "og:title", content: "منصة خطيب — ورشة صياغة الخطبة" },
      {
        property: "og:description",
        content:
          "ابدأ ورشة الصياغة الموجَّهة الآن: موضوع، جمهور، محاور، ومسودة جاهزة للتعديل بين يديك.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div dir="rtl" className="min-h-svh bg-background text-foreground">
      <MarketingHeader />
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <FlowDiagram />
      <OutcomeSection />
      <SourcesAnimationSection />
      <FaqSection />
      <FinalCTA />
      <MarketingFooter />
    </div>
  );
}


/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      {/* glow background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-1/3 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
        {/* Right side (text) */}
        <div className="space-y-7 text-center lg:text-right flex flex-col items-center lg:items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            ورشة موجَّهة لصياغة مسودة خطبة الجمعة
          </span>

          <h1 className="text-4xl font-black leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            من فكرة أو نازلة..
            <br />
            إلى <span className="text-gradient-brand">خطبة منبر</span> متماسكة.
          </h1>

          <p className="max-w-xl text-base leading-loose text-muted-foreground sm:text-lg">
            ورشة عمل تأخذ بيدك خطوةً خطوة: تختار الموضوع والجمهور والنبرة والمحاور، ثم تنطلق
            بمسودةٍ كاملة بين يديك تُهذّبها بأسلوبك. أنت الإمام، ونحن ورشتك.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <Link to="/workshop" search={{ topic: undefined }}>
              <Button
                size="lg"
                className="group rounded-full bg-gradient-brand px-7 py-6 text-base font-semibold shadow-elegant transition-all hover:translate-y-[-1px] hover:opacity-95 cursor-pointer"
              >
                <Wand2 className="ms-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                ابدأ ورشتك الآن
                <ArrowLeft className="me-1 h-5 w-5 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:justify-start gap-2 lg:gap-3 pt-4 text-sm text-muted-foreground">
            {/* First Line on Mobile: Stars + Score */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-foreground">4.9/5</span>
            </div>

            {/* Dot separator (desktop only) */}
            <span className="hidden lg:inline text-muted-foreground/60">·</span>

            {/* Second Line on Mobile: Description */}
            <span>مئات الخطباء يصوغون خطبهم على المنصة</span>
          </div>
        </div>

        {/* Left side (visual card) */}
        <div className="relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  const [step, setStep] = useState(0);
  const [sourceIdx, setSourceIdx] = useState(0);

  useEffect(() => {
    if (step === 0) {
      setSourceIdx(0);
      const interval = setInterval(() => {
        setSourceIdx((prev) => (prev < 7 ? prev + 1 : 7));
      }, 625); // 625ms * 8 = 5000ms (perfect alignment with 5s loader)
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const runLoop = (currentStep: number) => {
      // Step 0 (Loading logo) gets 5000ms, Step 5 (Success overlay) gets 4000ms climax.
      // Other generation steps (1, 2, 3, 4) get 1500ms.
      let duration = 1500;
      if (currentStep === 0) duration = 5000;
      else if (currentStep === 5) duration = 4000;

      timer = setTimeout(() => {
        const next = (currentStep + 1) % 6;
        setStep(next);
        runLoop(next);
      }, duration);
    };

    runLoop(0);
    return () => clearTimeout(timer);
  }, []);

  const axes = [
    { icon: Target, text: "المحور الأول: حقيقة الصبر ومكانته في القرآن" },
    { icon: Layers, text: "المحور الثاني: أنواع الصبر الثلاثة" },
    { icon: Users, text: "المحور الثالث: قصص الأنبياء في الصبر" },
    { icon: CheckCircle2, text: "خطوات عملية لتربية النفس على الصبر" },
  ];

  return (
    <div className="relative">
      {/* Glow background */}
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-brand opacity-20 blur-2xl transition-all duration-1000" />

      {/* Decorative stars / sparks on step 4 */}
      {step === 4 && (
        <>
          <span className="pointer-events-none absolute -top-4 -start-4 h-4 w-4 text-amber-400 animate-bounce">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="pointer-events-none absolute -bottom-4 -end-4 h-4 w-4 text-primary animate-pulse">
            <Sparkles className="h-4 w-4" />
          </span>
        </>
      )}

      {/* Floating verified reference card in step 3 */}
      {step === 3 && (
        <div className="absolute -top-8 -end-8 hidden max-w-[14rem] rounded-xl border border-primary/40 bg-card p-3.5 shadow-elegant sm:block animate-[workshop-rise_0.4s_ease-out_both] z-20">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-[10px] font-bold text-primary">تم تخريج الآية بنجاح</span>
          </div>
          <p className="mt-1.5 text-xs font-serif leading-relaxed text-foreground font-semibold">
            ﴿ وَبَشِّرِ الصَّابِرِينَ ﴾
          </p>
          <p className="text-[9px] text-muted-foreground mt-0.5">البقرة: ١٥٥ · الرسم العثماني</p>
        </div>
      )}

      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-7 shadow-elegant transition-all duration-500">

        {/* Shimmer overlay for when draft is compiling */}
        {step > 0 && step < 4 && (
          <div className="absolute inset-0 pointer-events-none z-10 opacity-30 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-[workshop-shimmer_3s_infinite] bg-[length:200%_100%]" />
        )}

        {/* Top Header Row */}
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-500 ${step === 0 ? "bg-muted text-muted-foreground animate-pulse" :
            step === 1 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse" :
              step === 2 ? "bg-sky-500/10 text-sky-600 dark:text-sky-400" :
                step === 3 ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" :
                  step === 4 ? "bg-success/15 text-success font-bold" :
                    "bg-primary/15 text-primary font-extrabold"
            }`}>
            {step === 0 && "تهيئة المنصة... 🔄"}
            {step === 1 && "تحديد الموضوع... 📝"}
            {step === 2 && "توليد المحاور... ⚡"}
            {step === 3 && "توثيق الآيات والأحاديث... 📖"}
            {step === 4 && "المسودة جاهزة! ✨"}
            {step === 5 && "صياغة مكتملة! 🎉"}
          </span>

          {/* Steps Indicator dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${s === step
                  ? "bg-primary w-5 opacity-100"
                  : s < step
                    ? "bg-primary/50 opacity-60"
                    : "bg-muted-foreground/30 opacity-40"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* Title & Category info */}
        <div className="mt-5 min-h-[4rem]">
          <h3 className="font-display text-2xl font-extrabold leading-snug flex items-center gap-2">
            {step <= 1 ? (
              <span className="text-foreground/90 border-l-2 border-primary pl-2 animate-pulse">
                الصبر في زمن الفتن
              </span>
            ) : (
              <span className="text-foreground transition-all duration-500">
                الصبر في زمن الفتن
              </span>
            )}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground transition-opacity duration-300">
            خطبة جمعة · 18 دقيقة · جمهور عام
          </p>
        </div>

        {/* Dynamic Sermon Axes (Outline) */}
        <div className="mt-6 space-y-3 min-h-[17.5rem]">
          {axes.map((row, i) => {
            const isLoaded = step >= 2;
            const isHighlighted = step === 3 && i === 0; // Highlight first axis in reference step
            const Icon = row.icon;

            return (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all duration-500 ${isHighlighted
                  ? "border-primary bg-primary/5 shadow-md scale-[1.02] ring-1 ring-primary/30"
                  : isLoaded
                    ? "border-border bg-surface-muted/60"
                    : "border-border/40 bg-surface-muted/20 opacity-50"
                  }`}
              >
                {/* Check/Number Icon Container */}
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${isHighlighted
                  ? "bg-primary text-primary-foreground scale-110 shadow-sm"
                  : isLoaded
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground/40 animate-pulse"
                  }`}>
                  {isLoaded ? (
                    <Icon className={`h-4 w-4 ${isHighlighted ? "animate-pulse" : ""}`} />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30 animate-pulse" />
                  )}
                </div>

                {/* Content block */}
                <div className="flex-1 pt-1 min-h-[1.5rem]">
                  {isLoaded ? (
                    <div className="animate-[workshop-chip-in_0.4s_ease-out_both]" style={{ animationDelay: `${i * 120}ms` }}>
                      <p className="text-sm leading-relaxed text-foreground font-semibold">
                        {row.text}
                      </p>
                    </div>
                  ) : (
                    /* Perfectly sized grey skeleton simulator to prevent any layout shifts */
                    <div className="space-y-2 py-1">
                      <div
                        className="h-3 rounded-full bg-muted animate-pulse"
                        style={{ width: i === 0 ? "85%" : i === 1 ? "65%" : i === 2 ? "75%" : "50%" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Status / Download Banner at bottom */}
        <div className={`mt-6 flex items-center justify-between rounded-xl p-4 transition-all duration-500 ${step === 4
          ? "bg-gradient-brand text-primary-foreground shadow-lg scale-100 opacity-100"
          : "bg-surface-muted border border-border text-muted-foreground"
          }`}>
          <div className="text-right">
            <p className="text-xs transition-opacity duration-300">
              {step <= 1 && "بناء الفكرة والمدخل الأساسي..."}
              {step === 2 && "جاري صياغة هيكل المحاور وترتيب الأفكار..."}
              {step === 3 && "جاري إدراج الآيات القرآنية والأحاديث..."}
              {step === 4 && "جاهزة للتنزيل والتعديل"}
            </p>
            <p className={`text-sm font-bold transition-all duration-500 ${step === 4 ? "text-white" : "text-foreground"
              }`}>
              {step <= 1 && "1. تهيئة الموضوع..."}
              {step === 2 && "2. بناء الهيكل الموضوعي..."}
              {step === 3 && "3. توثيق وتخريج المراجع..."}
              {step === 4 && "المسودة الكاملة بين يديك"}
            </p>
          </div>

          <div className="relative">
            {step === 4 && (
              <span className="absolute -inset-2 rounded-full bg-white/20 animate-ping" />
            )}
            <div className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 ${step === 4
              ? "bg-white/20 text-white"
              : "bg-muted text-muted-foreground/50"
              }`}>
              {step === 4 ? (
                <FileText className="h-5 w-5 animate-pulse" />
              ) : (
                <Wand2 className="h-5 w-5 animate-spin [animation-duration:3s]" />
              )}
            </div>
          </div>
        </div>

        {/* Loading Overlay Screen (Step 0 - Initialization) */}
        {step === 0 && (
          <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-center p-7 bg-card rounded-[2rem] border border-border shadow-elegant animate-[workshop-stage-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
            {/* Ambient glowing circles */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl pointer-events-none" />

            {/* Logo with pulsing effect */}
            <Logo size="lg" className="animate-pulse [animation-duration:2.5s]" />

            <p className="mt-3.5 max-w-xs text-xs font-semibold leading-relaxed text-muted-foreground animate-pulse">
              تهيئة ورشة العمل المنهجية المعتمدة...
            </p>

            {/* Loading Progress Bar */}
            <div className="relative mt-5 flex h-1.5 w-40 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-brand animate-[workshop-progress_5s_linear_infinite]" />
            </div>

            {/* 7 Verified Sources - Interactive Terminal Log Box */}
            <div className="mt-5 w-full max-w-[21rem] rounded-xl bg-zinc-950/95 p-3.5 text-right font-mono text-[9px] text-emerald-400 border border-zinc-800/80 shadow-inner min-h-[9rem] flex flex-col justify-between">
              <div className="space-y-1 select-none">
                {[
                  "ربط الباحث القرآني (tafsir.app)... ",
                  "ربط    الدرر السنية (dorar.net)...",
                  "ربط الباحث الحديثي - تطبيق حديث  (hdith.com)  ... ",
                  "ربط موقع إسلام سؤال وجواب (islamqa.info)  ... ",
                  "تحميل سنن ومسانيد السنة النبوية... ",
                  "مزامنة موقع إمام المسجد  (alimam.ws) ... "
                ].map((src, idx) => {
                  const isDone = sourceIdx > idx;
                  const isActive = sourceIdx === idx;
                  if (!isDone && !isActive) return null;
                  return (
                    <p
                      key={idx}
                      className={`animate-[workshop-chip-in_0.2s_ease-out_both] flex items-center gap-1.5 justify-end transition-colors duration-300 ${isDone ? "text-emerald-500/80" : "text-emerald-400 font-bold animate-pulse"
                        }`}
                    >
                      <span>{src}</span>
                      <span className="text-[10px] font-bold">{isDone ? "✓" : "⚡"}</span>
                    </p>
                  );
                })}
              </div>

              <div className="border-t border-zinc-800/50 pt-2 mt-2 flex items-center justify-between text-[8px] text-zinc-500 select-none">
                <span>{sourceIdx === 7 ? "اكتمل ربط 7 مصادر شرعية!" : "جاري فحص وتوثيق المصادر..."}</span>
                <span>تخريج المصادر: {Math.min(sourceIdx, 7)}/7</span>
              </div>
            </div>
          </div>
        )}

        {/* Success Overlay Screen (Step 5 - Climax Showcase) */}
        {step === 5 && (
          <div className="absolute inset-0 z-30 flex flex-col justify-center items-center text-center p-7 bg-card/98 backdrop-blur-md rounded-[2rem] animate-[workshop-stage-in_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
            {/* Ambient gold/emerald background circles inside overlay */}
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-success/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl pointer-events-none" />

            {/* Spinning decorative orbit ring in background */}
            <div className="absolute h-48 w-48 rounded-full border border-success/10 animate-[workshop-ring-spin_12s_linear_infinite]" />

            {/* Glowing check circle in center */}
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 border border-success/20 shadow-[0_0_20px_rgba(34,197,94,0.15)] animate-bounce [animation-duration:2.5s]">
              {/* Ripple wave */}
              <span className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
              <Check className="h-8 w-8 text-success stroke-[2.5]" />
            </div>

            {/* Headline */}
            <h3 className="font-display text-2xl font-black leading-tight text-gradient-brand">
              تمت الصياغة بنجاح! 🎉
            </h3>

            <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
              مسودتك المتكاملة أصبحت جاهزة للتنزيل وبدء تعديلها بأسلوبك الشخصي.
            </p>

            {/* Metrics Chips Grid */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface-muted/50 px-3 py-1 text-[11px] font-semibold text-muted-foreground animate-[workshop-chip-in_0.4s_ease-out_both] [animation-delay:100ms]">
                <FileText className="h-3 w-3 text-primary" />
                ١,٤٢٠ كلمة موثقة
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface-muted/50 px-3 py-1 text-[11px] font-semibold text-muted-foreground animate-[workshop-chip-in_0.4s_ease-out_both] [animation-delay:200ms]">
                <Clock className="h-3 w-3 text-primary" />
                ١٨ دقيقة إلقاء
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-surface-muted/50 px-3 py-1 text-[11px] font-semibold text-muted-foreground animate-[workshop-chip-in_0.4s_ease-out_both] [animation-delay:300ms]">
                <ShieldCheck className="h-3 w-3 text-primary" />
                تأصيل شرعي معتمد
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

/* ---------- Trust strip ---------- */
function TrustStrip() {
  const items = [
    { icon: ShieldCheck, label: "هياكل موضوعية مضبوطة " },
    { icon: BookOpen, label: "مراجع قرآنية ونبوية" },
    { icon: Sparkles, label: "ورشة صياغة ذكية متكاملة   " },
    { icon: Users, label: "ربط مباشر بالمصادر الشرعية  " },
  ];
  return (
    <section className="border-y border-border/60 bg-surface-muted/50">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <it.icon className="h-5 w-5 text-primary" />
            <span className="font-medium text-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Problem section ---------- */
function ProblemSection() {
  const pains = [
    {
      title: "صفحة فارغة",
      body: "تجلس لتكتب خطبتك وتصدمك الصفحة البيضاء؛ موضوعٌ مكرَّر أو فكرةٌ لا تنضج.",
    },
    {
      title: "محاور مبعثرة",
      body: "أفكار كثيرة لكن بلا ترتيب، فتتحول الخطبة إلى نقاطٍ متفرقة بلا خيط جامع.",
    },
    {
      title: "ضيق الوقت",
      body: "ساعات الإعداد لا تكفي، وبين البحث والصياغة يضيع التركيز على روح الخطبة.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-foreground py-20 text-background sm:py-24">
      <img
        src={challengeBg}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-foreground/10 backdrop-blur-sm"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-warning">
            تحدّي الخطيب
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            تقضي 70٪ من وقتك في بناء الهيكل وتخريج الأثر، بدلاً من <span className="text-warning">التركيز</span> على رسالتك الدعوية.
          </h2>
          <p className="mt-5 text-base leading-loose text-background/70">
            الفكرة تولد متوهجة، ثم تخفت بين البحث والترتيب والتنقيح؛ المنبر يستحق ورشةً تحفظ التوهج وتختصر الجهد.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pains.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-background/10 bg-background/5 p-7 backdrop-blur-md transition-colors hover:bg-background/10"
            >
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-3 text-sm leading-loose text-background/70">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



/* ---------- Flow diagram ---------- */
function FlowDiagram() {
  const items = [
    {
      n: "01",
      t: "الموضوع",
      s: "تختار الفكرة والنوع",
      icon: Target,
      kicker: "حدِّد البذرة",
      preview: {
        label: "موضوع الخطبة",
        value: "فضل الصبر في زمن الفتن",
        tags: ["إيمانية", "تربوية", "جمعة"],
      },
    },
    {
      n: "02",
      t: "الجمهور",
      s: "تحدّد المستمعين",
      icon: Users,
      kicker: "اعرف من تخاطب",
      preview: {
        label: "الجمهور المستهدف",
        value: "شباب المسجد · طلبة العلم ",
        tags: ["شباب", "عامّ", "أُسر"],
      },
    },
    {
      n: "03",
      t: "النبرة",
      s: "تضبط المدة والأسلوب",
      icon: Clock,
      kicker: "اضبط الإيقاع",
      preview: {
        label: "النبرة والمدة",
        value: "اجتماعي معالج  · 12 دقيقة",
        tags: ["علمي تأصيلي", "فقهي تاصلي", "وعظي مؤثر"],
      },
    },
    {
      n: "04",
      t: "المحاور",
      s: "ترسم الهيكل",
      icon: Layers,
      kicker: "ابنِ الهيكل",
      preview: {
        label: "محاور الخطبة",
        value: "مقدمة · ثلاث وقفات · خاتمة",
        tags: ["حقيقة الموضوع ومكانته    ", "الواقع المعاصر وتحدياته ", "أثره على الأسرة والمجتمع   "],
      },
    },
    {
      n: "05",
      t: "المسودة",
      s: "تستلم الخطبة",
      icon: FileText,
      kicker: "استلم المسودة",
      preview: {
        label: "مسودة جاهزة",
        value: "1420 كلمة · منظَّمة وقابلة للتعديل",
        tags: ["PDF", "Word", "نسخ"],
      },
    },
  ];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, 2600);
    return () => clearInterval(id);
  }, [paused, items.length]);

  const current = items[active];
  const progress = ((active + 1) / items.length) * 100;
  const ActiveIcon = current.icon;

  return (
    <section
      id="workshop"
      className="relative overflow-hidden border-y border-border/60 bg-surface-muted/40 py-24"
    >
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -start-24 h-80 w-80 rounded-full bg-gradient-brand opacity-20 blur-3xl workshop-halo" />
        <div
          className="absolute -bottom-40 -end-20 h-96 w-96 rounded-full bg-primary/30 blur-3xl workshop-halo"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            مسار الورشة
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            خمس خطوات..{" "}
            <span className="text-gradient-brand">مسودة جاهزة</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
            رحلة موجَّهة من الفكرة الأولى إلى خطبة منظَّمة، تشاهدها تتشكّل لحظة بلحظة.
          </p>
        </div>

        <div
          className="relative mx-auto mt-16 max-w-5xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Outer glow */}
          <div className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-brand opacity-25 blur-3xl workshop-halo" />

          {/* Main stage card */}
          <div className="workshop-card-rise relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/90 p-6 shadow-elegant backdrop-blur-xl sm:p-8">
            {/* Top shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px workshop-shimmer" />

            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success workshop-pulse-ring" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  الورشة قيد التشغيل
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground">
                خطوة {active + 1} / {items.length}
              </span>
            </div>

            {/* Global progress bar */}
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stage layout: timeline + preview */}
            <div className="mt-7 grid gap-6 md:grid-cols-[16rem_1fr]">
              {/* Mobile horizontal stepper (shown only on mobile) */}
              <div className="flex flex-col items-center gap-4 md:hidden">
                <div className="relative flex items-center justify-between w-full max-w-[20rem] px-2 mb-2">
                  {/* Background line */}
                  <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-border -z-10" />
                  {/* Progress line */}
                  <div
                    className="absolute start-4 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-brand -z-10 transition-all duration-500 ease-out"
                    style={{ width: `calc(${((active) / (items.length - 1)) * 100}% - 1.5rem)` }}
                  />

                  {items.map((it, idx) => {
                    const isActive = idx === active;
                    const isDone = idx < active;
                    return (
                      <button
                        key={it.n}
                        type="button"
                        onClick={() => setActive(idx)}
                        className="relative focus:outline-none"
                      >
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${isActive
                            ? "bg-gradient-brand text-primary-foreground scale-110 shadow-lg ring-4 ring-primary/20 animate-pulse-slow"
                            : isDone
                              ? "bg-gradient-brand text-primary-foreground"
                              : "bg-muted text-muted-foreground border border-border"
                            }`}
                        >
                          {isDone ? "✓" : it.n}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* Active step name and subtext */}
                <div className="text-center">
                  <h3 className="text-sm font-bold text-foreground flex items-center justify-center gap-1.5">
                    <current.icon className="h-4 w-4 text-primary animate-pulse-slow" />
                    {current.t}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{current.s}</p>
                </div>
              </div>

              {/* Vertical timeline (Desktop) */}
              <ol className="relative hidden space-y-2 md:block">
                {/* Vertical line */}
                <span
                  aria-hidden
                  className="absolute end-[1.4rem] top-3 bottom-3 w-px bg-border"
                />
                <span
                  aria-hidden
                  className="absolute end-[1.4rem] top-3 w-px bg-gradient-to-b from-primary to-primary/0 workshop-line-grow"
                  style={{
                    height: `calc(${progress}% - ${progress > 0 ? "1rem" : "0px"})`,
                    transition: "height 700ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                />

                {items.map((it, idx) => {
                  const isActive = idx === active;
                  const isDone = idx < active;
                  const Icon = it.icon;
                  return (
                    <li key={it.n}>
                      <button
                        type="button"
                        onClick={() => setActive(idx)}
                        className={`group relative flex w-full items-center gap-3 rounded-xl border p-2.5 text-right transition-all duration-300 ${isActive
                          ? "border-primary/50 bg-primary/5 shadow-sm"
                          : "border-transparent hover:border-border hover:bg-surface-muted/60"
                          }`}
                      >
                        <div className="relative shrink-0">
                          {isActive && (
                            <span className="absolute -inset-1 rounded-xl bg-gradient-brand opacity-50 blur-md" />
                          )}
                          <div
                            className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-black transition-colors duration-300 ${isActive || isDone
                              ? "bg-gradient-brand text-primary-foreground shadow-md"
                              : "bg-muted text-muted-foreground"
                              }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-5 w-5" />
                            ) : (
                              it.n
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className={`h-3.5 w-3.5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"
                                }`}
                            />
                            <span
                              className={`text-sm font-bold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"
                                }`}
                            >
                              {it.t}
                            </span>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {it.s}
                          </p>
                        </div>
                        {isActive && (
                          <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-primary" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ol>

              {/* Live preview canvas */}
              <div
                key={active}
                className="workshop-stage-in relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-surface-muted/70 via-card to-surface-muted/40 p-5 sm:p-6"
              >
                {/* Decorative ring */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-16 -top-16 h-44 w-44 rounded-full border border-primary/15 workshop-ring-spin"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -end-10 -top-10 h-32 w-32 rounded-full border border-primary/25"
                />

                {/* Sparks */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute end-6 top-6 h-1.5 w-1.5 rounded-full bg-primary workshop-spark"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute end-12 top-10 h-1 w-1 rounded-full bg-primary/70 workshop-spark"
                  style={{ animationDelay: "0.4s" }}
                />

                {/* Kicker */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-lg bg-gradient-brand opacity-50 blur-md" />
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand text-primary-foreground shadow-md">
                      <ActiveIcon className="h-4 w-4" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                      {current.kicker}
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {current.t}
                    </p>
                  </div>
                </div>

                {/* Animated content surface */}
                <div className="mt-5 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {current.preview.label}
                  </p>
                  <p className="mt-2 font-display text-lg font-extrabold leading-snug text-foreground sm:text-xl">
                    <span className="workshop-type workshop-caret max-w-full">
                      {current.preview.value}
                    </span>
                  </p>

                  {/* Chips */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {current.preview.tags.map((tag, i) => (
                      <span
                        key={`${active}-${tag}`}
                        className="workshop-chip-in inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary"
                        style={{ animationDelay: `${0.25 + i * 0.1}s` }}
                      >
                        <span className="h-1 w-1 rounded-full bg-primary" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Mock content bars */}
                  <div className="mt-5 space-y-2">
                    {[92, 76, 64].map((w, i) => (
                      <div
                        key={`${active}-bar-${i}`}
                        className="h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className="workshop-bar-fill h-full rounded-full bg-gradient-to-l from-primary/70 to-primary/30"
                          style={{
                            width: `${w}%`,
                            animationDelay: `${0.35 + i * 0.12}s`,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Foot status */}
                <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" />
                    موجَّهة بذكاء
                  </span>
                  <span className="font-mono">
                    {String(active + 1).padStart(2, "0")} /{" "}
                    {String(items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer result */}
            <div
              className="workshop-card-rise relative mt-7 overflow-hidden rounded-2xl bg-gradient-brand p-5 text-primary-foreground"
              style={{ animationDelay: "0.6s" }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                }}
              />
              <div className="relative flex items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-xs opacity-90">في أقل من 8 دقائق</p>
                  <p className="mt-0.5 text-base font-bold sm:text-lg">
                    مسودة منظَّمة جاهزة للإلقاء
                  </p>
                </div>
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-full bg-white/30 workshop-pulse-ring" />
                  <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating accent chips */}
          <div className="workshop-float pointer-events-none absolute -top-6 -end-4 hidden rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-elegant backdrop-blur sm:flex sm:items-center sm:gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">موجَّهة بذكاء</span>
          </div>
          <div
            className="workshop-float pointer-events-none absolute -bottom-5 -start-4 hidden rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-elegant backdrop-blur sm:flex sm:items-center sm:gap-2"
            style={{ animationDelay: "2s" }}
          >
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">‏3-8 دقائق فقط</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Outcome ---------- */
function OutcomeSection() {
  return (
    <section id="outcome" className="bg-background py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
        <div className="space-y-6 text-right">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            النتيجة النهائية
          </span>
          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            خطبتك جاهزة..
            <br />
            <span className="text-gradient-brand">بأسلوبك أنت</span>.
          </h2>
          <p className="text-base leading-loose text-muted-foreground">
            مسودةٌ كاملة بآياتها وأحاديثها ومحاورها وخاتمتها — منسَّقة، قابلة للتعديل، وجاهزة
            للحفظ والمشاركة والإلقاء. بين يديك أداةٌ تختصر ساعات، وتترك لك ما لا يُعوَّض: روح
            الخطبة وتوقيعك الشخصي.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              "مقدّمة، محاور، خاتمة — منظَّمة بترتيب علمي",
              "آيات وأحاديث وأقوال مرتبطة بمحاور الخطبة",
              "تطبيقات عملية واقعية للمستمعين",
              "حفظ في أرشيفك الخاص ومشاركة بنقرة واحدة",
            ].map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm leading-relaxed">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="pt-3">
            <Link to="/workshop" search={{ topic: undefined }}>
              <Button size="lg" className="rounded-full bg-gradient-brand px-7 py-6 text-base font-semibold shadow-elegant">
                <Wand2 className="ms-2 h-5 w-5" />
                جرّب الورشة الآن
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-brand opacity-15 blur-2xl" />
          <div className="rounded-[1.75rem] border border-border bg-card p-7 shadow-elegant">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h4 className="font-display text-xl font-extrabold">الخطبة الكاملة</h4>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                جاهزة
              </span>
            </div>
            <div className="mt-5 space-y-3.5">
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-11/12 rounded-full bg-muted" />
              <div className="h-3 w-9/12 rounded-full bg-muted" />
              <div className="my-4 rounded-xl border-r-4 border-primary bg-primary/5 p-3.5 text-right">
                <p className="text-xs leading-relaxed text-foreground">
                  ﴿ وَبَشِّرِ الصَّابِرِينَ ٱلَّذِينَ إِذَآ أَصَٰبَتْهُم مُّصِيبَةٌۭ قَالُوٓاْ إِنَّا لِلَّهِ وَإِنَّآ إِلَيْهِ رَٰجِعُونَ ﴾
                </p>
              </div>
              <div className="h-3 w-full rounded-full bg-muted" />
              <div className="h-3 w-10/12 rounded-full bg-muted" />
              <div className="h-3 w-8/12 rounded-full bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



/* ---------- Sources Animation Section ---------- */
function SourcesAnimationSection() {
  const sourcesData = [
    {
      num: "01",
      title: "الباحث القرآني",
      site: "tafsir.app",
      desc: "تفسير الآيات بالرسم العثماني",
      query: "البحث عن نص وتفسير: ﴿وَبَشِّرِ الصَّابِرِينَ﴾",
      logs: [
        "الاتصال بـ tafsir.app عبر بروتوكول آمن...",
        "مطابقة الرسم العثماني بمجمع الملك فهد لطباعة المصحف.",
        "استخراج تفسير الآية من التفسير الميسر وتفسير ابن كثير.",
        "تم فحص وتوثيق الآية الكريمة بنجاح."
      ],
      result: "تم استيراد الآية بالرسم العثماني المطابق للمصاحف ﴿وَبَشِّرِ الصَّابِرِينَ﴾ مع تفسيرها لتأصيل الموعظة.",
      statName: "الرسم المعتمد",
      statValue: "عثماني مطابق للمصحف",
      trustScore: "100%",
      speed: "115ms",
      icon: BookOpen,
      color: "#FF3D02",
    },
    {
      num: "02",
      title: "الباحث الحديثي",
      site: "hdith.com",
      desc: "الفحص التلقائي لكل حديث واستبعاد الضعيف",
      query: "التحقق من صحة حديث: «إنما الأعمال بالنيات»",
      logs: [
        "فحص نص الحديث بسيرفرات hdith.com الفورية...",
        "مطابقة درجات المحدثين وحكم أئمة الشأن على السند.",
        "التحقق من درجة صحة الرواية وخلوها من الشذوذ والعلل.",
        "النتيجة: صحيح (رواه البخاري ومسلم)."
      ],
      result: "تم التحقق واعتماد الحديث الشريف «إنما الأعمال بالنيات» وإدراجه في مقدمة الخطبة كدليل صحيح.",
      statName: "درجة الحديث",
      statValue: "صحيح (متفق عليه)",
      trustScore: "100%",
      speed: "148ms",
      icon: ShieldCheck,
      color: "#F8AE00",
    },
    {
      num: "03",
      title: "الموسوعة الحديثية",
      site: "dorar.net",
      desc: "مراجعة شروح الأحاديث وأقوال السلف المعتمدة",
      query: "مراجعة شروح حديث: «يسروا ولا تعسروا»",
      logs: [
        "سحب شروح الحديث من الموسوعة الكبرى بالدرر السنية...",
        "استخلاص المعاني التربوية المنبرية والفوائد السلوكية.",
        "تنقيح التأويلات وصياغة الشرح بلغة سهلة تناسب المصلين.",
        "مراجعة الأقوال المأثورة المعتمدة وتضمينها في المحور."
      ],
      result: "تمت صياغة شرح منبري بليغ يسهّل فهم مقاصد التيسير ويوضح التطبيقات العملية للمصلين اليوم.",
      statName: "أقوال المفسرين",
      statValue: "3 شروح معتمدة بالسند",
      trustScore: "98%",
      speed: "210ms",
      icon: Layers,
      color: "#874FFF",
    },
    {
      num: "04",
      title: "الدرر السنية",
      site: "dorar.net (التخريج)",
      desc: "توثيق الدرجة العلمية وتخريج السند فورا",
      query: "تخريج إسناد وعزو حديث: «المؤمن القوي...»",
      logs: [
        "مطابقة إسناد الحديث وتتبع سلسلة الرواة في dorar.net...",
        "التحقق من صحة السند وتدوين تصحيح الألباني والعلماء.",
        "عزو الحديث لمصدره الأصلي بدقة وتحديد المخرجين.",
        "النتيجة: صحيح (رواه مسلم)."
      ],
      result: "تم إرفاق العزو الدقيق للحديث الشريف «المؤمن القوي...» لضمان الأمان العلمي والموثوقية المطلقة.",
      statName: "تخريج وعزو",
      statValue: "رواه مسلم بلفظه وعزاه المحدثون",
      trustScore: "100%",
      speed: "185ms",
      icon: FileText,
      color: "#44D084",
    },
    {
      num: "05",
      title: "إسلام ويب",
      site: "islamweb.net",
      desc: "استيراد الترجيحات الشرعية والفتاوى الفقهية",
      query: "استعراض فتاوى: حكم وفضل صلة الرحم بالهاتف",
      logs: [
        "البحث الفقهي في فتاوى الشبكة الإسلامية islamweb.net...",
        "تتبع الآراء الفقهية الراجحة المبنية على الأدلة الشرعية.",
        "صياغة الخلاصة الفقهية بأسلوب ميسر وعملي للمستمعين.",
        "تجنب الآراء الشاذة والمسائل الخلافية الفرعية المعقدة."
      ],
      result: "تم تضمين الخلاصة الفقهية لصلة الرحم بالوسائل الحديثة كأفكار عملية يسهل على المصلين تطبيقها فورا.",
      statName: "المذهب الفقهي",
      statValue: "خلاصة الترجيح بالدليل والأثر",
      trustScore: "96%",
      speed: "260ms",
      icon: Users,
      color: "#00A6FF",
    },
    {
      num: "06",
      title: "إسلام سؤال وجواب",
      site: "islamqa.info",
      desc: "تأصيل شرعي للنوازل والقضايا الحياتية اليومية",
      query: "تأصيل حكم: المعاملات المالية الحديثة والديون",
      logs: [
        "مراجعة فتاوى النوازل بـ islamqa.info واللجنة الدائمة...",
        "فرز الشروط والضوابط الشرعية للمعاملات المالية.",
        "صياغة توجيهات منبرية تحذر من الربا وتحث على الأمانة.",
        "تنقيح الضوابط الشرعية الدقيقة وتأطيرها بأسلوب الوعظ."
      ],
      result: "تم تدعيم الخطبة بضوابط شرعية واضحة تهم المصلين في تجارتهم اليومية مع توضيح فقه كسب الحلال.",
      statName: "نوع التأصيل",
      statValue: "فقه النوازل مدعوما بالدليل",
      trustScore: "97%",
      speed: "230ms",
      icon: Target,
      color: "#F54B8F",
    },
    {
      num: "07",
      title: "شبكة ملتقى الخطباء",
      site: "khutabaa.com",
      desc: "تحليل بلاغي وهيكلي للخطب المنبرية المؤثرة",
      query: "دراسة هياكل وبلاغة خطب: بر الوالدين والصلة",
      logs: [
        "سحب وتحليل أفضل الخطب الملقاة في khutabaa.com...",
        "دراسة الاستهلال والروابط البلاغية والوقفات المؤثرة.",
        "تحديد مواضع التساؤلات المنبرية الارتجالية وعلامات الوقف.",
        "صياغة مسودة الخطبة بجرس لغوي منبري أصيل وراق."
      ],
      result: "تم اقتباس الروح البلاغية والتساؤلات الحية التي تشد المستمع وصياغتها برونق لغوي منبري أصيل.",
      statName: "النمط البلاغي",
      statValue: "منبري بليغ نابض بالروح والوعظ",
      trustScore: "98%",
      speed: "295ms",
      icon: FileText,
      color: "#FF7A00",
    }
  ];

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % sourcesData.length);
    }, 3800);
    return () => clearInterval(id);
  }, [paused, sourcesData.length]);

  const current = sourcesData[active];
  const progress = ((active + 1) / sourcesData.length) * 100;
  const ActiveIcon = current.icon;

  return (
    <section
      id="sources-animation"
      className="relative overflow-hidden border-b border-border/60 bg-background py-24"
    >
      {/* Ambient background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -end-24 h-96 w-96 rounded-full bg-gradient-brand opacity-15 blur-3xl workshop-halo" />
        <div
          className="absolute -bottom-48 -start-24 h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl workshop-halo"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur">
            <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            سلسلة التوثيق الذكي
          </span>
          <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            شاهد كيف تتشكّل{" "}
            <span className="text-gradient-brand">موثوقية خطبتك</span> لحظة بلحظة
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            دورة التحقق التلقائي والفوري عبر قواعد البيانات السبعة المعتمدة. يطوف الذكاء الاصطناعي بكل دليل، ليفحص درجته العلمية ويؤصل الكلمات بدقة بالغة.
          </p>
        </div>

        <div
          className="relative mx-auto mt-16 max-w-5xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Outer background glow */}
          <div className="absolute -inset-10 -z-10 rounded-[3rem] bg-gradient-brand opacity-15 blur-3xl workshop-halo" />

          {/* Main Card Console */}
          <div className="workshop-card-rise relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/90 p-5 shadow-elegant backdrop-blur-xl sm:p-8">
            {/* Top shimmer styling */}
            <div className="absolute inset-x-0 top-0 h-px workshop-shimmer" />

            {/* Header info */}
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 workshop-pulse-ring" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  بروتوكول التحقق والتوثيق الشرعي النشط
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-wider bg-muted px-2.5 py-1 rounded-md">
                المصدر الموثق {active + 1} / {sourcesData.length}
              </span>
            </div>

            {/* Progress line */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full rounded-full bg-gradient-brand transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Column Layout */}
            <div className="mt-7 grid gap-8 md:grid-cols-[18rem_1fr] items-start">
              {/* Right Side: Tab items of 7 sources */}
              <div className="relative space-y-2.5">
                {sourcesData.map((s, idx) => {
                  const isActive = idx === active;
                  const isDone = idx < active;
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setActive(idx)}
                      className={`group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-right transition-all duration-300 ${isActive
                        ? "border-primary/60 bg-primary/5 shadow-sm scale-[1.02]"
                        : "border-transparent hover:border-border hover:bg-surface-muted/50"
                        }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-2xl bg-primary/5 animate-pulse" />
                      )}

                      {/* Brand-colored Circle */}
                      <div className="relative shrink-0">
                        {isActive && (
                          <span className="absolute -inset-1 rounded-xl bg-primary/30 opacity-40 blur-md" />
                        )}
                        <div
                          className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 ${isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : isDone
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                            }`}
                        >
                          {isDone ? (
                            <Check className="h-5 w-5 stroke-[2.5]" />
                          ) : (
                            s.num
                          )}
                        </div>
                      </div>

                      {/* Details Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Icon
                            className="h-3.5 w-3.5 transition-colors"
                            style={{ color: isActive ? s.color : "oklch(var(--muted-foreground))" }}
                          />
                          <span
                            className={`text-xs font-extrabold transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"
                              }`}
                          >
                            {s.title}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-[10px] text-muted-foreground leading-normal">
                          {s.desc}
                        </p>
                      </div>

                      {isActive && (
                        <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-primary animate-bounce-horizontal" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Left Side: Dynamic High-Tech Verification Console */}
              <div
                key={active}
                className="workshop-stage-in relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-surface-muted/60 via-card to-surface-muted/30 p-5 sm:p-6"
              >
                {/* Decorative backgrounds */}
                <div aria-hidden className="pointer-events-none absolute -end-20 -top-20 h-48 w-48 rounded-full border border-primary/10 workshop-ring-spin" />
                <div aria-hidden className="pointer-events-none absolute -end-12 -top-12 h-36 w-36 rounded-full border border-primary/20" />

                {/* Console header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-[11px] font-bold font-mono text-primary tracking-wider uppercase">
                      console_inspection_monitor: ~ {current.site}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] border border-primary/20 gap-1.5 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                    اتصال مشفّر ومباشر
                  </Badge>
                </div>

                {/* Section 1: Query Sent */}
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    الاستعلام المرسل للأرشيف المعتمد:
                  </p>
                  <div className="rounded-xl border border-border/80 bg-muted/40 px-3.5 py-3 font-mono text-xs text-foreground/90 flex items-start gap-2.5">
                    <span className="text-primary font-bold">{`>`}</span>
                    <span className="leading-relaxed text-right font-medium">
                      {current.query}
                    </span>
                  </div>
                </div>

                {/* Section 2: Live Scanning logs */}
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                    سجل الفحص والتخريج الآلي:
                  </p>
                  <div className="rounded-xl border border-border/60 bg-foreground/95 p-3.5 font-mono text-[11px] text-emerald-400 space-y-2 shadow-inner">
                    {current.logs.map((log, i) => (
                      <div
                        key={i}
                        className="workshop-chip-in flex items-start gap-2 leading-relaxed"
                        style={{ animationDelay: `${0.12 + i * 0.12}s` }}
                      >
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span className="text-right text-emerald-300">{log}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Smart Trust Certificate Badge */}
                <div
                  className="workshop-card-rise mt-5 rounded-2xl border border-primary/25 bg-card/85 p-4.5 shadow-elegant backdrop-blur"
                  style={{ animationDelay: "0.55s" }}
                >
                  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute inset-0 rounded-lg bg-emerald-500 opacity-40 blur-md" />
                        <div
                          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-white shadow-md transition-transform"
                          style={{ backgroundColor: current.color }}
                        >
                          <ActiveIcon className="h-4 w-4" />
                        </div>
                      </div>
                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground">
                          تأصيل المحتوى المدمج
                        </p>
                        <p className="text-xs font-black text-foreground">
                          {current.title}
                        </p>
                      </div>
                    </div>

                    <Badge className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 shadow-sm shadow-emerald-500/20 border-none animate-pulse">
                      معتمد ومخرَّج
                    </Badge>
                  </div>

                  <p className="mt-3 text-xs leading-loose font-medium text-foreground/90 font-display">
                    <span className="workshop-type workshop-caret w-full whitespace-normal leading-relaxed text-right block">
                      {current.result}
                    </span>
                  </p>

                  {/* Trust details footer grid */}
                  <div className="mt-4.5 grid grid-cols-3 gap-2 border-t border-border/50 pt-3 text-[10px] text-muted-foreground font-mono">
                    <div className="bg-muted/50 p-1.5 rounded-lg border border-border/30 text-center">
                      <span className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">درجة الموثوقية</span>
                      <span className="font-extrabold text-foreground" style={{ color: current.color }}>{current.trustScore}</span>
                    </div>
                    <div className="bg-muted/50 p-1.5 rounded-lg border border-border/30 text-center">
                      <span className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">سرعة الاستجابة</span>
                      <span className="font-extrabold text-foreground">{current.speed}</span>
                    </div>
                    <div className="bg-muted/50 p-1.5 rounded-lg border border-border/30 text-center">
                      <span className="block text-[8px] font-bold text-muted-foreground uppercase mb-0.5">{current.statName}</span>
                      <span className="font-extrabold text-foreground truncate block" title={current.statValue}>{current.statValue}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom summary bar */}
            <div
              className="workshop-card-rise relative mt-8 overflow-hidden rounded-2xl bg-gradient-brand p-4 text-primary-foreground"
              style={{ animationDelay: "0.7s" }}
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.4) 0%, transparent 50%)",
                }}
              />
              <div className="relative flex items-center justify-between gap-4">
                <div className="text-right">
                  <p className="text-[10px] opacity-90 font-semibold uppercase tracking-wider">التحصين العلمي للخطبة</p>
                  <p className="mt-0.5 text-sm font-bold sm:text-base leading-snug">
                    جميع الكلمات والأدلة مستندة لـ 7 مصادر رقمية معتمدة وموثقة بالكامل
                  </p>
                </div>
                <div className="relative shrink-0">
                  <span className="absolute inset-0 rounded-full bg-white/30 workshop-pulse-ring" />
                  <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accent floaters */}
          <div className="workshop-float pointer-events-none absolute -top-6 -start-4 hidden rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-elegant backdrop-blur sm:flex sm:items-center sm:gap-2">
            <Lock className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold">توثيق 100% مؤمن</span>
          </div>
          <div
            className="workshop-float pointer-events-none absolute -bottom-5 -end-4 hidden rounded-2xl border border-border bg-card/95 px-4 py-2.5 shadow-elegant backdrop-blur sm:flex sm:items-center sm:gap-2"
            style={{ animationDelay: "2.3s" }}
          >
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-bold">فحص فوري في 250ms</span>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------- FAQ ---------- */
function FaqSection() {
  const faqs = [
    {
      q: "هل المنصة تكتب الخطبة بدلًا منّي؟",
      a: "لا. نحن لا نكتب لك خطبتك، بل نُجهّز لك ورشة عمل. أنت الإمام، وأنت صاحب المنبر، وأنت من يختار ويحذف ويضيف ويُصحّح. دورنا أن نوفّر عليك الجهد، ونفتح لك آفاقًا، ونمنحك مسودة تنطلق منها.",
    },
    {
      q: "كم من الوقت تستغرق الورشة؟",
      a: "تتراوح الورشة بين 3 إلى 8 دقائق حسب تفصيلك للمحاور. النتيجة مسودة منظَّمة بمحاورها وأدلتها تختصر عليك ساعات من البحث والترتيب.",
    },
    {
      q: "هل أستطيع تعديل المسودة بعد توليدها؟",
      a: "نعم، بل هذا هو المقصود. المسودة نقطة انطلاق؛ تُهذّبها وتضيف عليها وتحذف منها وتطبعها بأسلوبك ولسانك قبل المنبر.",
    },
    {
      q: "هل يصلح الذكاء الاصطناعي لصياغة خطبة شرعية؟",
      a: "النصوص الشرعية تبقى من القرآن والسنة، والمنصة تنتقي وتنظِّم؛ المراجعة الشرعية النهائية مسؤوليتك أنت بوصفك خطيبًا، لذلك نشدّد على أنك أنت المسؤول عن خطبتك.",
    },
    {
      q: "هل يمكنني حفظ خطبتي والرجوع إليها؟",
      a: "نعم، كل خطبة تُولِّدها تُحفظ في أرشيفك الخاص، يمكنك العودة إليها، تعديلها، مشاركتها، وتنزيلها متى شئت.",
    },
    {
      q: "هل توجد أنواع غير خطبة الجمعة؟",
      a: "نعم: خطبة الجمعة، الكلمة القصيرة بين الصلوات، والدرس العلمي. كل نوع له مدة ونبرة وقالب يناسبه.",
    },
  ];

  return (
    <section id="faq" className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            قبل أن تبدأ
          </span>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
            كل ما يدور في ذهنك
          </h2>
          <p className="mt-4 text-base leading-loose text-muted-foreground">
            أجوبة صريحة على أكثر ما يتساءل عنه الخطباء قبل دخول الورشة.
          </p>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-2xl border border-border bg-card px-5 data-[state=open]:shadow-elegant"
            >
              <AccordionTrigger className="text-right text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-loose text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  return (
    <section className="bg-surface-muted/30 py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-brand px-8 py-16 text-center text-primary-foreground shadow-elegant sm:px-14">
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
              منبرك يستحقّ ورشةً تليق به.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-loose opacity-90 sm:text-lg">
              ابدأ ورشتك الآن؛ خطوات معدودة تفصلك عن مسودةٍ منظَّمة تستلمها بين يديك.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/app/create" search={{ topic: undefined }}>
                <Button
                  size="lg"
                  variant="secondary"
                  className="group rounded-full bg-background px-8 py-6 text-base font-bold text-foreground shadow-xl transition-all hover:translate-y-[-1px] hover:bg-background"
                >
                  <Wand2 className="ms-2 h-5 w-5 transition-transform group-hover:rotate-12" />
                  ابدأ ورشة الصياغة الآن
                  <ArrowLeft className="me-1 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

