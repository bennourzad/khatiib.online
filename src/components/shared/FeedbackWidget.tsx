import { useEffect, useState } from "react";
import { MessageSquare, Star, Sparkles, X, Heart, MessageSquareQuote, ArrowUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    id: 1,
    title: "فكرة ورشة العمل الذكية",
    question: "ما تقييمك لفكرة ورشة العمل الذكية لتنظيم أفكارك المنبرية؟",
  },
  {
    id: 2,
    title: "تجربة الصياغة وسرعة التوليد",
    question: "كيف تقيّم سرعة وسلاسة صياغة مسودة الخطبة الجديدة؟",
  },
  {
    id: 3,
    title: "جماليات التصميم والواجهة الرسومية",
    question: "ما مدى رضاك عن جمال تصميم الواجهات وألوان الثيم الفاخر؟",
  },
  {
    id: 4,
    title: "أصالة وموثوقية الأدلة الشرعية",
    question: "ما تقييمك لموثوقية الأدلة وتخريج الأحاديث بالمنصة؟",
  },
  {
    id: 5,
    title: "توفير الوقت والجهد للخطيب",
    question: "إلى أي مدى تُسهم المنصة في توفير وقتك وجهدك التحضيري؟",
  },
];

const LOCAL_STORAGE_KEY = "khatiib:feedback_submitted";
const LOCAL_STORAGE_RATINGS = "khatiib:feedback_ratings";

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStars, setHoveredStars] = useState<Record<number, number>>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll position to show/hide "Scroll to Top" button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Check if already submitted in previous sessions
  useEffect(() => {
    const isSubmitted = localStorage.getItem(LOCAL_STORAGE_KEY);
    const storedRatings = localStorage.getItem(LOCAL_STORAGE_RATINGS);
    if (isSubmitted === "true") {
      setSubmitted(true);
      if (storedRatings) {
        try {
          setRatings(JSON.parse(storedRatings));
        } catch (e) {
          console.error("Error parsing stored ratings", e);
        }
      }
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

    // Save to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, "true");
    localStorage.setItem(LOCAL_STORAGE_RATINGS, JSON.stringify(ratings));
    setSubmitted(true);
  };

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LOCAL_STORAGE_RATINGS);
    setRatings({});
    setSubmitted(false);
    setHoveredStars({});
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isFormValid = Object.keys(ratings).length === QUESTIONS.length;

  // Custom feedback text based on rating
  const feedbackMessage = getFeedbackMessage(averageRating);

  return (
    <>
      {/* Floating Trigger Button on the Left */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-5 bottom-8 md:bottom-10 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border border-primary/20"
        title="استبيان تقييم المنصة"
      >
        <MessageSquareQuote className="h-5 w-5 text-primary-foreground" />
      </button>

      {/* Scroll to Top Button on the Right */}
      <button
        type="button"
        onClick={scrollToTop}
        className={cn(
          "fixed right-5 bottom-8 md:bottom-10 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-brand text-primary-foreground shadow-elegant transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer border border-primary/20",
          showScrollTop
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-95 pointer-events-none"
        )}
        title="العودة لأعلى الصفحة"
      >
        <ArrowUp className="h-5 w-5 text-primary-foreground" />
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
              بصمتكم في تطوير المنصة تصنع الفارق؛ يسعدنا أن نستمع لنصحكم ومقترحاتكم الغالية.
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

              {/* Detailed Question Ratings Accordion */}
              <Accordion type="single" collapsible className="w-full mt-8 text-right bg-muted/40 border border-border/40 rounded-xl px-4 py-1">
                <AccordionItem value="detailed-ratings" className="border-none">
                  <AccordionTrigger className="text-xs font-black text-primary hover:no-underline flex items-center justify-between py-3">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      تفاصيل تقييمك للمنصة
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-3">
                    <div className="divide-y divide-border/20">
                      {QUESTIONS.map((q) => {
                        const ratingVal = ratings[q.id] || 0;
                        return (
                          <div key={q.id} className="flex justify-between items-center py-2.5 text-xs font-semibold">
                            <span className="text-foreground/90">{q.title}</span>
                            <div className="flex flex-row-reverse items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, starIdx) => {
                                const val = 5 - starIdx;
                                return (
                                  <Star
                                    key={starIdx}
                                    className={cn(
                                      "h-3.5 w-3.5 stroke-[1.8]",
                                      val <= ratingVal
                                        ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.3)]"
                                        : "text-muted-foreground/20"
                                    )}
                                  />
                                );
                              })}
                              <span className="ms-1.5 font-bold text-amber-500 font-mono text-[10px]">
                                {ratingVal}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="pt-6 mt-8 border-t border-border/50 flex flex-row gap-3 w-full">
                <Button
                  onClick={handleClose}
                  className="flex-1 bg-gradient-brand text-primary-foreground font-semibold shadow-elegant hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl py-5 text-xs sm:text-sm"
                >
                  إغلاق واستكمال الورشة
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 text-foreground border-border/80 font-semibold hover:bg-muted/40 transition-all rounded-xl py-5 text-xs sm:text-sm"
                >
                  إعادة تقييم الاستبيان
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
