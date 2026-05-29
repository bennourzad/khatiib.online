import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight, ArrowRight } from "lucide-react";
import { getCategoryBySlug } from "@/data/categories";
import { getSermonById } from "@/data/sermons";
import { Button } from "@/components/ui/button";
import { SermonReaderMessage } from "@/features/chat/messages/SermonReaderMessage";

export const Route = createFileRoute("/app/categories/$slug/$sermonId")({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.slug);
    if (!category) throw notFound();
    const sermon = getSermonById(params.sermonId);
    if (!sermon || sermon.categorySlug !== category.slug) throw notFound();
    return { category, sermon };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.sermon.title ?? "مادة"} — ${loaderData?.category.nameAr ?? ""}` },
      {
        name: "description",
        content: loaderData?.sermon.excerpt ?? "عرض مادة من أرشيف منصة خطيب.",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" dir="rtl">
      <h1 className="font-display text-2xl font-bold text-foreground">
        المادة غير موجودة
      </h1>
      <Link to="/app/categories" className="mt-6 inline-block">
        <Button variant="outline">العودة إلى التصنيفات</Button>
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center" dir="rtl">
      <h1 className="font-display text-xl font-semibold text-foreground">
        تعذّر تحميل هذه المادة
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-6">
        إعادة المحاولة
      </Button>
    </div>
  ),
  component: SermonDetail,
});

function SermonDetail() {
  const { category, sermon } = Route.useLoaderData();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
      <nav
        aria-label="مسار التنقل"
        className="flex items-center gap-1.5 text-sm text-muted-foreground"
      >
        <Link to="/app/categories" className="hover:text-foreground">
          التصنيفات
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        <Link
          to="/app/categories/$slug"
          params={{ slug: category.slug }}
          className="hover:text-foreground"
        >
          {category.nameAr}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 rotate-180" />
        <span className="line-clamp-1 text-foreground">{sermon.title}</span>
      </nav>

      <div>
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link to="/app/categories/$slug" params={{ slug: category.slug }}>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            العودة إلى {category.nameAr}
          </Link>
        </Button>
      </div>

      <SermonReaderMessage sermon={sermon} />
    </div>
  );
}
