import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  component: () => (
    <StaticPage
      title="تواصل معنا"
      intro="نسعد بسماع ملاحظاتك واقتراحاتك. نقرأ كل رسالة."
    >
      <form className="grid gap-4 not-prose" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" dir="ltr" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="msg">الرسالة</Label>
          <Textarea id="msg" rows={6} />
        </div>
        <Button type="submit" className="w-fit">إرسال</Button>
      </form>
    </StaticPage>
  ),
});
