import { Link, useRouterState } from "@tanstack/react-router";
import { Plus, MessagesSquare, CalendarDays, Trash2, Info, Lightbulb } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import {
  PRIMARY_NAV,
  LIBRARY_NAV,
  ACCOUNT_NAV,
  ADMIN_NAV,
  type NavItem,
} from "@/config/navigation";
import { historyStore } from "@/stores/history";
import { useMemo } from "react";
import { SermonPhilosophyFull } from "@/components/shared/SermonPhilosophyFull";


function ComingSoonBadge() {
  return (
    <span className="ms-auto rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
      قريبًا
    </span>
  );
}

function TodayDate() {
  const today = new Date();
  const gregorian = today.toLocaleDateString("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
  } catch {
    hijri = "";
  }
  return (
    <div className="flex items-start gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-[11px] leading-snug text-muted-foreground">
      <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
      <div className="flex flex-col">
        <span className="font-medium text-foreground/80">{gregorian}</span>
        {hijri && <span className="text-muted-foreground/80">{hijri}</span>}
      </div>
    </div>
  );
}

function NewBadge() {
  return (
    <span className="ms-auto rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">
      جديد
    </span>
  );
}

function NavRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const iconClass =
    item.to === "/app/create"
      ? "h-4 w-4 text-primary animate-sparkle-glow"
      : "h-4 w-4";
  if (item.comingSoon) {
    return (
      <SidebarMenuButton
        isActive={isActive}
        aria-disabled
        title="قريبًا"
        className="cursor-not-allowed opacity-60 hover:bg-transparent"
        onClick={(e) => e.preventDefault()}
      >
        <item.icon className={iconClass} />
        <span>{item.labelAr}</span>
        <ComingSoonBadge />
      </SidebarMenuButton>
    );
  }
  return (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link to={item.to}>
        <item.icon className={iconClass} />
        <span>{item.labelAr}</span>
        {item.to === "/app/create" && <NewBadge />}
      </Link>
    </SidebarMenuButton>
  );
}


