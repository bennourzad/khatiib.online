import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  Wand2,
  ListChecks,
  FileText,
  Loader2,
  RotateCcw,
  BookmarkPlus,
  Copy,
  AlertTriangle,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  buildTitle,
  estimateMinutes,
  generateOutline,
  type ContentKind,
  type OutlineSection,
  type SermonBrief,
} from "./generator";
import { generateSermonAI } from "@/lib/generate-sermon.functions";
import { SermonBodyRenderer } from "./SermonBodyRenderer";
import { savedSermonsStore } from "@/stores/savedSermons";
import { favoritesStore } from "@/stores/favorites";
import type { SermonSection } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";


const CONTENT_TYPES: { value: ContentKind; label: string; hint: string }[] = [
  { value: "خطبة", label: "خطبة جمعة", hint: "15–25 دقيقة · جمهور عام" },
  { value: "كلمة", label: "كلمة قصيرة", hint: "3–7 دقائق · بين الصلوات" },
  { value: "درس", label: "درس علمي", hint: "20–45 دقيقة · حلقة دروس" },
];

const AUDIENCES = [
  "جمهور عام",
  "الشباب",
  "أهل الحي",
  "النساء",
  "الناشئة والأطفال",
  "العمال والموظفون",
  "طلبة العلم",
];

const TONES = [
  "وعظي مؤثر",
  "علمي تأصيلي",
  "تربوي تحفيزي",
  "اجتماعي معالج",
  "روحاني تأملي",
  "قصصي سردي",
  "حواري تفاعلي",
  "موجز مكثّف",
  "دعوي ليّن",
  "إصلاحي جريء",
  "حماسي تعبوي",
  "فقهي تفصيلي",
];

const AXIS_LIBRARY: Record<string, string[]> = {
  default: [
    "حقيقة الموضوع ومكانته",
    "الأدلة الشرعية",
    "ثمراته في حياة الفرد",
    "تطبيقه العملي",
    "تحذير من نقيضه",
    "الآيات القرآنية الواردة",
    "الأحاديث النبوية",
    "قصص من السيرة والصحابة",
    "شبهات والرد عليها",
    "الواقع المعاصر وتحدياته",
    "موانع التطبيق وعلاجها",
    "أثره على الأسرة والمجتمع",
    "خطوات عملية للتغيير",
  ],
};


type Step = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS: Record<Step, { title: string; icon: typeof Sparkles }> = {
  1: { title: "الموضوع والنوع", icon: Sparkles },
  2: { title: "الجمهور", icon: ListChecks },
  3: { title: "المدة والنبرة", icon: ListChecks },
  4: { title: "المحاور", icon: ListChecks },
  5: { title: "المراجعة", icon: Check },
  6: { title: "المسودة", icon: FileText },
};

