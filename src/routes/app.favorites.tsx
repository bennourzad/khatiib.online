import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Trash2, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { favoritesStore } from "@/stores/favorites";
import { toast } from "sonner";

export const Route = createFileRoute("/app/favorites")({
  head: () => ({
    meta: [
      { title: "المفضلة — منصة خطيب" },
      {
        name: "description",
        content: "خطب وكلمات ومسوّدات حفظتها للرجوع إليها بسرعة في منصة خطيب.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const items = favoritesStore.use();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-primary">المكتبة الشخصية</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            المفضلة
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-right">
            {items.length} عنصر محفوظ.
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              favoritesStore.clear();
              toast.message("تم إفراغ المفضلة");
            }}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            إفراغ الكل
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card className="group relative flex h-full flex-col gap-2 overflow-hidden border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md">
                {item.kind === "sermon" && item.categorySlug ? (
                  <Link
                    to="/app/categories/$slug"
                    params={{ slug: item.categorySlug }}
                    className="absolute inset-0"
                    aria-label={item.title}
                  />
                ) : null}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {item.kind === "draft" ? (
                    <FileText className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                  )}
                  <span>{item.kind === "draft" ? "مسودة" : "من الأرشيف"}</span>
                  {item.category && <span>· {item.category}</span>}
                </div>
                <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {item.excerpt}
                  </p>
                )}
                <div className="relative z-10 mt-auto flex items-center justify-between pt-2 text-xs">
                  <span className="text-muted-foreground">
                    {formatDate(item.addedAt)}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      favoritesStore.remove(item.id);
                      toast.message("أُزيلت من المفضلة");
                    }}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    إزالة
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
        <Star className="h-5 w-5 text-primary" />
      </div>
      <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
        لا توجد عناصر في المفضلة بعد
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">
        احفظ الخطب والكلمات والمسودات من زر «المفضلة» داخل المحادثة أو الورشة.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link to="/app">
          <Button>ابدأ محادثة</Button>
        </Link>
        <Link to="/app/categories">
          <Button variant="outline">استكشف التصنيفات</Button>
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
      year: "numeric",
    });
  } catch {
    return "";
  }
}
