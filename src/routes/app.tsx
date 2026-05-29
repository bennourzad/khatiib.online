import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MarketingHeader, MarketingFooter } from "@/components/marketing/MarketingChrome";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background" dir="rtl">
      <MarketingHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
}
