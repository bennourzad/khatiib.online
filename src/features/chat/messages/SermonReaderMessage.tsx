import { useState } from "react";
import type { Sermon } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Star,
  Wand2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import { AssistantMessage, AssistantBlock } from "./MessageBubble";
import { toast } from "sonner";

interface SermonReaderMessageProps {
  sermon: Sermon;
  reason?: string;
  onSave?: () => void;
  onCreateCustom?: () => void;
}

export function SermonReaderMessage({
  sermon,
  reason,
  onSave,
  onCreateCustom,
}: SermonReaderMessageProps) {
  const [collapsed, setCollapsed] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${sermon.title}\n\n${sermon.fullText}`);
      toast.success("تم نسخ نص المادة");
    } catch {
      toast.error("تعذّر النسخ");
    }
  };

  return (
    <div className="space-y-3">
      <AssistantMessage>
        {reason ?? `هذه «${sermon.title}» من تصنيف «${sermon.categoryName}»:`}
      </AssistantMessage>
      <AssistantBlock>
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-elegant">
          <div className="p-5 sm:p-7">
            <header>
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">
                  {sermon.contentType}
                </span>
                <span>{sermon.categoryName}</span>
                {sermon.estimatedMinutes && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{sermon.estimatedMinutes} دقيقة قراءة
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold leading-snug text-foreground sm:text-2xl">
                {sermon.title}
              </h2>
            </header>

            {!collapsed && (
              <div className="prose-arabic mt-6 space-y-6 text-foreground/90">
                {sermon.sections.map((section, i) => (
                  <section key={i}>
                    <h3 className="mb-2 text-sm font-semibold text-primary">
                      {section.heading}
                    </h3>
                    <p className="leading-loose text-foreground/85 whitespace-pre-line">
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <Button size="sm" variant="outline" onClick={handleCopy} className="gap-1.5">
                <Copy className="h-3.5 w-3.5" />
                نسخ النص
              </Button>
              {onSave && (
                <Button size="sm" variant="outline" onClick={onSave} className="gap-1.5">
                  <Star className="h-3.5 w-3.5" />
                  حفظ في المفضلة
                </Button>
              )}
              {onCreateCustom && (
                <Button size="sm" variant="default" onClick={onCreateCustom} className="gap-1.5">
                  <Wand2 className="h-3.5 w-3.5" />
                  صياغة مخصصة من هذا الموضوع
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCollapsed((v) => !v)}
                className="ms-auto gap-1.5"
                aria-expanded={!collapsed}
              >
                {collapsed ? (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    عرض كامل
                  </>
                ) : (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    طيّ
                  </>
                )}
              </Button>
            </div>
          </div>
        </article>
      </AssistantBlock>
    </div>
  );
}
