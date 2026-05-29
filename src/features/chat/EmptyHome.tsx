import { Link } from "@tanstack/react-router";
import { Sparkles, Wand2, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Logo } from "@/components/brand/Logo";
import { QuickChips } from "./QuickChips";
import { Composer } from "./Composer";

const SUGGESTIONS_POOL = [
  "خطبة عن الصبر للشباب",
  "خطبة عن بر الوالدين",
  "خطبة عن الاستعداد لرمضان",
  "كلمة قصيرة عن الصدق",
  "درس في تفسير الفاتحة",
  "خطبة قصيرة عن الصلاة في 10 دقائق",
  "خطبة عن أهمية الوحدة بين المسلمين",
  "كلمة عن التقوى في الحياة اليومية",
  "درس في أحكام الصيام",
  "خطبة عن بر الوالدين في الإسلام",
  "خطبة عن فضل العلم وأهله",
  "كلمة عن الصبر عند البلاء",
  "درس في سورة الإخلاص",
  "خطبة عن صلة الرحم",
  "خطبة عن الأمانة والصدق في المعاملات",
  "كلمة عن قيمة الوقت",
  "درس في شرح الحديث: إنما الأعمال بالنيات",
  "خطبة عن حفظ اللسان",
  "خطبة عن فضل الدعاء",
  "كلمة عن التعاون على البر والتقوى",
  "درس في آية الكرسي",
  "خطبة عن الغش والخداع",
  "خطبة عن حياة النبي ﷺ دروس وعبر",
  "كلمة عن الحلم والعفو",
  "درس في أحكام الزكاة",
  "خطبة عن فضل قراءة القرآن",
  "خطبة عن الأمل في رحمة الله",
  "كلمة عن الاستغفار والتوبة",
  "درس في شرح سورة الفلق",
  "خطبة عن الإيثار والتضحية",
  "خطبة عن خطر الشرك",
  "كلمة عن حسن الخلق",
  "درس في أحكام الحج",
  "خطبة عن قدسية المسجد",
  "خطبة عن حقوق الجار",
  "كلمة عن شكر النعم",
  "درس في سورة الناس",
  "خطبة عن خطر السحر والحسد",
  "خطبة عن رمضان شهر التغيير",
  "كلمة عن فضل الصدقة",
  "درس في أحكام الطهارة",
  "خطبة عن أهمية الأخوة الإيمانية",
  "خطبة عن الاعتدال في حياتنا",
  "كلمة عن السعادة الحقيقية",
  "درس في شرح حديث: من كان يؤمن بالله",
  "خطبة عن مخاطر السوشال ميديا",
  "خطبة عن قصة أصحاب الكهف",
  "كلمة عن الصداقة الحقيقية",
  "درس في فضل صلاة الفجر",
];

function pickRandomSuggestions(count = 6): string[] {
  const pool = [...SUGGESTIONS_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

interface EmptyHomeProps {
  onPromptSelect: (text: string) => void;
  onSend: (text: string) => void;
}

export function EmptyHome({ onPromptSelect, onSend }: EmptyHomeProps) {
  const [suggestions, setSuggestions] = useState<string[]>(SUGGESTIONS_POOL.slice(0, 6));
  const [greeting, setGreeting] = useState("مرحباً،");

  useEffect(() => {
    setSuggestions(pickRandomSuggestions());
    setGreeting(pickGreeting());
  }, []);

  return (
    <div className="relative isolate flex min-h-full w-full flex-col overflow-hidden">
      {/* Ambient background — soft brand gradient + dotted pattern + blurred blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--color-primary) 10%, var(--color-background)) 0%, var(--color-background) 45%, color-mix(in oklab, var(--color-primary) 8%, var(--color-background)) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--color-primary) 35%, transparent) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 -z-10 h-80 w-80 rounded-full bg-primary/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="mx-auto flex min-h-full w-full flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl text-center">
          <Logo size="lg" className="mx-auto" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            {greeting}
            <span className="text-gradient-brand"> ما موضوع خطبتك اليوم؟</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            ابحث في الأرشيف، أو ابدأ صياغة خطبة جديدة عبر محادثة موجَّهة.
          </p>
        </div>

        <div className="mt-8 w-full max-w-4xl">
          <Composer onSend={onSend} variant="hero" />
        </div>

        <div className="mt-6 hidden w-full max-w-4xl md:block">
          <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> اقتراحات للبداية
          </div>
          <QuickChips items={suggestions} onSelect={onPromptSelect} />
        </div>

        <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-[1px] rounded-[17px] bg-primary/40 blur-[2px] animate-pulse-slow" />
            <QuickAction
              to="/app/create"
              icon={<Wand2 className="h-4 w-4 animate-wand-sparkle" />}
              title="ابدأ صياغة خطبة"
              desc="محادثة موجَّهة خطوة بخطوة حتى مسودة كاملة."
              primary
            />
          </div>
          <QuickAction
            to="/app/categories"
            icon={<Search className="h-4 w-4" />}
            title="استكشف الأرشيف"
            desc="تصفّح آلاف الخطب والكلمات والدروس."
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  desc,
  primary,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        "group relative flex items-start gap-3 overflow-hidden rounded-2xl border bg-card p-4 transition duration-300 " +
        (primary
          ? "border-primary/50 shadow-[0_0_24px_-8px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] hover:shadow-[0_0_32px_-6px_color-mix(in_oklab,var(--color-primary)_45%,transparent)] hover:scale-[1.03] hover:-translate-y-1"
          : "border-border hover:border-primary/40 hover:shadow-elegant hover:scale-[1.01] hover:-translate-y-0.5")
      }
    >
      <span
        className={
          "mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl text-primary transition duration-300 " +
          (primary
            ? "bg-primary/10 shadow-[0_0_14px_-3px_color-mix(in_oklab,var(--color-primary)_35%,transparent)] group-hover:shadow-[0_0_20px_-2px_color-mix(in_oklab,var(--color-primary)_50%,transparent)] group-hover:scale-110"
            : "bg-primary-soft group-hover:bg-primary/15")
        }
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        <span className="block text-xs text-muted-foreground">{desc}</span>
      </span>
    </Link>
  );
}

function pickGreeting() {
  const h = new Date().getHours();
  if (h < 5) return "ليلة مباركة،";
  if (h < 12) return "صباح الخير،";
  if (h < 17) return "نهار مبارك،";
  return "مساء النور،";
}
