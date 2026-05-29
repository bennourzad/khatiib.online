import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { History as HistoryIcon, Pin, PinOff, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { historyStore } from "@/stores/history";
import { toast } from "sonner";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "السجل — منصة خطيب" },
      {
        name: "description",
        content: "كل محادثاتك السابقة مع منصة خطيب، مع تثبيت وإعادة تسمية وحذف.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const items = historyStore.use();
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.updatedAt.localeCompare(a.updatedAt);
      }),
    [items],
  );

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">السجل</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            سجل المحادثات
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-right">
            {items.length} محادثة محفوظة محليًا.
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              historyStore.clear();
              toast.message("تم مسح السجل");
            }}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> مسح السجل
          </Button>
        )}
      </header>

      {sorted.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="space-y-2">
          {sorted.map((c) => (
            <li key={c.id}>
              <Card className="group flex items-start gap-3 border-border/60 bg-card p-4 transition-colors hover:border-primary/40">
                <button
                  type="button"
                  onClick={() => {
                    historyStore.togglePin(c.id);
                  }}
                  className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    c.pinned
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                  aria-label={c.pinned ? "إلغاء التثبيت" : "تثبيت"}
                >
                  {c.pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                </button>

                <div className="min-w-0 flex-1">
                  {renamingId === c.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        historyStore.rename(c.id, draftTitle.trim() || c.title);
                        setRenamingId(null);
                      }}
                      className="flex gap-2"
                    >
                      <Input
                        dir="rtl"
                        autoFocus
                        value={draftTitle}
                        onChange={(e) => setDraftTitle(e.target.value)}
                        className="h-9"
                      />
                      <Button type="submit" size="sm">حفظ</Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => setRenamingId(null)}>
                        إلغاء
                      </Button>
                    </form>
                  ) : (
                    <Link
                      to={c.mode === "create" ? "/app/create" : "/app"}
                      search={
                        c.mode === "create"
                          ? { topic: c.preview }
                          : { q: c.preview, cid: c.id }
                      }
                      className="block"
                    >
                      <h3 className="truncate font-display text-base font-semibold text-foreground">
                        {c.title}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground text-right">
                        {c.preview}
                      </p>
                    </Link>
                  )}

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{labelForMode(c.mode)}</span>
                    <span>·</span>
                    <span>{formatRelative(c.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setRenamingId(c.id);
                      setDraftTitle(c.title);
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="إعادة تسمية"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      historyStore.remove(c.id);
                      toast.message("تم حذف المحادثة");
                    }}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
        <HistoryIcon className="h-5 w-5 text-primary" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        لا توجد محادثات بعد
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground text-right">
        ستظهر هنا كل محادثة تبدؤها مع منصة خطيب تلقائيًا.
      </p>
      <div className="mt-5">
        <Link to="/app">
          <Button>ابدأ محادثة جديدة</Button>
        </Link>
      </div>
    </Card>
  );
}

function labelForMode(m: string) {
  return m === "create" ? "صياغة" : m === "browse" ? "استكشاف" : "بحث";
}

function formatRelative(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.round(diff / 60000);
    if (min < 1) return "الآن";
    if (min < 60) return `قبل ${min} دقيقة`;
    const hr = Math.round(min / 60);
    if (hr < 24) return `قبل ${hr} ساعة`;
    const days = Math.round(hr / 24);
    if (days < 30) return `قبل ${days} يوم`;
    return new Date(iso).toLocaleDateString("ar");
  } catch {
    return "";
  }
}
