import { createFileRoute, Link } from "@tanstack/react-router";
import { CATEGORIES, getAllCategories } from "@/data/categories";
import { countSermonsByCategory } from "@/data/sermons";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/app/categories/")({
  head: () => ({
    meta: [
      { title: "التصنيفات — نوازل العصر" },
      {
        name: "description",
        content:
          "اثنا عشر تصنيفًا شرعيًا معاصرًا يهتم بنوازل العصر: من الذكاء الاصطناعي والمعاملات الرقمية إلى الإعلام الجديد وقضايا الشباب.",
      },
    ],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-primary">نوازل العصر</p>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          استكشف التصنيفات
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {CATEGORIES.length} تصنيفًا شرعيًا معاصرًا، تعالج جديد الأحداث ونوازل
          الواقع، لا تكرارًا للموضوعات التقليدية.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {categories.map((cat) => {
          const total = countSermonsByCategory(cat.slug);
          return (
            <Card
              key={cat.id}
              className="group relative overflow-hidden border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
            >
              <Link
                to="/app/categories/$slug"
                params={{ slug: cat.slug }}
                className="absolute inset-0"
                aria-label={cat.nameAr}
              />
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-foreground">
                      {cat.nameAr}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {total} مادة
                    </p>
                  </div>
                </div>
                <ChevronLeft className="h-5 w-5 text-muted-foreground/60 transition-transform group-hover:-translate-x-0.5 group-hover:text-primary" />
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {cat.description}
              </p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
