import { createFileRoute } from "@tanstack/react-router";
import { CreateWizard } from "@/features/create/CreateWizard";

export const Route = createFileRoute("/app/create")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } => ({
    topic: typeof search.topic === "string" ? search.topic : undefined,
  }),
  head: () => ({
    meta: [
      { title: "صناعة خطبة — منصة خطيب" },
      {
        name: "description",
        content:
          "ورشة موجَّهة لصياغة خطبة أو كلمة أو درس خطوة بخطوة: الموضوع، الجمهور، المدة، النبرة، المحاور، ثم توليد المخطط فالمسودة الكاملة.",
      },
    ],
  }),
  component: CreateWizard,
});
