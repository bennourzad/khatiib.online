import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Trash2, Clock, AlertTriangle, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { savedSermonsStore } from "@/stores/savedSermons";
import { estimateMinutes } from "@/features/create/generator";
import { toast } from "sonner";

export const Route = createFileRoute("/app/saved/")({
  head: () => ({
    meta: [
      { title: "خطبي المحفوظة — منصة خطيب" },
      {
        name: "description",
        content: "مكتبة الخطب والكلمات والدروس التي صنعتها في منصة خطيب، جاهزة للنسخ والمتابعة.",
      },
    ],
  }),
  component: SavedSermonsPage,
});

function SavedSermonsPage() {
  const items = savedSermonsStore.use();

  const handleExportAll = async () => {
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak } =
        await import("docx");
      const children: any[] = [];
      items.forEach((sermon, idx) => {
        children.push(
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({ text: sermon.title || "بدون عنوان", bold: true, rightToLeft: true, size: 36 }),
            ],
          }),
          new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: `${sermon.contentType} · ${sermon.audience} · ${sermon.tone}`, rightToLeft: true, size: 22, color: "666666" }),
            ],
          }),
        );
        sermon.sections.forEach((s) => {
          children.push(
            new Paragraph({
              bidirectional: true,
              heading: HeadingLevel.HEADING_2,
              children: [
                new TextRun({ text: s.heading, bold: true, rightToLeft: true, size: 30 }),
              ],
            }),
          );
          s.body.split(/\n+/).forEach((line) => {
            const runs: any[] = [];
            const re = /\*\*([\s\S]+?)\*\*/g;
            let last = 0;
            let m: RegExpExecArray | null;
            while ((m = re.exec(line)) !== null) {
              if (m.index > last) runs.push(new TextRun({ text: line.slice(last, m.index), rightToLeft: true }));
              runs.push(new TextRun({ text: m[1], bold: true, rightToLeft: true }));
              last = m.index + m[0].length;
            }
            if (last < line.length) runs.push(new TextRun({ text: line.slice(last), rightToLeft: true }));
            if (runs.length === 0) runs.push(new TextRun({ text: line, rightToLeft: true }));
            children.push(
              new Paragraph({
                bidirectional: true,
                alignment: AlignmentType.JUSTIFIED,
                children: runs,
              }),
            );
          });
        });
        if (idx < items.length - 1) {
          children.push(new Paragraph({ children: [new PageBreak()] }));
        }
      });
      const doc = new Document({
        styles: {
          default: { document: { run: { font: "Arial", size: 26 } } },
        },
        sections: [{ properties: {}, children }],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `khutab-imam-elmasjid-${new Date().toISOString().slice(0, 10)}.docx`;
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">من صياغتك</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            خطبي المحفوظة
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} مسودة جاهزة للنسخ أو إعادة التحرير.
          </p>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button variant="outline" className="gap-1.5 cursor-pointer" onClick={handleExportAll}>
              <Download className="h-4 w-4" /> تصدير الكل
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary cursor-pointer" title="تنبيه هام حول الحفظ">
                  <Info className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent dir="rtl" className="max-w-md">
                <AlertDialogHeader className="text-right">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Info className="h-5 w-5" />
                  </div>
                  <AlertDialogTitle className="text-right">تنبيه هام لحفظ خطبك</AlertDialogTitle>
                  <AlertDialogDescription className="text-right leading-loose text-sm">
                    أخي الكريم، الخطيب المبارك..
                    <br />
                    يرجى العلم أن المنصة حالياً تحفظ مسودات خطبك **بشكل محلي مؤقت** على جهازك الحالي (المتصفح)، ولا توفر حسابات مستخدمين سحابية في هذا الإصدار التجريبي.
                    <br />
                    <span className="font-semibold text-foreground">
                      لتجنب ضياع جهدك الثمين في حال تغيير الجهاز أو تنظيف بيانات المتصفح، ننصحك بشدة بـ «تصدير الكل» وحفظ ملفات الوورد على جهازك الخاص بانتظام.
                    </span>
                    <br />
                    <span className="text-xs text-muted-foreground/80 mt-1 block">
                      * سيتم توفير ميزة الحسابات السحابية والربط الآمن للخطباء قريباً بإذن الله.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                  <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90">
                    حسناً، فهمت ذلك
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-3">
          {items.map((s) => (
            <li key={s.id}>
              <Card className="group border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md">
                <Link
                  to="/app/saved/$id"
                  params={{ id: s.id }}
                  className="block focus:outline-none"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {s.contentType}
                    </Badge>
                    <span>{s.audience}</span>
                    <span>·</span>
                    <span>{s.tone}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {estimateMinutes(s.sections)} دقيقة
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {s.sections[0]?.body}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.axes.slice(0, 4).map((a) => (
                      <span
                        key={a}
                        className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </Link>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
                  <Link to="/app/saved/$id" params={{ id: s.id }}>
                    <Button size="sm" variant="outline">فتح وتعديل</Button>
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    حُفظت {formatDate(s.createdAt)}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="ms-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> حذف
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-sm">
                      <AlertDialogHeader>
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                        <AlertDialogDescription>
                          سيتم حذف هذه الخطبة نهائيًا من "خطبي المحفوظة". لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => {
                            savedSermonsStore.remove(s.id);
                            toast.message("تم حذف المسودة");
                          }}
                        >
                          نعم، احذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed border-border/60 bg-card/40 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
        <BookMarked className="h-5 w-5 text-primary" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        لم تحفظ أي مسودة بعد
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        ابدأ من ورشة الصياغة، وعند الانتهاء اضغط «حفظ في خطبي».
      </p>
      <div className="mt-5">
        <Link to="/app/create">
          <Button>افتح ورشة الصياغة</Button>
        </Link>
      </div>
    </Card>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ar", {
      day: "numeric",
      month: "short",
    });
  } catch {
    return "";
  }
}
