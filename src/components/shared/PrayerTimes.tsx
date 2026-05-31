import { useQuery } from "@tanstack/react-query";
import { Clock, CalendarClock, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AladhanResponse {
  data: {
    timings: Record<string, string>;
    date: { readable: string };
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const PRAYERS: { key: string; labelAr: string }[] = [
  { key: "Fajr",    labelAr: "الفجر"   },
  { key: "Dhuhr",   labelAr: "الظهر"   },
  { key: "Asr",     labelAr: "العصر"   },
  { key: "Maghrib", labelAr: "المغرب"  },
  { key: "Isha",    labelAr: "العشاء"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatTime(t: string) {
  return t?.slice(0, 5) ?? "—";
}

export function daysUntilFriday() {
  const now = new Date();
  const day = now.getDay();
  let diff = (5 - day + 7) % 7;
  if (diff === 0) {
    const cutoff = new Date(now);
    cutoff.setHours(13, 0, 0, 0);
    if (now >= cutoff) diff = 7;
  }
  return diff;
}

function getNextPrayer(timings: Record<string, string>): string {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const p of PRAYERS) {
    const [h, m] = timings[p.key].split(":").map(Number);
    if (h * 60 + m > nowMinutes) return p.key;
  }
  return PRAYERS[0].key; // الفجر (اليوم التالي)
}

// ─── Shared Query Hook ────────────────────────────────────────────────────────

function usePrayerTimes() {
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${today.getFullYear()}`;

  return useQuery({
    queryKey: ["prayer-times", dateStr],
    queryFn: async (): Promise<AladhanResponse> => {
      const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Algiers&country=DZ&method=19`,
      );
      if (!res.ok) throw new Error("Failed to fetch prayer times");
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
    gcTime:    1000 * 60 * 60 * 6,
    retry: 1,
  });
}

// ─── FridayCountdown ──────────────────────────────────────────────────────────

export function FridayCountdown() {
  const days = daysUntilFriday();
  const label =
    days === 0
      ? "اليوم الجمعة — جهّز الخطبة"
      : days === 1
        ? "غدًا الجمعة — اللمسات الأخيرة"
        : `متبقٍ ${days} أيام لخطبة الجمعة القادمة`;
  const urgent = days <= 1;
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        urgent
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-border/60 bg-muted/40 text-muted-foreground"
      }`}
      title="عدّاد تجهيز خطبة الجمعة"
    >
      <CalendarClock className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}

// ─── PrayerTimesCompact (للـ Header) ─────────────────────────────────────────

export function PrayerTimesCompact() {
  const { data, isLoading, isError } = usePrayerTimes();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>تحميل مواقيت الصلاة…</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>تعذّر تحميل مواقيت الصلاة</span>
      </div>
    );
  }

  const timings = data.data.timings;

  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-2 py-1 text-xs">
      <span className="border-l border-border/60 pl-2 font-semibold text-primary">
        مواقت الصلاة الحالية
      </span>
      <Clock className="h-3.5 w-3.5 text-primary" />
      <span className="hidden text-muted-foreground sm:inline">الجزائر:</span>
      <div className="flex items-center gap-2 ps-1">
        {PRAYERS.map((p) => (
          <div key={p.key} className="flex items-baseline gap-1">
            <span className="font-medium text-foreground">{p.labelAr}</span>
            <span className="tabular-nums text-muted-foreground">
              {formatTime(timings[p.key])}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PrayerTimesFooter (للـ Footer) ──────────────────────────────────────────

export function PrayerTimesFooter() {
  const { data, isLoading, isError } = usePrayerTimes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 py-3">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        <span className="text-xs text-muted-foreground">تحميل مواقيت الصلاة…</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>تعذّر تحميل مواقيت الصلاة</span>
      </div>
    );
  }

  const timings = data.data.timings;
  const nextPrayer = getNextPrayer(timings);

  return (
    <div className="w-full border-b border-border/40 pb-5 mb-2">
      {/* Header Row */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary tracking-wide">
          مواقيت الصلاة — الجزائر
        </span>
      </div>

      {/* Prayer Cards Row */}
      <div className="flex items-stretch justify-center gap-2 overflow-x-auto pb-1 px-2">
        {PRAYERS.map((p) => {
          const isNext = p.key === nextPrayer;
          return (
            <div
              key={p.key}
              className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 min-w-[58px] border transition-all ${
                isNext
                  ? "border-primary/40 bg-primary/10 text-primary shadow-sm"
                  : "border-border/40 bg-muted/30 text-muted-foreground"
              }`}
              title={isNext ? "الصلاة القادمة" : undefined}
            >
              <span className={`text-[10px] font-bold tracking-wide ${isNext ? "text-primary" : "text-muted-foreground"}`}>
                {p.labelAr}
              </span>
              <span className={`tabular-nums text-sm font-semibold ${isNext ? "text-primary" : "text-foreground/80"}`}>
                {formatTime(timings[p.key])}
              </span>
              {isNext && (
                <span className="text-[9px] font-medium text-primary/70 leading-none">
                  القادمة
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
