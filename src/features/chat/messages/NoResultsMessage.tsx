import { Sparkles, ArrowLeft, Search, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { AssistantMessage, AssistantBlock } from "./MessageBubble";
import { QuickChips } from "../QuickChips";

interface NoResultsMessageProps {
  query: string;
  relatedCategories: string[];
  alternativeQueries?: string[];
  onTryAlternative: (q: string) => void;
  onExploreCategory: (name: string) => void;
  onStartCreate: () => void;
}

export function NoResultsMessage({
  query,
  relatedCategories,
  alternativeQueries = [],
  onTryAlternative,
  onExploreCategory,
  onStartCreate,
}: NoResultsMessageProps) {
  return (
    <div className="space-y-3">
      <AssistantMessage>
        لم أجد مادة مطابقة تمامًا لـ «<span className="font-semibold text-foreground">{query}</span>»
        في الأرشيف الحالي. لكن لديك خيارات جيدة للمضي:
      </AssistantMessage>
      <AssistantBlock>
        <div className="rounded-2xl border border-dashed border-primary/40 bg-primary-soft/40 p-5 sm:p-6">
          <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            يمكنني أن أبني لك خطبة جديدة حول هذا الموضوع
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/85">
            سأقودك في محادثة سريعة لتحديد الجمهور، المدة، والنبرة، ثم نولّد المخطط فالمسودة
            القابلة للحفظ والتعديل.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={onStartCreate} className="gap-1.5">
              ابدأ صياغة خطبة الآن
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <Link to="/app/categories">
                <Compass className="h-4 w-4" />
                استكشف التصنيفات
              </Link>
            </Button>
          </div>

          {alternativeQueries.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Search className="h-3 w-3" /> جرّب تعبيرًا أقرب
              </div>
              <QuickChips items={alternativeQueries} onSelect={onTryAlternative} />
            </div>
          )}

          {relatedCategories.length > 0 && (
            <div className="mt-5">
              <div className="mb-2 text-xs font-medium text-muted-foreground">تصنيفات ذات صلة</div>
              <QuickChips items={relatedCategories} onSelect={onExploreCategory} />
            </div>
          )}
        </div>
      </AssistantBlock>
    </div>
  );
}
