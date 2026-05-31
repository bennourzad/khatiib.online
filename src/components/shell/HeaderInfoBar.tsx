import { PrayerTimesCompact, FridayCountdown } from "@/components/shared/PrayerTimes";

export function HeaderInfoBar() {
  return (
    <div className="flex flex-1 items-center justify-center gap-3 overflow-x-auto">
      <div className="hidden md:block">
        <PrayerTimesCompact />
      </div>
      <FridayCountdown />
    </div>
  );
}
