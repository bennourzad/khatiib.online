import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthLayout
      title="إنشاء حساب جديد"
      subtitle="ابدأ رحلتك مع منصة خطيب خلال دقيقة"
      footer={
        <>
          لديك حساب؟{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            سجّل الدخول
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" placeholder="اسمك الكامل" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" placeholder="name@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input id="password" type="password" dir="ltr" />
        </div>
        <Button type="submit" className="w-full">
          إنشاء الحساب
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          بإنشائك حسابًا فأنت توافق على{" "}
          <Link to="/terms" className="underline">الشروط</Link> و{" "}
          <Link to="/privacy" className="underline">الخصوصية</Link>.
        </p>
      </form>
    </AuthLayout>
  );
}
