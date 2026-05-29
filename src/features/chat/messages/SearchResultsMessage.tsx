import type { SearchResult, Sermon } from "@/types";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Wand2, ArrowLeft } from "lucide-react";
import { AssistantMessage, AssistantBlock } from "./MessageBubble";

interface SearchResultsMessageProps {
  query: string;
  results: SearchResult[];
  onOpen: (sermon: Sermon) => void;
  onSave?: (sermon: Sermon) => void;
  onCreateCustom?: (sermon: Sermon) => void;
}

export function SearchResultsMessage({
  query,
  results,
  onOpen,
  onSave,
  onCreateCustom,
}: SearchResultsMessageProps) {
  return (
    <div className="space-y-3">
      <AssistantMessage>
        وجدت لك {results.length} {results.length === 1 ? "نتيجة" : "نتائج"} داخل التصنيفات
        مرتبطة بـ «<span className="font-semibold text-foreground">{query}</span>»:
      </AssistantMessage>
      <AssistantBlock>
        <div className="space-y-3">
          {results.map((r) => (
            <ResultCard
              key={r.sermon.id}
              result={r}
              onOpen={() => onOpen(r.sermon)}
              onSave={onSave ? () => onSave(r.sermon) : undefined}
              onCreateCustom={onCreateCustom ? () => onCreateCustom(r.sermon) : undefined}
            />
          ))}
        </div>
      </AssistantBlock>
    </div>
  );
}

function ResultCard({
  result,
  onOpen,
  onSave,
  onCreateCustom,
}: {
  result: SearchResult;
  onOpen: () => void;
  onSave?: () => void;
  onCreateCustom?: () => void;
}) {
  const { sermon, hint } = result;
  return (
    <article className="group rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-elegant">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 font-medium text-primary">
          {sermon.contentType}
        </span>
        <span className="text-muted-foreground">{sermon.categoryName}</span>
        {hint && <span className="text-muted-foreground/70">· {hint}</span>}
      </div>
      <h4 className="mb-1.5 text-base font-semibold leading-snug">{sermon.title}</h4>
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{sermon.excerpt}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" onClick={onOpen} className="gap-1.5">
          <BookOpen className="h-3.5 w-3.5" />
          عرض المادة
          <ArrowLeft className="h-3 w-3 rtl:rotate-180" />
        </Button>
        {onSave && (
          <Button size="sm" variant="outline" onClick={onSave} className="gap-1.5">
            <Star className="h-3.5 w-3.5" />
            حفظ
          </Button>
        )}
        {onCreateCustom && (
          <Button size="sm" variant="ghost" onClick={onCreateCustom} className="gap-1.5 text-primary">
            <Wand2 className="h-3.5 w-3.5" />
            صياغة مخصصة
          </Button>
        )}
      </div>
    </article>
  );
}
