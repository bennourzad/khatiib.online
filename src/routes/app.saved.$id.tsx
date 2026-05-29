import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { ArrowRight, Bold, Clock, Copy, ExternalLink, FileDown, ListChecks, Plus, Printer, Save, Search, ShieldCheck, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { savedSermonsStore } from "@/stores/savedSermons";
import { estimateMinutes } from "@/features/create/generator";
import { SermonBodyRenderer } from "@/features/create/SermonBodyRenderer";
import type { SermonSection } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/app/saved/$id")({
  ssr: false,
  head: () => ({
    meta: [{ title: "تفاصيل الخطبة — منصة خطيب" }],
  }),
  component: SavedSermonDetailPage,
});

function SavedSermonDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const items = savedSermonsStore.use();
  const original = useMemo(() => items.find((s) => s.id === id), [items, id]);

  const [title, setTitle] = useState(original?.title ?? "");
  const [topic, setTopic] = useState(original?.topic ?? "");
  const [axesText, setAxesText] = useState((original?.axes ?? []).join("، "));
  const [sections, setSections] = useState<SermonSection[]>(
    original?.sections ?? [],
  );
  const [previewZoom, setPreviewZoom] = useState(100);
  const [hadithDialogOpen, setHadithDialogOpen] = useState(false);
  const [hadithListOpen, setHadithListOpen] = useState(false);
  const [hadithQuery, setHadithQuery] = useState("");
  const [hadithSearchUrl, setHadithSearchUrl] = useState(
    "/api/public/hdith-proxy?path=%2F",
  );

  if (!original) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-12 text-center" dir="rtl">
        <Card className="border-dashed border-border/60 bg-card/40 p-10">
          <h1 className="font-display text-xl font-semibold">لم نعثر على هذه الخطبة</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            ربما تم حذفها من خطبك المحفوظة.
          </p>
          <div className="mt-5">
            <Link to="/app/saved">
              <Button variant="outline">العودة إلى خطبي المحفوظة</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isDirty =
    title !== original.title ||
    topic !== original.topic ||
    axesText !== original.axes.join("، ") ||
    JSON.stringify(sections) !== JSON.stringify(original.sections);

  const updateSection = (i: number, patch: Partial<SermonSection>) =>
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));

  const moveSection = (i: number, dir: -1 | 1) =>
    setSections((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const removeSection = (i: number) =>
    setSections((prev) => prev.filter((_, idx) => idx !== i));

  const addSection = () =>
    setSections((prev) => [...prev, { heading: "محور جديد", body: "" }]);

  const bodyRefs = useRef<Array<HTMLTextAreaElement | null>>([]);
  const [activeSel, setActiveSel] = useState<{ i: number; start: number; end: number } | null>(
    null,
  );

  const handleBodySelect = (i: number) => {
    const el = bodyRefs.current[i];
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    if (s != null && e != null && e > s) setActiveSel({ i, start: s, end: e });
    else setActiveSel((prev) => (prev?.i === i ? null : prev));
  };

  const applyBoldToSection = (i: number) => {
    const el = bodyRefs.current[i];
    if (!el) return;
    const s = el.selectionStart ?? 0;
    const e = el.selectionEnd ?? 0;
    if (e <= s) return;
    const body = sections[i].body;
    const before = body.slice(0, s);
    const sel = body.slice(s, e);
    const after = body.slice(e);
    // Toggle: if already wrapped, unwrap
    const isWrapped = sel.startsWith("**") && sel.endsWith("**") && sel.length >= 4;
    const replacement = isWrapped ? sel.slice(2, -2) : `**${sel}**`;
    const newBody = before + replacement + after;
    updateSection(i, { body: newBody });
    setActiveSel(null);
    requestAnimationFrame(() => {
      const node = bodyRefs.current[i];
      if (!node) return;
      node.focus();
      const pos = before.length + replacement.length;
      node.setSelectionRange(pos, pos);
    });
  };

  const handleBodyKeyDown = (i: number, e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
      e.preventDefault();
      applyBoldToSection(i);
    }
  };

  /** Render text with **bold** segments for preview. */
  const renderWithBold = (text: string): ReactNode[] => {
    const parts: ReactNode[] = [];
    const re = /\*\*([\s\S]+?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    let k = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      parts.push(
        <strong key={k++} className="font-bold text-foreground">
          {m[1]}
        </strong>,
      );
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };


  const handleSave = () => {
    const axes = axesText
      .split(/[،,\n]+/)
      .map((a) => a.trim())
      .filter(Boolean);
    savedSermonsStore.update(original.id, {
      title: title.trim() || original.title,
      topic: topic.trim() || original.topic,
      axes,
      sections,
    });
    toast.success("تم حفظ التعديلات");
  };

  const handleCopy = async () => {
    const text = `${title}\n\n${sections.map((x) => `${x.heading}\n${x.body}`).join("\n\n")}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        ta.setAttribute("readonly", "");
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        if (!ok) throw new Error("copy failed");
      }
      toast.success("تم نسخ الخطبة");
    } catch {
      toast.error("تعذّر النسخ");
    }
  };

  const handleDelete = () => {
    savedSermonsStore.remove(original.id);
    toast.message("تم حذف المسودة");
    navigate({ to: "/app/saved" });
  };

  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const node = previewRef.current;
    if (!node) return;
    const w = window.open("", "_blank", "width=900,height=1200");
    if (!w) {
      toast.error("تعذّر فتح نافذة الطباعة");
      return;
    }
    w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${title || "خطبة"}</title><style>
      @font-face{font-family:'Thmanyah Sans';src:url('${window.location.origin}/fonts/ThmanyahSans-Light.otf') format('opentype');font-weight:300;font-style:normal;font-display:swap}
      @font-face{font-family:'Thmanyah Sans';src:url('${window.location.origin}/fonts/ThmanyahSans-Regular.otf') format('opentype');font-weight:400;font-style:normal;font-display:swap}
      @font-face{font-family:'Thmanyah Sans';src:url('${window.location.origin}/fonts/ThmanyahSans-Medium.otf') format('opentype');font-weight:500;font-style:normal;font-display:swap}
      @font-face{font-family:'Thmanyah Sans';src:url('${window.location.origin}/fonts/ThmanyahSans-Bold.otf') format('opentype');font-weight:700;font-style:normal;font-display:swap}
      @font-face{font-family:'Thmanyah Sans';src:url('${window.location.origin}/fonts/ThmanyahSans-Black.otf') format('opentype');font-weight:900;font-style:normal;font-display:swap}
      body{font-family:'Thmanyah Sans',system-ui,sans-serif;font-size:16px;line-height:1.9;padding:40px;color:#111;max-width:780px;margin:auto}
      h1{font-size:26px;margin:0 0 24px;text-align:center}
      h2{font-size:18px;margin:24px 0 8px}
      p{white-space:pre-wrap;margin:0 0 12px;font-size:16px}
      @media print{body{padding:0}}
    </style></head><body><h1>${escapeHtml(title || "بدون عنوان")}</h1>${sections
      .map(
        (s) =>
          `<section><h2>${escapeHtml(s.heading)}</h2><p>${renderBoldHtml(s.body)}</p></section>`,
      )
      .join("")}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => {
      const doPrint = () => w.print();
      const fonts = (w.document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
      if (fonts?.ready) fonts.ready.then(doPrint).catch(doPrint);
      else doPrint();
    }, 400);
  };

  const handleDownloadWord = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } =
        await import("docx");
      const doc = new Document({
        styles: {
          default: { document: { run: { font: "Arial", size: 26 } } },
        },
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.CENTER,
                heading: HeadingLevel.HEADING_1,
                children: [
                  new TextRun({ text: title || "بدون عنوان", bold: true, rightToLeft: true, size: 36 }),
                ],
              }),
              ...sections.flatMap((s) => [
                new Paragraph({
                  bidirectional: true,
                  heading: HeadingLevel.HEADING_2,
                  children: [
                    new TextRun({ text: s.heading, bold: true, rightToLeft: true, size: 30 }),
                  ],
                }),
                ...s.body.split(/\n+/).map(
                  (line) =>
                    new Paragraph({
                      bidirectional: true,
                      alignment: AlignmentType.JUSTIFIED,
                      children: lineToBoldRuns(line, TextRun),
                    }),
                ),
              ]),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(title || "خطبة").replace(/[\\/:*?"<>|]+/g, "_")}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("تم تحميل ملف وورد");
    } catch (e) {
      console.error(e);
      toast.error("تعذّر إنشاء ملف وورد");
    }
  };

  const handleHadithSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = hadithQuery.trim() || "تأكد من صحة الحديث";
    setHadithSearchUrl(`/api/public/hdith-proxy?path=%2Fs&q=${encodeURIComponent(q)}`);
  };

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  /** Convert `**bold**` markers to <strong> in escaped HTML for print. */
  function renderBoldHtml(s: string) {
    const parts: string[] = [];
    const re = /\*\*([\s\S]+?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(s)) !== null) {
      if (m.index > last) parts.push(escapeHtml(s.slice(last, m.index)));
      parts.push(`<strong>${escapeHtml(m[1])}</strong>`);
      last = m.index + m[0].length;
    }
    if (last < s.length) parts.push(escapeHtml(s.slice(last)));
    return parts.join("");
  }

  /** Convert a line into docx TextRuns, marking **bold** segments. */
  function lineToBoldRuns(line: string, TextRunCtor: typeof import("docx").TextRun) {
    const runs: import("docx").TextRun[] = [];
    const re = /\*\*([\s\S]+?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last)
        runs.push(new TextRunCtor({ text: line.slice(last, m.index), rightToLeft: true }));
      runs.push(new TextRunCtor({ text: m[1], bold: true, rightToLeft: true }));
      last = m.index + m[0].length;
    }
    if (last < line.length)
      runs.push(new TextRunCtor({ text: line.slice(last), rightToLeft: true }));
    if (runs.length === 0)
      runs.push(new TextRunCtor({ text: line, rightToLeft: true }));
    return runs;
  }



  /** Extract hadith candidates: text in «...» guillemets or **bold** markers. */
  const hadithCandidates = useMemo(() => {
    const out: { text: string; section: string }[] = [];
    const seen = new Set<string>();
    const pushMatch = (raw: string, heading: string) => {
      const clean = raw.trim().replace(/\*\*/g, "").replace(/\s+/g, " ");
      if (!clean || seen.has(clean)) return;
      seen.add(clean);
      out.push({ text: clean, section: heading });
    };
    for (const sec of sections) {
      const body = sec.body;
      const guillemets = /«([\s\S]+?)»/g;
      const bold = /\*\*([\s\S]+?)\*\*/g;
      let m: RegExpExecArray | null;
      while ((m = guillemets.exec(body)) !== null) pushMatch(m[1], sec.heading);
      while ((m = bold.exec(body)) !== null) pushMatch(m[1], sec.heading);
    }
    return out;
  }, [sections]);

  const verifyHadith = (text: string) => {
    setHadithQuery(text);
    setHadithSearchUrl(`/api/public/hdith-proxy?path=%2Fs&q=${encodeURIComponent(text)}`);
    setHadithListOpen(false);
    setHadithDialogOpen(true);
  };

  const minutes = estimateMinutes(sections);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10" dir="rtl">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" /> رجوع
      </button>

      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {original.contentType}
          </Badge>
          <span>{original.audience}</span>
          <span>·</span>
          <span>{original.tone}</span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {minutes} دقيقة
          </span>
        </div>
        <div className="mt-2 flex items-start justify-between gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {title || "بدون عنوان"}
          </h1>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" /> حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl">
              <AlertDialogHeader>
                <AlertDialogTitle>تأكيد حذف الخطبة</AlertDialogTitle>
                <AlertDialogDescription>
                  هل أنت متأكد من حذف «{title || "بدون عنوان"}»؟ لا يمكن التراجع عن هذا الإجراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  حذف نهائي
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </header>

      <Tabs dir="rtl" defaultValue="preview" className="w-full">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <TabsList className="flex w-fit flex-row-reverse">
            <TabsTrigger value="edit">تعديل يدوي</TabsTrigger>
            <TabsTrigger value="preview">معاينة</TabsTrigger>
          </TabsList>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleSave} disabled={!isDirty} className="gap-1.5">
              <Save className="h-4 w-4" /> حفظ التعديلات
            </Button>
            <Button variant="outline" onClick={handleCopy} className="gap-1.5">
              <Copy className="h-4 w-4" /> نسخ
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="mt-4 space-y-4" dir="rtl">
          <Card className="space-y-4 p-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">العنوان</Label>
              <Input id="title" dir="rtl" className="text-right" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic">الموضوع</Label>
              <Input id="topic" dir="rtl" className="text-right" value={topic} onChange={(e) => setTopic(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="axes">المحاور (افصل بفاصلة)</Label>
              <Input id="axes" dir="rtl" className="text-right" value={axesText} onChange={(e) => setAxesText(e.target.value)} />
            </div>
          </Card>

          <div className="space-y-3">
            {sections.map((sec, i) => (
              <Card key={i} className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    المقطع {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveSection(i, -1)}
                      disabled={i === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveSection(i, 1)}
                      disabled={i === sections.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeSection(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Input
                  dir="rtl"
                  value={sec.heading}
                  onChange={(e) => updateSection(i, { heading: e.target.value })}
                  placeholder="عنوان المقطع"
                  className="text-right font-semibold"
                />
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      حدّد نصاً ثم اضغط «غامق» لتمييزه (مثل الآيات القرآنية).
                    </span>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-flex">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => applyBoldToSection(i)}
                              disabled={activeSel?.i !== i}
                              className="h-7 gap-1.5 px-2 text-xs"
                            >
                              <Bold className="h-3.5 w-3.5" /> غامق
                            </Button>
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[280px] text-right leading-relaxed">
                          <p className="font-semibold">تغميق النصوص القرآنية والأحاديث</p>
                          <p className="mt-1 text-[11px] opacity-90">استخدم هذا الزر لتظليل الآيات القرآنية والأحاديث النبوية داخل الخطبة، مما يسهل على المستمع تمييزها أثناء الخطبة.</p>
                          <p className="mt-2 text-[11px] opacity-90">حدّد النص ثم اضغط لجعله <strong>غامقاً</strong></p>
                          <p className="mt-1 text-[11px] opacity-90">مثال: **﴿إِنَّ مَعَ الْعُسْرِ يُسْراً﴾** أو **(مَنْ يُرِدِ اللَّهُ بِهِ خَيْراً...)**</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    dir="rtl"
                    ref={(el) => {
                      bodyRefs.current[i] = el;
                    }}
                    value={sec.body}
                    onChange={(e) => updateSection(i, { body: e.target.value })}
                    onSelect={() => handleBodySelect(i)}
                    onKeyUp={() => handleBodySelect(i)}
                    onMouseUp={() => handleBodySelect(i)}
                    onKeyDown={(e) => handleBodyKeyDown(i, e)}
                    rows={8}
                    placeholder="نص المقطع"
                    className="text-right leading-loose"
                  />
                </div>
              </Card>
            ))}
            <Button variant="outline" onClick={addSection} className="w-full gap-1.5">
              <Plus className="h-4 w-4" /> إضافة مقطع
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4" dir="rtl">
          <Card ref={previewRef} className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Dialog open={hadithDialogOpen} onOpenChange={setHadithDialogOpen}>
                  <DialogContent className="max-w-5xl" dir="rtl">
                    <DialogHeader className="flex flex-row items-center gap-4 border-b border-border/40 pb-3 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setHadithDialogOpen(false);
                          setHadithListOpen(true);
                        }}
                        className="gap-1.5 text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors cursor-pointer shrink-0"
                      >
                        <ArrowRight className="h-4 w-4" />
                        العودة لأحاديث الخطبة
                      </Button>
                      <div className="space-y-1 text-right">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                          البحث في الباحث الحديثي
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                          استخدم الباحث للتحقق من صحة الأحاديث المذكورة في الخطبة
                        </DialogDescription>
                      </div>
                    </DialogHeader>
                    <div className="space-y-4">
                      <form onSubmit={handleHadithSearch} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <Button type="submit" className="gap-1.5 sm:order-1">
                          <Search className="h-4 w-4" /> بحث
                        </Button>
                        <Input
                          dir="rtl"
                          value={hadithQuery}
                          onChange={(e) => setHadithQuery(e.target.value)}
                          placeholder="اكتب نص الحديث أو جزءًا منه"
                          className="text-right"
                        />
                        <Button type="button" variant="outline" asChild className="gap-1.5 sm:order-[-1]">
                          <a href={`https://hdith.com/s?q=${encodeURIComponent(hadithQuery.trim() || "تأكد من صحة الحديث")}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="h-4 w-4" /> فتح في hdith.com
                          </a>
                        </Button>
                      </form>

                      <div className="overflow-hidden rounded-md border border-border bg-background">
                        <iframe
                          key={hadithSearchUrl}
                          src={hadithSearchUrl}
                          className="h-[70vh] w-full"
                          frameBorder="0"
                          title="نتائج البحث في الحديث"
                        />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={hadithListOpen} onOpenChange={setHadithListOpen}>
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                          <Button
                            variant="default"
                            className="gap-2 bg-gradient-brand text-primary-foreground hover:opacity-95 shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border border-primary/30 font-semibold cursor-pointer animate-hadith-btn"
                          >
                            <ListChecks className="h-4 w-4" />
                            عرض أحاديث الخطبة
                          </Button>
                        </DialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent>عرض الأحاديث الواردة في هذه الخطبة والتحقق من صحتها</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DialogContent className="max-w-2xl" dir="rtl">
                    <DialogHeader>
                      <DialogTitle>أحاديث الخطبة</DialogTitle>
                      <DialogDescription>
                        قائمة الأحاديث المستخرجة من مسودة الخطبة . اضغط «تأكد» للتحقق من صحة الحديث في hdith.com
                      </DialogDescription>
                    </DialogHeader>
                    {hadithCandidates.length === 0 ? (
                      <p className="rounded-md border border-dashed border-border/60 bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                        لم يتم العثور على أحاديث في مسودة الخطبة.
                      </p>
                    ) : (
                      <ul className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
                        {hadithCandidates.map((h, idx) => (
                          <li
                            key={idx}
                            className="flex items-start justify-between gap-3 rounded-md border border-border bg-card/40 p-3"
                          >
                            <div className="flex-1 space-y-1">
                              <p className="text-[15px] leading-loose text-foreground">{h.text}</p>
                              {h.section ? (
                                <p className="text-[11px] text-muted-foreground">من: {h.section}</p>
                              ) : null}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => verifyHadith(h.text)}
                              className="shrink-0 gap-1.5"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" /> تأكد
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreviewZoom(z => Math.max(75, z - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-xs text-muted-foreground">{previewZoom}%</span>
                <Button variant="outline" size="sm" onClick={() => setPreviewZoom(z => Math.min(150, z + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={handleDownloadWord} className="gap-1.5">
                  <FileDown className="h-4 w-4" /> تحميل وورد
                </Button>
                <Button variant="outline" onClick={handlePrint} className="gap-1.5">
                  <Printer className="h-4 w-4" /> طباعة
                </Button>
              </div>
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {title || "بدون عنوان"}
            </h2>
            <div style={{ zoom: `${previewZoom}%` }}>
              {sections.map((sec, i) => (
                <section key={i} className="space-y-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {sec.heading}
                  </h3>
                  <SermonBodyRenderer body={sec.body} className="text-[15px]" />
                </section>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
