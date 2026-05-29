import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/logo-imam-masjid.svg";
import logoDarkUrl from "@/assets/logo-imam-masjid-dark.svg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "mark";
  className?: string;
}

/** منصة خطيب — official wordmark (icon + Arabic name). */
export function Logo({ size = "md", className }: LogoProps) {
  const h = { sm: "h-7", md: "h-9", lg: "h-12" }[size];

  return (
    <>
      <img
        src={logoUrl}
        alt={BRAND.nameAr}
        className={cn("w-auto select-none block dark:hidden", h, className)}
        draggable={false}
      />
      <img
        src={logoDarkUrl}
        alt={BRAND.nameAr}
        className={cn("w-auto select-none hidden dark:block", h, className)}
        draggable={false}
      />
    </>
  );
}

/** Square mark fallback — same SVG, fixed pixel size. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <>
      <img
        src={logoUrl}
        alt={BRAND.nameAr}
        style={{ height: size, width: "auto" }}
        className="shrink-0 select-none block dark:hidden"
        draggable={false}
      />
      <img
        src={logoDarkUrl}
        alt={BRAND.nameAr}
        style={{ height: size, width: "auto" }}
        className="shrink-0 select-none hidden dark:block"
        draggable={false}
      />
    </>
  );
}
