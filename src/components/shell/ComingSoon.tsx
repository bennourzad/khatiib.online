import { Sparkles } from "lucide-react";

/** Reusable scaffolded "coming next phase" page used for routes whose rich
 *  implementation lands in later phases. Keeps navigation working today. */
export function ComingSoon({
  title,
  description,
  phase,
}: {
  title: string;
  description: string;
  phase: string;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <Sparkles className="h-5 w-5" />
      </div>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">{title}</h1>
      <p className="mb-4 text-muted-foreground">{description}</p>
      <div className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
        {phase}
      </div>
    </div>
  );
}
