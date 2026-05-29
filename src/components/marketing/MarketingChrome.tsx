import { Link } from "@tanstack/react-router";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function MarketingHeader({ showNav = true }: { showNav?: boolean }) {
  return (
    <header id="top" className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex flex-col items-start gap-0.5 select-none py-1">
          <Logo size="sm" />
          <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-1 py-0.5 rounded leading-none">وضع تجريبي</span>
        </Link>

        {showNav && (
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <Link
              to="/"
              hash="top"
              onClick={() => {
                if (window.location.pathname === "/") {
                  document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="transition-colors hover:text-foreground"
            >
              الرئيسية
            </Link>
            <Link to="/about" className="transition-colors hover:text-foreground">عن خطيب</Link>
            <Link to="/" hash="workshop" className="transition-colors hover:text-foreground">مسار الورشة</Link>
            <Link to="/" hash="sources-animation" className="transition-colors hover:text-foreground">التوثيق الذكي</Link>
            <Link to="/" hash="faq" className="transition-colors hover:text-foreground">أسئلة</Link>
            <Link to="/app/saved" className="transition-colors hover:text-foreground">خطبي المحفوظة</Link>
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          <Link to="/workshop">
            <Button size="sm" className="rounded-full bg-gradient-brand px-4 shadow-elegant hover:opacity-95 cursor-pointer">
              ابدأ ورشتك الآن
              <ArrowLeft className="ms-1 h-4 w-4" />
            </Button>
          </Link>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer rounded-full" title="تنبيه هام حول الحفظ">
                <Info className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent dir="rtl" className="max-w-md">
              <AlertDialogHeader className="text-right">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Info className="h-5 w-5" />
                </div>
                <AlertDialogTitle className="text-right">تنبيه هام لحفظ خطبك</AlertDialogTitle>
                <AlertDialogDescription className="text-right leading-relaxed text-sm space-y-4 mt-3">
                  <span className="block text-foreground font-bold">أخي الكريم، الخطيب المبارك..</span>
                  
                  {/* Local Storage Explanation Card */}
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-right relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-primary/10 blur-xl opacity-60" />
                    <div className="flex gap-2.5 items-start relative z-10 text-xs font-semibold text-foreground/90 leading-relaxed">
                      <span className="text-primary shrink-0 mt-0.5">📂</span>
                      <p>
                        المنصة حالياً تحفظ مسودات خطبك <strong className="text-primary">بشكل محلي مؤقت</strong> على جهازك الحالي (المتصفح). لا توفر المنصة حسابات مستخدمين سحابية في هذا الإصدار التجريبي.
                      </p>
                    </div>
                  </div>

                  {/* Recommendation Card */}
                  <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-2 text-right relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-amber-500/10 blur-xl opacity-60" />
                    <div className="flex gap-2.5 items-start relative z-10 text-xs font-semibold text-foreground/90 leading-relaxed">
                      <span className="text-amber-600 shrink-0 mt-0.5">⚠️</span>
                      <p>
                        لتجنب ضياع جهدك الثمين في حال تغيير الجهاز أو تنظيف بيانات المتصفح، ننصحك بشدة بـ <strong>«تصدير الكل»</strong> وحفظ ملفات الوورد على جهازك الخاص بانتظام.
                      </p>
                    </div>
                  </div>

                  {/* Future release note */}
                  <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/80 font-medium py-1">
                    <span>✨</span>
                    <span>سيتم توفير ميزة الحسابات السحابية والربط الآمن للخطباء قريباً بإذن الله.</span>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-4">
                <AlertDialogAction className="bg-primary text-primary-foreground hover:bg-primary/90">
                  حسناً، فهمت ذلك
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6">
        {/* Right Section: Logo, Copyright & Version */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <div className="flex items-center gap-2">
            <LogoMark size={16} />
            <span>· جميع الحقوق محفوظة</span>
            <span className="text-xs text-muted-foreground/60 bg-muted px-1.5 py-0.5 rounded border border-border/40 font-mono">الإصدار 0.1</span>
          </div>
          <div className="text-xs text-muted-foreground/80">
            صنع بحب ❤️{" "}
            <a
              href="https://api.whatsapp.com/send?phone=213561705544&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%A8%D9%83%20%D8%B6%D9%8A%D9%81%D8%A7%20%D8%B9%D8%B2%D9%8A%D8%B2%D8%A7"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-primary transition-colors"
            >
              By Bennour
            </a>{" "}
            2026
          </div>
        </div>

        {/* Left Section: Nav Links & Theme Toggle */}
        <div className="flex flex-col items-center gap-3 sm:items-end">
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="hover:text-foreground transition-colors">الخصوصية</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">الشروط</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">تواصل</Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground/60">تعديل الوضع:</span>
            <ThemeToggle compact />
          </div>
        </div>
      </div>
    </footer>
  );
}
