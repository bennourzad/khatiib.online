import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";

export const Route = createFileRoute("/privacy")({
  component: () => (
    <StaticPage
      title="سياسة الخصوصية"
      intro="نحرص في منصة خطيب على حماية خصوصيتك واحترام بياناتك. هذه السياسة تشرح ما نجمعه وكيف نستخدمه."
    >
      <h2 className="text-xl font-semibold">البيانات التي نجمعها</h2>
      <p>نجمع الحد الأدنى من البيانات اللازمة لتشغيل الخدمة: بريدك الإلكتروني، تفضيلاتك، ومحادثاتك المحفوظة.</p>
      <h2 className="text-xl font-semibold">استخدام البيانات</h2>
      <p>نستخدم بياناتك لتقديم تجربة بحث وصياغة أفضل، ولا نبيعها لأي طرف ثالث.</p>
      <h2 className="text-xl font-semibold">التواصل معنا</h2>
      <p>لأي استفسار يخص الخصوصية، يمكنك مراسلتنا عبر صفحة التواصل.</p>
    </StaticPage>
  ),
});
