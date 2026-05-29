import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { User } from "lucide-react";

export function UserMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-start gap-3">
      <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-muted text-muted-foreground ring-1 ring-border">
        <User className="h-3.5 w-3.5" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-[15px] leading-relaxed text-primary-foreground">
        {children}
      </div>
    </div>
  );
}

export function AssistantMessage({
  children,
  noAvatar = false,
}: {
  children: ReactNode;
  noAvatar?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      {!noAvatar && (
        <div className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <LogoMark size={14} />
        </div>
      )}
      {noAvatar && <div className="h-7 w-7 shrink-0" aria-hidden />}
      <div className="max-w-[85%] text-[15px] leading-relaxed text-foreground/90">
        {children}
      </div>
    </div>
  );
}

/** Wrapper that aligns rich blocks (cards, readers) with assistant indent. */
export function AssistantBlock({ children }: { children: ReactNode }) {
  return <div className="ms-10 max-w-[calc(100%-2.5rem)]">{children}</div>;
}
