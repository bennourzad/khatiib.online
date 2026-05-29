import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssistantMessage, AssistantBlock } from "./MessageBubble";

export function CreateIntentMessage({ topic, onStart }: { topic: string; onStart: () => void }) {
  return (
    <div className="space-y-3">
      <AssistantMessage>
        فهمت أنك تريد صياغة محتوى جديد حول «<span className="font-semibold text-foreground">{topic}</span>». ممتاز —
        دعنا نبدأ خطوة بخطوة.
      </AssistantMessage>
      <AssistantBlock>
        <div className="rounded-2xl border border-primary/30 bg-primary-soft/50 p-5">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            ورشة صياغة موجَّهة
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/85">
            سنحدّد معًا: نوع المحتوى، الجمهور، المدة، النبرة، والمحاور الأساسية. ثم نُولّد المخطط،
            وبعد اعتمادك نُولّد المسودة الكاملة القابلة للحفظ والتعديل.
          </p>
          <div className="mt-4">
            <Button asChild className="gap-1.5">
              <Link to="/app/create" search={{ topic }}>
                <Wand2 className="h-4 w-4" />
                افتح ورشة الصياغة
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
        </div>
      </AssistantBlock>
    </div>
  );
}
