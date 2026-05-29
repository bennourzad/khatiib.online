import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getCategoryBySlug } from "@/data/categories";
import { getSermonsByCategory } from "@/data/sermons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/categories/$slug/")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();
    return { category };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.nameAr ?? "تصنيف"} — نوازل العصر` },
      {
        name: "description",
        content:
          loaderData?.category.description ??
          `تصفّح مواد تصنيف ${loaderData?.category.nameAr ?? ""}.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" dir="rtl">
      <h1 className="font-display text-2xl font-bold text-foreground">
        التصنيف غير موجود
      </h1>
      <Link to="/app/categories" className="mt-6 inline-block">
        <Button variant="outline">العودة إلى التصنيفات</Button>
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" dir="rtl">
      <h1 className="font-display text-xl font-semibold text-foreground">
        تعذّر تحميل هذا التصنيف
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-6">
        إعادة المحاولة
      </Button>
    </div>
  ),
  component: CategoryDetail,
});

function CategoryDetail() {
  const { category } = Route.useLoaderData();
  const sermons = getSermonsByCategory(category.slug);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link to="/app/categories" className="hover:text-foreground">
          التصنيفات
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        <span className="text-foreground">{category.nameAr}</span>
      </nav>

      <header className="space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
          {category.icon}
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          {category.nameAr}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {category.description}
        </p>
        <p className="text-xs text-muted-foreground">{sermons.length} مادة في هذا التصنيف</p>
      </header>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-foreground">
          المواد
        </h2>

        {sermons.length === 0 ? (
          <Card className="border-dashed border-border/60 bg-card/50 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              لا توجد مواد منشورة في هذا التصنيف بعد. ستُضاف المواد قريبًا.
            </p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {sermons.map((s) => (
              <Card
                key={s.id}
                className="group relative flex h-full flex-col gap-2 overflow-hidden border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {s.contentType}
                  </Badge>
                  {s.estimatedMinutes && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" /> {s.estimatedMinutes} د
                    </span>
                  )}
                </div>
                <h3 className="font-display text-base font-semibold leading-snug text-foreground">
                  {s.title}
                </h3>
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {s.excerpt}
                </p>
                <div className="mt-auto pt-2">
                  <Button asChild size="sm" className="gap-1.5">
                    <Link
                      to="/app/categories/$slug/$sermonId"
                      params={{ slug: category.slug, sermonId: s.id }}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      عرض المادة
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
