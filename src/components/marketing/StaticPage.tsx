import type { ReactNode } from "react";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingChrome";

export function StaticPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-svh bg-background flex flex-col justify-between" dir="rtl">
      <div>
        <MarketingHeader />
        <main className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
          {intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>}
          <div className="prose-arabic mt-10 space-y-6 text-foreground/90">{children}</div>
        </main>
      </div>
      <MarketingFooter />
    </div>
  );
}
