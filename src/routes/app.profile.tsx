import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { User, BookMarked, Star, History as HistoryIcon, Sparkles, Trash2, AlertTriangle, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { savedSermonsStore, type SavedSermon } from "@/stores/savedSermons";
import { favoritesStore } from "@/stores/favorites";
import { historyStore } from "@/stores/history";
import { toast } from "sonner";

export const Route = createFileRoute("/app/profile")({
  head: () => ({
    meta: [
      { title: "الملف الشخصي — منصة خطيب" },
      { name: "description", content: "ملخص نشاطك في منصة خطيب: الخطب، المفضلة، والمحادثات." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const sermons = savedSermonsStore.use();
  const favorites = favoritesStore.use();
  const history = historyStore.use();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const lastActivity = useMemo(() => {
    const dates = [
      ...sermons.map((s) => s.updatedAt),
      ...favorites.map((f) => f.addedAt),
      ...history.map((h) => h.updatedAt),
    ].sort();
    return dates.length ? dates[dates.length - 1] : null;
  }, [sermons, favorites, history]);

  const totalItems = sermons.length + favorites.length + history.length;

  const handleDeleteAll = () => {
    savedSermonsStore.clear();
    favoritesStore.clear();
    historyStore.clear();
    toast.success("تم حذف جميع البيانات بنجاح");
    setConfirmOpen(false);
  };

  const handleDownloadAll = async () => {
    if (sermons.length === 0) return;
    setDownloading(true);
    try {
      const [{ default: JSZip }, docx] = await Promise.all([
        import("jszip"),
        import("docx"),
      ]);
      const zip = new JSZip();
      const usedNames = new Set<string>();
      for (const sermon of sermons) {
        const blob = await sermonToDocxBlob(sermon, docx);
        let base = (sermon.title || "خطبة").replace(/[\\/:*?"<>|]+/g, "_").slice(0, 80);
        let name = `${base}.docx`;
        let i = 2;
        while (usedNames.has(name)) {
          name = `${base} (${i}).docx`;
          i++;
        }
        usedNames.add(name);
        zip.file(name, blob);
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `khutab-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`تم تحميل ${sermons.length} خطبة في ملف مضغوط`);
    } catch (e) {
      console.error(e);
      toast.error("تعذّر إنشاء الملف المضغوط");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <User className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary">الملف الشخصي</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            مرحبًا بك في منصة خطيب
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-right">
            {lastActivity
              ? `آخر نشاط: ${formatDate(lastActivity)}`
              : "ابدأ أول محادثة لتظهر إحصائياتك هنا."}
          </p>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          icon={<BookMarked className="h-5 w-5 text-primary" />}
          label="خطبي المحفوظة"
          value={sermons.length}
          to="/app/saved"
        />
        <StatCard
          icon={<Star className="h-5 w-5 text-primary" />}
          label="المفضلة"
          value={favorites.length}
          to="/app/favorites"
        />
        <StatCard
          icon={<HistoryIcon className="h-5 w-5 text-primary" />}
          label="المحادثات"
          value={history.length}
          to="/app/history"
        />
      </div>

      <Card className="mt-6 border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          ابدأ من حيث انتهيت
        </h2>
        <p className="mt-1 text-sm text-muted-foreground text-right">
          أنشئ خطبة جديدة أو تابع تصفح التصنيفات.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/app/create">
            <Button className="gap-1.5">
              <Sparkles className="h-4 w-4" /> صياغة مسودة خطبة
            </Button>
          </Link>
          <Link to="/app/categories">
            <Button variant="outline">استكشف التصنيفات</Button>
          </Link>
          <Link to="/app/settings">
            <Button variant="ghost">تعديل التفضيلات</Button>
          </Link>
        </div>
      </Card>

      <Card className="mt-4 border-border/60 bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Download className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold text-foreground">
              تحميل الخطب المحفوظة
            </h2>
            <p className="mt-1 text-sm text-muted-foreground text-right">
              حمّل جميع خطبك المحفوظة دفعةً واحدة في ملف مضغوط (ZIP) يحتوي كل خطبة بصيغة وورد.
            </p>
            <div className="mt-4">
              <Button
                onClick={handleDownloadAll}
                disabled={sermons.length === 0 || downloading}
                className="gap-1.5"
              >
                <Download className="h-4 w-4" />
                {sermons.length === 0
                  ? "لا توجد خطب محفوظة"
                  : downloading
                    ? "جاري التحضير..."
                    : `تحميل كل الخطب (${sermons.length}) كملف مضغوط`}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-4 border-destructive/20 bg-card p-5">

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-lg font-semibold text-foreground">
              حذف البيانات
            </h2>
            <p className="mt-1 text-sm text-muted-foreground text-right">
              احذف كل المحادثات والمفضلة والخطب المحفوظة. لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="mt-4">
              <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={totalItems === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                    {totalItems === 0 ? "لا توجد بيانات للحذف" : "حذف جميع البيانات"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      تأكيد حذف البيانات
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      سيتم حذف <strong>{history.length}</strong> محادثة، و{" "}
                      <strong>{favorites.length}</strong> مفضلة، و{" "}
                      <strong>{sermons.length}</strong> خطبة محفوظة بشكل نهائي.
                      هذا الإجراء لا يمكن التراجع عنه.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>إلغاء</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      نعم، احذف الكل
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  to: string;
}) {
  return (
    <Link to={to}>
      <Card className="group flex h-full items-center justify-between gap-3 border-border/60 bg-card p-4 transition-colors hover:border-primary/40">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          {icon}
        </div>
      </Card>
    </Link>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ar", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

async function sermonToDocxBlob(
  sermon: SavedSermon,
  docx: typeof import("docx"),
): Promise<Blob> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
  const lineToRuns = (line: string) => {
    const runs: InstanceType<typeof TextRun>[] = [];
    const re = /\*\*([\s\S]+?)\*\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last)
        runs.push(new TextRun({ text: line.slice(last, m.index), rightToLeft: true }));
      runs.push(new TextRun({ text: m[1], bold: true, rightToLeft: true }));
      last = m.index + m[0].length;
    }
    if (last < line.length)
      runs.push(new TextRun({ text: line.slice(last), rightToLeft: true }));
    if (runs.length === 0) runs.push(new TextRun({ text: line, rightToLeft: true }));
    return runs;
  };
  const doc = new Document({
    styles: { default: { document: { run: { font: "Arial", size: 26 } } } },
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: sermon.title || "بدون عنوان",
                bold: true,
                rightToLeft: true,
                size: 36,
              }),
            ],
          }),
          ...sermon.sections.flatMap((s) => [
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
                  children: lineToRuns(line),
                }),
            ),
          ]),
        ],
      },
    ],
  });
  return Packer.toBlob(doc);
}
