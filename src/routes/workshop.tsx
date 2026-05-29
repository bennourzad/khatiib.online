import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingChrome";
import { CreateWizard } from "@/features/create/CreateWizard";

export const Route = createFileRoute("/workshop")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } => ({
    topic: typeof search.topic === "string" ? search.topic : undefined,
  }),
  head: () => ({
    meta: [
      { title: "ورشة صياغة الخطبة — منصة خطيب" },
      {
        name: "description",
        content:
          "ورشة موجَّهة لصياغة خطبتك خطوة بخطوة: الموضوع، الجمهور، المدة، النبرة، المحاور، ثم مسودة كاملة بين يديك.",
      },
      { property: "og:title", content: "ورشة صياغة الخطبة — منصة خطيب" },
      {
        property: "og:description",
        content: "من فكرة عابرة إلى خطبة منبر متماسكة — ورشة موجَّهة تأخذ بيدك خطوة خطوة.",
      },
    ],
  }),
  component: WorkshopPage,
});

function WorkshopPage() {
  return (
    <div dir="rtl" className="flex min-h-svh flex-col bg-background text-foreground">
      <MarketingHeader />
      <main className="flex-1">
        <CreateWizard />
      </main>
      <MarketingFooter />
    </div>
  );
}
