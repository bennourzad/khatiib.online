import { cn } from "@/lib/utils";

interface QuickChipsProps {
  items: string[];
  onSelect: (item: string) => void;
  className?: string;
}

/** Pill-shaped quick replies used across the chat for suggested prompts,
 *  refinements, and step choices. */
export function QuickChips({ items, onSelect, className }: QuickChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] text-foreground/80 transition hover:border-primary/40 hover:bg-primary-soft hover:text-foreground"
        >
          {item}
        </button>
      ))}
    </div>
  );
}
