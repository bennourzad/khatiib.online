import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      title="تسجيل الدخول"
      subtitle="أهلًا بعودتك إلى منصة خطيب"
      footer={
        <>
          ليس لديك حساب؟{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            أنشئ حسابًا
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" placeholder="name@example.com" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              نسيت كلمة المرور؟
            </Link>
          </div>
          <Input id="password" type="password" dir="ltr" />
        </div>
        <Button type="submit" className="w-full">
          دخول
        </Button>
      </form>
    </AuthLayout>
  );
}
