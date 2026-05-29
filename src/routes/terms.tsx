import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";

export const Route = createFileRoute("/terms")({
  component: () => (
    <StaticPage
      title="الشروط والأحكام"
      intro="باستخدامك منصة منصة خطيب فأنت توافق على الشروط التالية."
    >
      <h2 className="text-xl font-semibold">طبيعة الخدمة</h2>
      <p>منصة خطيب منصة بحث وصياغة للخطب والكلمات الدعوية. المواد الأصلية تبقى منسوبة لمصادرها.</p>
      <h2 className="text-xl font-semibold">المسؤولية</h2>
      <p>المستخدم مسؤول عن المحتوى الذي يصيغه ويستخدمه، ومنصة خطيب أداة مساعدة.</p>
      <h2 className="text-xl font-semibold">التعديلات</h2>
      <p>قد نُحدّث هذه الشروط من وقت لآخر، وسنُعلمك بأي تغييرات جوهرية.</p>
    </StaticPage>
  ),
});
