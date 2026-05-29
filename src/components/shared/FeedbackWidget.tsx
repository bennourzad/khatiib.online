import { useEffect, useState } from "react";
import { MessageSquare, Star, Sparkles, X, Heart, MessageSquareQuote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    id: 1,
    title: "فكرة ورشة العمل الذكية",
    question: "ما مدى ملاءمة فكرة ورشة العمل الذكية لمساعدة أئمة المساجد في تنظيم أفكارهم الكبيرة؟",
  },
  {
    id: 2,
    title: "تجربة الصياغة وسرعة التوليد",
    question: "كيف تقيّم تجربة وسرعة صياغة مسودة الخطبة بخطواتها المتكاملة ونظام التوليد السريع الجديد؟",
  },
  {
    id: 3,
    title: "جماليات التصميم والواجهة الرسومية",
    question: "ما مدى رضاك عن جمال وسلاسة الواجهة الرسومية والتصميم البصري وتناسق ألوان الثيم الفاخر؟",
  },
  {
    id: 4,
    title: "أصالة وموثوقية الأدلة الشرعية",
    question: "ما تقييمك لأصالة وموثوقية تخريج الأحاديث وتفسير الآيات بالرسم العثماني المعتمد؟",
  },
  {
    id: 5,
    title: "توفير الوقت والجهد للخطيب",
    question: "إلى أي مدى ترى أن هذا المشروع سيوفر وقتاً وجهداً حقيقياً للخطيب في تحضيره المنبري الأسبوعي؟",
  },
];