export function CreateWizard() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { topic?: string };

  const [step, setStep] = useState<Step>(1);
  const [topic, setTopic] = useState(search.topic ?? "");
  const [contentType, setContentType] = useState<ContentKind>("خطبة");
  const [audience, setAudience] = useState("جمهور عام");
  const [duration, setDuration] = useState(15);
  const [tone, setTone] = useState("وعظي مؤثر");
  const [axes, setAxes] = useState<string[]>([]);
  const [customAxis, setCustomAxis] = useState("");

  const [outline, setOutline] = useState<OutlineSection[] | null>(null);
  const [draft, setDraft] = useState<SermonSection[] | null>(null);
  const [aiTitle, setAiTitle] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [philosophyAck, setPhilosophyAck] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(distanceToBottom < 220);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    const timer = setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);


  const generate = useServerFn(generateSermonAI);

  // Suggest sensible defaults based on content type
  useEffect(() => {
    if (contentType === "كلمة") setDuration(5);
    else if (contentType === "درس") setDuration(25);
    else setDuration(15);
  }, [contentType]);

  const brief: SermonBrief = useMemo(
    () => ({ topic, contentType, audience, duration, tone, axes }),
    [topic, contentType, audience, duration, tone, axes],
  );

  const canAdvance = (s: Step): boolean => {
    switch (s) {
      case 1:
        return topic.trim().length > 1 && !!contentType;
      case 2:
        return !!audience;
      case 3:
        return duration > 0 && !!tone;
      case 4:
        return axes.length > 0;
      default:
        return true;
    }
  };

  const handleGenerateDraft = async () => {
    setBusy(true);
    setGenerating(true);
    try {
      const result = await generate({ data: brief });
      setAiTitle(result.title);
      setDraft(result.sections);
      setOutline(result.sections.map((s) => ({ heading: s.heading, intent: "" })));

      // Auto-save the generated sermon
      const id = savedSermonsStore.add({
        title: result.title || buildTitle(brief),
        topic,
        contentType,
        audience,
        duration,
        tone,
        axes,
        sections: result.sections,
      });
      setSavedId(id);
      setShowSuccessDialog(true);
      setStep(6);
    } catch (e) {
      toast.error((e as Error).message || "تعذّر توليد الخطبة");
    } finally {
      setBusy(false);
      setGenerating(false);
    }
  };

  const handleSave = () => {
    if (!draft) return;
    const id = savedSermonsStore.add({
      title: (aiTitle ?? buildTitle(brief)),
      topic,
      contentType,
      audience,
      duration,
      tone,
      axes,
      sections: draft,
    });
    setSavedId(id);
    toast.success("تم حفظ المسودة في «خطبي المحفوظة»");
  };

  const handleAddToFavorites = () => {
    if (!savedId || !draft) {
      toast.error("احفظ المسودة أولًا");
      return;
    }
    const added = favoritesStore.toggle({
      id: `draft:${savedId}`,
      kind: "draft",
      title: (aiTitle ?? buildTitle(brief)),
      excerpt: draft[0]?.body.slice(0, 140),
      category: contentType,
    });
    toast.success(added ? "أُضيفت إلى المفضلة" : "أُزيلت من المفضلة");
  };

  const handleCopy = async () => {
    if (!draft) return;
    const text = `${(aiTitle ?? buildTitle(brief))}\n\n${draft
      .map((s) => `${s.heading}\n${s.body}`)
      .join("\n\n")}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("تم نسخ النص");
    } catch {
      toast.error("تعذّر النسخ");
    }
  };

  const reset = () => {
    setOutline(null);
    setDraft(null);
    setAiTitle(null);
    setSavedId(null);
    setStep(1);
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">

      {/* تنبيه فلسفة المنصة العائم */}
      {showAlert && (
        <div
          className={cn(
            "fixed right-4 md:right-6 left-4 md:left-auto md:max-w-md z-50 rounded-2xl border-r-4 border-primary bg-card/95 backdrop-blur p-4 shadow-elegant animate-in fade-in slide-in-from-bottom-5 transition-all duration-500",
            isNearBottom ? "bottom-[135px] md:bottom-[105px]" : "bottom-4 md:bottom-6"
          )}
        >
          <button
            type="button"
            onClick={() => setShowAlert(false)}
            className="absolute left-3 top-3 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            aria-label="إغلاق التنبيه"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-3 pl-6">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">تنبيه هام</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                نحن لا نكتب خطبتك، بل نُجهّز لك ورشة عمل. أنت الإمام، وأنت صاحب المنبر والخطيب، وأنت من يختار ويحذف ويضيف ويُصحّح. دورنا أن نوفّر عليك الجهد، ونفتح لك آفاقًا، ونمنحك مسودة تنطلق منها — لا خطبة تُلقيها كما هي.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero header — mithaq-style */}
      <section className="mb-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary">
          <Sparkles className="h-3 w-3" />
          ورشة الصياغة الموجَّهة
        </span>
        <h1 className="mt-3 font-display text-3xl font-black leading-tight text-foreground sm:text-4xl">
          اصنع مسودة <span className="text-gradient-brand">خطبتك</span> خطوةً خطوة
        </h1>
        <p className="mt-3 max-w-xl mx-auto text-sm leading-loose text-muted-foreground sm:text-base">
          نحدّد معك الموضوع والجمهور والنبرة والمحاور، ثم نُولّد المخطط فالمسودة الكاملة بين يديك لتُهذّبها بأسلوبك.
        </p>
      </section>

      <Stepper current={step} />

      <Card className="mt-6 border-border/60 bg-card p-5 sm:p-7">
        {step === 1 && (
          <StepShell title="الموضوع ونوع المحتوى" subtitle="ابدأ بفكرة واضحة ومحددة قدر الإمكان.">
            <div className="space-y-3">
              <Label htmlFor="topic">الموضوع</Label>
              <Input
                id="topic"
                dir="rtl"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: الصبر في زمن الفتن"
                className="text-base"
                autoFocus
              />
            </div>
            <div className="mt-5 space-y-3">
              <Label>نوع المحتوى</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {CONTENT_TYPES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setContentType(c.value)}
                    className={cn(
                      "rounded-xl border p-3 text-right transition-all",
                      contentType === c.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/40 hover:bg-muted/40",
                    )}
                  >
                    <div className="font-semibold text-foreground">{c.label}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{c.hint}</div>
                  </button>
                ))}
              </div>
            </div>
          </StepShell>
        )}

        {step === 2 && (
          <StepShell title="الجمهور المستهدف" subtitle="نختار النبرة والأمثلة بناءً على جمهورك.">
            <div className="grid gap-2 sm:grid-cols-2">
              {AUDIENCES.map((a) => (
                <ChipChoice
                  key={a}
                  active={audience === a}
                  onClick={() => setAudience(a)}
                  label={a}
                />
              ))}
            </div>
          </StepShell>
        )}

        {step === 3 && (
          <StepShell title="المدة والنبرة" subtitle="تؤثر على طول الفقرات وأسلوب الخطاب.">
            <div className="space-y-3">
              <Label>المدة المقدّرة (دقائق)</Label>
              <div className="flex flex-wrap gap-2">
                {[3, 5, 10, 15, 20, 25, 30].map((d) => (
                  <ChipChoice
                    key={d}
                    label={`${d} دقيقة`}
                    active={duration === d}
                    onClick={() => setDuration(d)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <Label>نبرة الخطاب</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {TONES.map((t) => (
                  <ChipChoice
                    key={t}
                    label={t}
                    active={tone === t}
                    onClick={() => setTone(t)}
                  />
                ))}
              </div>
            </div>
          </StepShell>
        )}

        {step === 4 && (
          <StepShell
            title="المحاور الرئيسية"
            subtitle="اختر من المقترحات أو أضف محاورك الخاصة (1 – 5 محاور)."
          >
            <div className="space-y-2">
              <Label>مقترحات</Label>
              <div className="flex flex-wrap gap-2">
                {AXIS_LIBRARY.default.map((a) => {
                  const active = axes.includes(a);
                  return (
                    <ChipChoice
                      key={a}
                      label={a}
                      active={active}
                      onClick={() =>
                        setAxes((p) =>
                          active ? p.filter((x) => x !== a) : p.length >= 5 ? p : [...p, a],
                        )
                      }
                    />
                  );
                })}
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Label>محور مخصّص</Label>
              <div className="flex gap-2">
                <Input
                  dir="rtl"
                  value={customAxis}
                  onChange={(e) => setCustomAxis(e.target.value)}
                  placeholder="اكتب محورًا واضغط إضافة"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customAxis.trim()) {
                      e.preventDefault();
                      if (axes.length < 5) setAxes((p) => [...p, customAxis.trim()]);
                      setCustomAxis("");
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (!customAxis.trim() || axes.length >= 5) return;
                    setAxes((p) => [...p, customAxis.trim()]);
                    setCustomAxis("");
                  }}
                >
                  إضافة
                </Button>
              </div>
            </div>

            {axes.length > 0 && (
              <div className="mt-5 space-y-2">
                <Label>المحاور المختارة ({axes.length})</Label>
                <ol className="space-y-1.5">
                  {axes.map((a, i) => (
                    <li
                      key={a}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-background/50 px-3 py-2 text-sm"
                    >
                      <span>
                        <span className="me-2 text-muted-foreground">{i + 1}.</span>
                        {a}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAxes((p) => p.filter((x) => x !== a))}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        إزالة
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </StepShell>
        )}

        {step === 5 && (
          <StepShell title="المراجعة" subtitle="تأكّد من الموجز قبل توليد الخطبة.">
            <ReviewGrid brief={brief} />
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(4)}
                disabled={busy}
                className="gap-1.5"
              >
                <ArrowRight className="h-4 w-4" />
                رجوع
              </Button>
              <Button onClick={handleGenerateDraft} disabled={busy} className="ms-auto gap-1.5">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {busy ? "يصوغ خبيرنا الخطبة بالذكاء الاصطناعي…" : "توليد الخطبة"}
              </Button>
            </div>
          </StepShell>
        )}

        {step === 6 && draft && (
          <StepShell
            title={(aiTitle ?? buildTitle(brief))}
            subtitle={`زمن قراءة تقديري: ${estimateMinutes(draft)} دقيقة · ${audience} · ${tone}`}
            topActions={
              <>
                {!savedId ? (
                  <Button onClick={handleSave} className="gap-1.5">
                    <BookmarkPlus className="h-4 w-4" />
                    حفظ في خطبي
                  </Button>
                ) : (
                  <Badge className="gap-1 bg-primary/10 px-3 py-1.5 text-primary hover:bg-primary/15">
                    <Check className="h-3.5 w-3.5" /> محفوظة
                  </Badge>
                )}
                <Button variant="outline" onClick={handleCopy} className="gap-1.5">
                  <Copy className="h-4 w-4" /> نسخ النص
                </Button>
                <Button variant="outline" onClick={handleAddToFavorites} className="gap-1.5">
                  ☆ مفضلة
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: "/app/saved" })}
                  disabled={!savedId}
                  className="gap-1.5"
                >
                  فتح خطبي المحفوظة
                </Button>
                <Button variant="ghost" onClick={reset} className="ms-auto gap-1.5">
                  <RotateCcw className="h-4 w-4" /> صياغة جديدة
                </Button>
              </>
            }
          >
            <article className="prose-arabic space-y-5 rounded-xl border border-border/60 bg-background/40 p-5">
              {draft.map((s, i) => (
                <section key={i}>
                  <Input
                    dir="rtl"
                    value={s.heading}
                    onChange={(e) =>
                      setDraft((p) =>
                        p
                          ? p.map((x, idx) => (idx === i ? { ...x, heading: e.target.value } : x))
                          : p,
                      )
                    }
                    className="mb-2 border-0 bg-transparent px-0 text-base font-semibold text-primary focus-visible:ring-0"
                  />
                  <Textarea
                    dir="rtl"
                    value={s.body}
                    onChange={(e) =>
                      setDraft((p) =>
                        p
                          ? p.map((x, idx) => (idx === i ? { ...x, body: e.target.value } : x))
                          : p,
                      )
                    }
                    rows={Math.max(3, Math.ceil(s.body.length / 100))}
                    className="resize-y border border-border/40 bg-background/60 text-[15px] leading-loose"
                  />
                  {(s.body.includes("﴿") || s.body.includes("«")) && (
                    <div className="mt-2 rounded-lg border border-dashed border-border/50 bg-muted/30 p-3">
                      <div className="mb-1 text-[11px] font-medium text-muted-foreground">
                        معاينة مع تمييز الآيات والأحاديث
                      </div>
                      <SermonBodyRenderer body={s.body} className="text-[14px]" />
                    </div>
                  )}
                </section>
              ))}
            </article>
          </StepShell>
        )}

        {/* Nav controls — hidden for steps that use bespoke CTAs */}
        {step < 5 && (
          <>
            {step === 1 && (
              <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="philosophy-ack"
                    checked={philosophyAck}
                    onCheckedChange={(v) => setPhilosophyAck(v === true)}
                    className="rounded-none"
                  />
                  <Label
                    htmlFor="philosophy-ack"
                    className="cursor-pointer text-sm font-medium text-amber-900 dark:text-amber-100"
                  >
                    أدرك أن هذه مجرد مسودة أولية، وأنا المسؤول عن صياغة الخطبة النهائية.
                  </Label>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>
                    يجب تحديد هذا الخيار للمتابعة — هذا التأكيد يضمن أنك تفهم طبيعة المنصة ومسؤوليتك عن المحتوى النهائي.
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))}
                disabled={step === 1}
                className="gap-1.5"
              >
                <ArrowRight className="h-4 w-4" />
                السابق
              </Button>
              <span className="text-xs text-muted-foreground">
                الخطوة {step} من 5
              </span>
              <Button
                type="button"
                onClick={() => setStep((s) => (canAdvance(s) && (s !== 1 || philosophyAck) ? ((s + 1) as Step) : s))}
                disabled={!canAdvance(step) || (step === 1 && !philosophyAck)}

                className="gap-1.5"
              >
                التالي
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}

      </Card>
      <GenerationProgressDialog open={generating} />

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent
          dir="rtl"
          className="sm:max-w-md border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl animate-fade-in"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-right">
            <DialogTitle className="flex items-center gap-2 text-foreground text-xl font-bold">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
              </span>
              تم صياغة مسودة خطبتك بنجاح!
            </DialogTitle>
            <DialogDescription className="text-sm mt-3 leading-relaxed text-muted-foreground">
              تم حفظ الخطبة تلقائيًا في أرشيفك الشخصي (خطبي المحفوظة).
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-center mt-3">
            <Sparkles className="h-7 w-7 text-primary mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">اكتملت صياغة المسودة  بنجاح!   :</p>
            <p className="text-xs leading-relaxed text-muted-foreground mt-1.5 font-medium">
              " كخطيب وصاحب منبر، دورك الآن هو المراجعة الدقيقة واللمسة الأبوية الموجهة، لتنطلق بالكلمة من قلبك إلى قلوبهم.       "
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
                if (savedId) {
                  navigate({ to: "/app/saved/$id", params: { id: savedId } });
                }
              }}
              className="w-full bg-gradient-brand text-primary-foreground font-semibold shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer rounded-xl py-5"
            >
              عرض المسودة
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const GENERATION_TIPS = [
  "راجع الآيات القرآنية وتأكد من صحة نسبتها ورقم الآية والسورة.",
  "تحقّق من تخريج الأحاديث ودرجتها (صحيح/حسن/ضعيف) قبل اعتمادها.",
  "اعرض المحتوى على فهمك الشرعي وعدّل ما يحتاج إلى ضبط أو تأصيل.",
  "نسّق الخطبة بما يناسب جمهور مسجدك وواقعهم المحلي.",
  "أَضِف لمستك الخاصة في المقدمة والخاتمة لتعزيز الأثر الإيماني.",
  "تذكّر: هذه الصياغة مساعِدة، والمسؤولية الشرعية تبقى على الإمام.",
];

function GenerationProgressDialog({ open }: { open: boolean }) {
  const [progress, setProgress] = useState(8);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(8);
      setTipIndex(0);
      return;
    }
    const tick = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) return 95;
        const remaining = 95 - p;
        return Math.min(95, p + Math.max(0.6, remaining * 0.06));
      });
    }, 400);
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i + 1) % GENERATION_TIPS.length);
    }, 3500);
    return () => {
      clearInterval(tick);
      clearInterval(tipTimer);
    };
  }, [open]);

  return (
    <Dialog open={open}>
      <DialogContent
        dir="rtl"
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            جارٍ صياغة مسودة الخطبة
          </DialogTitle>
          <DialogDescription className="text-right">
            نُحضّر لك مسودة أوّلية بناءً على الموجز الذي حدّدته. قد تستغرق العملية بضع لحظات.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Progress value={progress} dir="rtl" className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>التقدّم تقريبي</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Reassurance Notice */}
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 flex gap-3 items-start text-right">
          <Sparkles className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400">
              لماذا قد تستغرق الصياغة بعض الوقت؟
            </h4>
            <p className="text-[11.5px] leading-relaxed text-muted-foreground font-medium">
              عملية الصياغة لا تتم بشكل عشوائي، بل تمر عبر <strong>مراحل دقيقة وحقيقية</strong> تشمل استدعاء الأدلة بالرسم العثماني وتخريج الأحاديث وتنسيق الهياكل لتقديم مسودة رصينة. <strong>سترى ثمرة هذا الإتقان والتأصيل بنفسك فور مراجعة النتيجة!</strong>
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            توجيه للإمام
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            {GENERATION_TIPS[tipIndex]}
          </p>
        </div>


        <p className="text-[11px] leading-relaxed text-muted-foreground">
          يتم توليد الخطبة بناءً على نتائج المواقع الشرعية الموثوقة: tafsir.app · hdith.com · sunnah.one · islamqa.info · dorar.net · khutabaa.com · islamweb.net
        </p>
      </DialogContent>
    </Dialog>
  );
}

function StepShell({
  title,
  subtitle,
  children,
  topActions,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  topActions?: React.ReactNode;
}) {
  return (
    <div>
      {topActions && <div className="mb-3 flex flex-wrap gap-2">{topActions}</div>}
      <h2 className="font-display text-lg font-semibold text-right text-foreground sm:text-xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ChipChoice({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground/85 hover:border-primary/40 hover:bg-muted/60",
      )}
    >
      {label}
    </button>
  );
}

function ReviewGrid({ brief }: { brief: SermonBrief }) {
  const rows: [string, string][] = [
    ["الموضوع", brief.topic],
    ["نوع المحتوى", brief.contentType],
    ["الجمهور", brief.audience],
    ["المدة", `${brief.duration} دقيقة`],
    ["النبرة", brief.tone],
    ["المحاور", brief.axes.join(" · ") || "—"],
  ];
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="rounded-xl border border-border/60 bg-background/40 p-3"
        >
          <dt className="text-xs font-medium text-muted-foreground">{k}</dt>
          <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Stepper({ current }: { current: Step }) {
  const steps: Step[] = [1, 2, 3, 4, 5, 6];
  return (
    <ol className="flex flex-wrap items-center gap-1.5 text-xs">
      {steps.map((s) => {
        const meta = STEP_LABELS[s];
        const active = current === s;
        const done = current > s;
        return (
          <li
            key={s}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-colors",
              done && "border-primary/40 bg-primary/5 text-primary",
              active && "border-primary bg-primary text-primary-foreground shadow-sm",
              !done && !active && "border-border bg-background text-muted-foreground",
            )}
          >
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-current/10 text-[10px] font-bold">
              {done ? <Check className="h-3 w-3" /> : s}
            </span>
            <span className="hidden sm:inline">{meta.title}</span>
          </li>
        );
      })}
    </ol>
  );
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