export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const conversations = historyStore.use();
  const recent = useMemo(
    () =>
      [...conversations]
        .sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return b.updatedAt.localeCompare(a.updatedAt);
        })
        .slice(0, 8),
    [conversations],
  );

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.to : pathname.startsWith(item.to);

  return (
    <Sidebar side="right" collapsible="icon">
      <SidebarHeader className="gap-3 p-3">
        <Link
          to="/app"
          search={{ n: String(Date.now()) }}
          className="flex items-center justify-center px-1 py-1"
        >
          <Logo className="h-[26px]" />
        </Link>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground group-data-[collapsible=icon]:hidden mb-2">
          منصة ذكية لصياغة الخطب الإسلامية واستكشاف أرشيف موقع منصة خطيب .
        </p>
        <div className="group-data-[collapsible=icon]:hidden">
          <TodayDate />
        </div>
        <div className="relative">
          <div className="absolute -inset-[1px] rounded-lg bg-primary/30 blur-[2px] animate-pulse-slow" />
          <Button
            asChild
            className="relative w-full justify-start gap-2 py-3 text-base font-semibold shadow-[0_0_16px_-4px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] transition-all hover:shadow-[0_0_24px_-6px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]"
          >
            <Link to="/app" search={{ n: String(Date.now()) }}>
              <Plus className="h-4 w-4 animate-wand-sparkle" />
              <span className="group-data-[collapsible=icon]:hidden">محادثة جديدة</span>
            </Link>
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>الرئيسية</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PRIMARY_NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <NavRow item={item} isActive={isActive(item)} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>المكتبة</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {LIBRARY_NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <NavRow item={item} isActive={isActive(item)} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>محادثات أخيرة</SidebarGroupLabel>
          <SidebarGroupContent>
            {recent.length === 0 ? (
              <p className="px-2 py-1.5 text-xs text-muted-foreground">
                لا توجد محادثات بعد. ابدأ محادثة جديدة لتظهر هنا.
              </p>
            ) : (
              <SidebarMenu>
                {recent.map((c) => (
                  <SidebarMenuItem key={c.id}>
                    <SidebarMenuButton asChild tooltip={c.title}>
                      <Link to="/app/history">
                        <MessagesSquare className="h-4 w-4 opacity-70" />
                        <span className="truncate">{c.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          type="button"
                          aria-label="حذف المحادثة"
                          className="absolute end-1 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover/menu-item:opacity-100 focus:opacity-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف المحادثة؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف «{c.title}» نهائيًا من السجل. لا يمكن التراجع عن هذا الإجراء.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              historyStore.remove(c.id);
                              toast.message("تم حذف المحادثة");
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 p-3">
        <SidebarSeparator />
        <SidebarMenu>
          {[...ACCOUNT_NAV, ...ADMIN_NAV].map((item) => (
            <SidebarMenuItem key={item.to}>
              <NavRow item={item} isActive={isActive(item)} />
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <Info className="h-4 w-4" />
                  <span>عن الفكرة</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent dir="rtl" className="max-w-lg">
                <DialogHeader className="text-right">
                  <DialogTitle>منصة خطيب</DialogTitle>
                  <DialogDescription className="text-right">
                    منصة ذكية لصياغة الخطب الإسلامية واستكشاف أرشيف موقع منصة خطيب .
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 text-right">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/90">
                    <h4 className="mb-2 text-sm font-semibold text-primary">لماذا هذا التصور؟</h4>
                    <p className="whitespace-pre-line">
                      {`إن اختيار واجهة المحادثة ليس مجرد تفضيل جمالي .... بل هو قرار استراتيجي؛ حيث أصبحت المحادثة النصية السلوك الرقمي المهيمن عالمياً.
حيث نقدم تجربة محادثة بسيطة ومألوفة تُبعدك عن القوائم المعقدة؛ لنكون من أوّل المنصات الإسلامية التي تجمع بين أصالة المحتوى وعصرية التجربة الرقمية.`}
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-semibold text-foreground">أهم المميزات</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li>
                        <span className="font-medium text-foreground">صياغة موجّهة</span> — خطوات واضحة لبناء خطبتك من الصفر: الموضوع، الجمهور، المدة، النبرة، والمحاور.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">مسودة موثقة من مصادر شرعية</span> — احصل على مسودة كاملة مبنية على مواقع فقهية وتفسيرية موثوقة، جاهزة للمراجعة والتعديل.
                        <span className="mt-1 block text-sm text-foreground/90">المصادر المعتمدة: <a href="https://tafsir.app/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">tafsir.app</a> · <a href="https://hdith.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">hdith.com</a> · <a href="https://sunnah.one/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">sunnah.one</a> · <a href="https://islamqa.info/ar" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">islamqa.info</a> · <a href="https://dorar.net/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">dorar.net</a> · <a href="https://khutabaa.com/ar/khutub" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">khutabaa.com</a> · <a href="https://www.islamweb.net/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">islamweb.net</a></span>
                      </li>
                      <li>
                        <span className="font-medium text-foreground">بحث ذكي في أرشيف موقع منصة خطيب</span> — ابحث في آلاف الخطب والكلمات والدروس بكتابة موضوعك بلغة طبيعية.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">التحقق من صحة الأحاديث</span> — تحقق فوراً من الأحاديث المذكورة في مسودة الخطبة عبر موقع <a href="https://hdith.com/" target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline hover:text-primary">hdith.com</a>.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">مساحة عمل شخصية</span> — احفظ مسوداتك، أضف للمفضلة، وراجع سجلّ محادثاتك، مع ميزة تحميل الخطب في ملف واحد حتى لا تفقد خطبك.
                      </li>
                      <li>
                        <span className="font-medium text-foreground">واجهة عربية سلسة</span> — تصميم RTL مريح مع دعم الوضع الداكن والفاتح.
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/90">
                    <span className="font-semibold text-primary">الهدف:</span> توفير وقت الإمام وتركيزه على الجانب الشرعي والتأثيري، بينما تتولى التقنية التأسيس والصياغة.
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Dialog>
              <DialogTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <Lightbulb className="h-4 w-4" />
                  <span>فلسفة الصياغة</span>
                </SidebarMenuButton>
              </DialogTrigger>
              <DialogContent dir="rtl" className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="text-right">
                  <DialogTitle>لماذا «صياغة خطبة» ليست بديلًا عن الإمام؟</DialogTitle>
                  <DialogDescription className="text-right">
                    رؤيتنا لدور المنصة وحدودها — مسودة تعين الإمام، لا خطبة جاهزة للإلقاء.
                  </DialogDescription>
                </DialogHeader>
                <SermonPhilosophyFull />
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center justify-between gap-2 px-1 group-data-[collapsible=icon]:hidden">
          <ThemeToggle />
          <span className="text-xs text-muted-foreground">الإصدار 0.1</span>
        </div>
        <div className="border-t border-border/60 group-data-[collapsible=icon]:hidden" />
        <div className="px-1 text-center text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          صنع بحب ❤️{" "}
          <a
            href="https://api.whatsapp.com/send?phone=213561705544&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%20%D8%A8%D9%83%20%D8%B6%D9%8A%D9%81%D8%A7%20%D8%B9%D8%B2%D9%8A%D8%B2%D8%A7"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            By Bennour
          </a>{" "}
          2026
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