const LOCAL_STORAGE_KEY = "khatiib:feedback_submitted";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStars, setHoveredStars] = useState<Record<number, number>>({});
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Check if already submitted in previous sessions
  useEffect(() => {
    const isSubmitted = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (isSubmitted === "true") {
      setAlreadySubmitted(true);
    }
  }, []);

  // Calculate average rating
  const averageRating = calculateAverage(ratings);

  const handleSetRating = (questionId: number, rating: number) => {
    setRatings((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleHoverRating = (questionId: number, rating: number) => {
    setHoveredStars((prev) => ({
      ...prev,
      [questionId]: rating,
    }));
  };

  const handleSubmit = () => {
    // Ensure all 5 questions are answered
    if (Object.keys(ratings).length < QUESTIONS.length) {
      return;
    }
    
    // Save to local storage to prevent showing floating button again
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    setSubmitted(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (submitted) {
      setAlreadySubmitted(true);
    }
  };

  const isFormValid = Object.keys(ratings).length === QUESTIONS.length;

  // Custom feedback text based on rating
  const feedbackMessage = getFeedbackMessage(averageRating);

  // Don't render floating icon if survey has been completed
  if (alreadySubmitted) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button on the Left */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-5 bottom-8 md:bottom-10 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant transition-all duration-300 hover:scale-108 hover:rotate-3 active:scale-95 cursor-pointer animate-pulse-slow border border-primary/20"
        title="استبيان تقييم المنصة"
      >
        <MessageSquareQuote className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Survey Modal */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          dir="rtl"
          className="sm:max-w-xl max-h-[85vh] overflow-y-auto border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl p-6 rounded-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-right pb-4 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-foreground text-xl font-black">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              استبيان تقييم تجربة «خطيب»
            </DialogTitle>
            <DialogDescription className="text-xs mt-1.5 leading-relaxed text-muted-foreground">
              رأيك الغالي يا صاحب الكلمة يهمنا لكي نرتقي بالمنصة ونقدّم الخدمة الأجود لخطباء الأمة ومنابر الرسالة.
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            /* Questions View */
            <div className="space-y-6 mt-5 py-2">
              {QUESTIONS.map((q) => {
                const currentRating = ratings[q.id] || 0;
                const currentHover = hoveredStars[q.id] || 0;
                return (
                  <div key={q.id} className="space-y-2">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {q.title}
                    </div>
                    <p className="text-sm leading-relaxed text-foreground font-medium">
                      {q.question}
                    </p>
                    {/* Star Row */}
                    <div className="flex flex-row-reverse justify-end items-center gap-1.5 pt-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => {
                        const starVal = 5 - starIndex;
                        const isActive = starVal <= (currentHover || currentRating);
                        return (
                          <button
                            key={starIndex}
                            type="button"
                            onClick={() => handleSetRating(q.id, starVal)}
                            onMouseEnter={() => handleHoverRating(q.id, starVal)}
                            onMouseLeave={() => handleHoverRating(q.id, 0)}
                            className="focus:outline-none transition-all hover:scale-120 duration-150 cursor-pointer"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 stroke-[1.8]",
                                isActive
                                  ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
                                  : "text-muted-foreground/45 hover:text-amber-300"
                              )}
                            />
                          </button>
                        );
                      })}
                      {currentRating > 0 && (
                        <span className="ms-2 text-xs font-bold text-amber-500 font-mono">
                          {currentRating} / 5
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-border/50 flex flex-col gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid}
                  className="w-full bg-gradient-brand text-primary-foreground font-semibold shadow-lg hover:opacity-95 transition-all rounded-xl py-5"
                >
                  إرسال التقييم
                </Button>
                {!isFormValid && (
                  <p className="text-[11px] text-center text-muted-foreground mt-1">
                    * يرجى الإجابة على جميع الأسئلة الخمسة لتفعيل زر الإرسال.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Success / Beautiful Rating Screen */
            <div className="mt-6 text-center py-6 animate-in fade-in zoom-in duration-300">
              {/* Islamic Star Rosette Graphic with Average Score */}
              <div className="relative mx-auto flex h-36 w-36 items-center justify-center select-none">
                {/* Rotating Geometric Background rosette */}
                <div className="absolute inset-0 opacity-10 mix-blend-screen text-primary animate-spin-slow" style={{ animationDuration: "35s" }}>
                  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="h-full w-full">
                    <rect x="25" y="25" width="50" height="50" transform="rotate(0 50 50)" />
                    <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
                    <rect x="25" y="25" width="50" height="50" transform="rotate(22.5 50 50)" />
                    <rect x="25" y="25" width="50" height="50" transform="rotate(67.5 50 50)" />
                  </svg>
                </div>
                
                {/* Glowing Outer Sphere */}
                <div className="absolute h-28 w-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-elegant">
                  <div className="text-center font-mono">
                    <span className="block text-[32px] font-black text-primary leading-none">
                      {averageRating.toFixed(1)}
                    </span>
                    <span className="block text-[11px] font-bold text-muted-foreground mt-0.5 uppercase tracking-wide">
                      من أصل 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated star row */}
              <div className="flex justify-center items-center gap-1 mt-6 animate-pulse-slow">
                {Array.from({ length: 5 }).map((_, i) => {
                  const isFull = i < Math.floor(averageRating);
                  const isHalf = !isFull && i < Math.ceil(averageRating);
                  return (
                    <Star
                      key={i}
                      className={cn(
                        "h-6 w-6 stroke-[1.8]",
                        isFull
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                          : isHalf
                          ? "fill-amber-400/40 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  );
                })}
              </div>

              {/* Heartwarming Spiritual Message */}
              <div className="mt-8 space-y-4 max-w-sm mx-auto">
                <h3 className="text-lg font-black text-foreground">
                  تقبل الله منكم صالح القول والعمل!
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
                  "{feedbackMessage}"
                </p>
                <div className="flex items-center justify-center gap-1.5 text-xs text-primary font-bold">
                  <Heart className="h-4 w-4 fill-primary" />
                  <span>دمت منارة علم للمسلمين ومنبر هدى للإسلام</span>
                </div>
              </div>

              <div className="pt-6 mt-8 border-t border-border/50">
                <Button
                  onClick={handleClose}
                  className="w-full bg-gradient-brand text-primary-foreground font-semibold shadow-elegant hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl py-5"
                >
                  إغلاق واستكمال الورشة
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Custom helper for average calculation
function calculateAverage(ratings: Record<number, number>) {
  const values = Object.values(ratings);
  if (values.length === 0) return 0;
  return values.reduce((sum, r) => sum + r, 0) / values.length;
}

// Custom feedback message helper
function getFeedbackMessage(average: number) {
  if (average >= 4.5) {
    return "شكرًا لك يا صاحب المنبر وبصيرة الدعوة، تقييمك العالي يُنير لنا الدرب ويُحفزنا للارتقاء بـ 'خطيب' لأعلى آفاق الإتقان خدمةً لمنابر الإسلام.";
  } else if (average >= 3.5) {
    return "نقدّر تقييمك الكريم ووقتك الثمين. كلماتك وتجربتك ستساعدنا في تهذيب وتطوير خدماتنا لنكون الأفضل دائمًا في خدمة رسالتكم السامية.";
  } else {
    return "نشكرك بصدق على ملاحظاتك الصادقة، وسوف نسعى جاهدين لإدخال التحسينات الفقهية والتصميمية اللازمة لنحوز على رضاكم وثقتكم الغالية.";
  }
}
