import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComposerProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Compact variant for hero. */
  variant?: "default" | "hero";
}

const DEFAULT_PLACEHOLDER = "ابحث عن خطبة جمعة…";

export function Composer({
  onSend,
  placeholder = DEFAULT_PLACEHOLDER,
  disabled,
  variant = "default",
}: ComposerProps) {
  const [value, setValue] = useState("");

  const submit = () => {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-3xl border border-border bg-surface p-2.5 shadow-elegant transition focus-within:border-primary/50 w-full",
      )}
    >
      <div className="flex items-end gap-2">
        <textarea
          dir="rtl"
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[44px] max-h-40 flex-1 resize-none bg-transparent px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/80 focus:outline-none disabled:opacity-50"
          aria-label="صندوق المحادثة"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          className="h-11 w-11 shrink-0 rounded-2xl"
          aria-label="إرسال"
        >
          <Send className="h-4 w-4 rtl:-scale-x-100" />
        </Button>
      </div>
      <div className="flex items-center justify-between px-3 pb-1 pt-0.5 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Sparkles className="h-3 w-3" /> اضغط Enter للإرسال · Shift+Enter لسطر جديد
        </span>
        <span className="hidden sm:inline">محرّك بحث ذكي للأرشيف العربي</span>
      </div>
    </form>
  );
}
