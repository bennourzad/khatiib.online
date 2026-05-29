import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="إعادة تعيين كلمة المرور"
      subtitle="أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة"
      footer={
        <>
          تذكّرت كلمة المرور؟{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" placeholder="name@example.com" />
        </div>
        <Button type="submit" className="w-full">
          إرسال رابط الاستعادة
        </Button>
      </form>
    </AuthLayout>
  );
}
