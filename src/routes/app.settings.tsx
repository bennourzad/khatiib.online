import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Sun, Moon, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "@/lib/theme";
import { preferencesStore } from "@/stores/preferences";
import { toast } from "sonner";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — منصة خطيب" },
      { name: "description", content: "المظهر والتفضيلات الافتراضية لصياغة الخطب." },
    ],
  }),
  component: SettingsPage,
});

const TONES = ["وعظي مؤثر", "هادئ تربوي", "حماسي تعبوي", "علمي تحليلي", "روحاني تأملي"];
const AUDIENCES = ["عامة المصلين", "الشباب", "الأسر", "طلبة العلم", "الأطفال"];
const CONTENT_TYPES = ["خطبة", "كلمة", "درس"] as const;

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const prefs = preferencesStore.use();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <SettingsIcon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-primary">الإعدادات</p>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            تفضيلات الحساب
          </h1>
        </div>
      </header>

      <Card className="border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">المظهر</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          اختر بين الوضع الفاتح والداكن.
        </p>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            variant={theme === "light" ? "default" : "outline"}
            onClick={() => setTheme("light")}
            className="gap-1.5"
          >
            <Sun className="h-4 w-4" /> فاتح
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "outline"}
            onClick={() => setTheme("dark")}
            className="gap-1.5"
          >
            <Moon className="h-4 w-4" /> داكن
          </Button>
        </div>
      </Card>

      <Card className="mt-4 border-border/60 bg-card p-5">
        <h2 className="font-display text-lg font-semibold text-foreground">
          التفضيلات الافتراضية للصياغة
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          تُستخدم تلقائيًا عند إنشاء خطبة جديدة، ويمكنك تغييرها لكل خطبة.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>نوع المحتوى</Label>
            <Select
              value={prefs.defaultContentType}
              onValueChange={(v) =>
                preferencesStore.update({ defaultContentType: v as typeof prefs.defaultContentType })
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CONTENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>المدة (دقيقة)</Label>
            <Input
              type="number"
              min={3}
              max={60}
              value={prefs.defaultDuration}
              onChange={(e) =>
                preferencesStore.update({
                  defaultDuration: Math.max(3, Math.min(60, Number(e.target.value) || 15)),
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>النبرة</Label>
            <Select
              value={prefs.defaultTone}
              onValueChange={(v) => preferencesStore.update({ defaultTone: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>الجمهور</Label>
            <Select
              value={prefs.defaultAudience}
              onValueChange={(v) => preferencesStore.update({ defaultAudience: v })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {AUDIENCES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => {
              preferencesStore.reset();
              toast.message("تمت استعادة التفضيلات الافتراضية");
            }}
          >
            <RotateCcw className="h-4 w-4" /> استعادة الافتراضي
          </Button>
        </div>
      </Card>
    </div>
  );
}
