import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, Key, UserCheck } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "سياسة الخصوصية وأمانة البيانات — منصة خطيب" },
      {
        name: "description",
        content: "تعرف على كيفية حمايتنا لخصوصية أفكارك ومسودات خطبك في منصة خطيب، ميثاق الأمانة والسرية لبيانات أئمة المساجد.",
      },
    ],
  }),
  component: () => (
    <StaticPage
      title="سياسة الخصوصية وأمانة البيانات"
      intro="نعتقد يقيناً في منصة خطيب أن الكلمة أمانة، وحفظ أفكارك ومسوداتك أمانة أعظم. نحن ملتزمون بحماية خصوصيتك وصيانة بياناتك وفق أرقى المعايير التقنية والأخلاقية."
    >
      {/* Quranic Quote Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center my-6">
        <p className="text-primary font-serif text-lg leading-relaxed">
          ﴿ إِنَّ اللَّهَ يَأْمُرُكُمْ أَن تُؤَدُّوا الْأَمَانَاتِ إِلَىٰ أَهْلِهَا ﴾
        </p>
        <p className="text-xs text-muted-foreground mt-2">سورة النساء · جزء من الآية ٥٨</p>
      </div>

      <div className="space-y-8 mt-8">
        {/* Core Principles */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <ShieldCheck className="h-5 w-5 text-primary" />
            مبادئنا الراسخة في حفظ البيانات
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-primary" />
                أمانة وسرية الأفكار
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                مسودات خطبك، أفكارك، وملاحظاتك الشخصية هي ملكية فكرية مطلقة وخاصة بك وحدك. لا يمكن لأي شخص آخر، أو جهة، الاطلاع عليها.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <h3 className="font-bold text-foreground flex items-center gap-2 text-sm">
                <EyeOff className="h-4 w-4 text-primary" />
                خصوصية منبرية مطلقة
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                نحن لا نقوم ببيع، تأجير، أو مشاركة بياناتك الشخصية أو مسوداتك مع أي جهات إعلانية أو تجارية بأي حال من الأحوال.
              </p>
            </div>
          </div>
        </section>

        {/* Data We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <Server className="h-5 w-5 text-primary" />
            الحد الأدنى من البيانات التي نجمعها
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            نحن نلتزم بمبدأ تقليل البيانات، حيث لا نجمع إلا البيانات الضرورية واللازمة لتقديم خدمات المنصة وحفظ تجربتك الفنية بأمان:
          </p>
          <ul className="space-y-3 pt-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong>معلومات الحساب:</strong> البريد الإلكتروني والاسم المستعار الذي تختاره، لتأمين دخولك ومزامنة مسوداتك.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong>مسودات الخطب والورشة:</strong> العناوين والمحاور والنصوص التي يتم توليدها أو تعديلها، وتُحفظ مشفرة في قاعدة بيانات آمنة لتتمكن من الوصول إليها وتعديلها وطباعتها في أي وقت.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong>التفضيلات والإعدادات:</strong> إعدادات الواجهة (داكن/فاتح)، وحجم الخط المفضل لديك أثناء القراءة، لتوفير تجربة بصرية مريحة لك.
              </div>
            </li>
          </ul>
        </section>

        {/* Sharia Verification Safety */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <Key className="h-5 w-5 text-primary" />
            أمان الفحص والتحقق الشرعي
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            عند استخدامك لميزات التحقق والبحث التلقائي في الأحاديث والتفاسير (عبر المواقع العلمية الشريكة مثل hdith.com أو tafsir.app):
          </p>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground/90">
            «يتم إرسال نصوص الاستعلامات والبحث للتحقق من درجات صحة الحديث بالرسم العثماني بخصوصية تامة، ولا يتم إرفاق أي بيانات شخصية تخص حسابك أو هويتك مطلقاً مع هذه الطلبات.»
          </div>
        </section>

        {/* User Rights */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <UserCheck className="h-5 w-5 text-primary" />
            حقوقك الكاملة على بياناتك
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            بصفتك صاحب الحساب وصاحب الرسالة، يمنحك نظام منصة خطيب تحكماً كاملاً وحقوقاً أصيلة على بياناتك تشمل:
          </p>
          <div className="grid gap-3 sm:grid-cols-3 text-center mt-3">
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <span className="font-bold text-xs text-foreground block">التعديل والتصدير</span>
              <span className="text-[10px] text-muted-foreground block mt-1">تعديل أي محتوى وتصديره بصيغة Word أو نسخ فوري.</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <span className="font-bold text-xs text-foreground block">الحفظ والأرشفة</span>
              <span className="text-[10px] text-muted-foreground block mt-1">أرشفة وحفظ مسوداتك في خزانة آمنة خاصة بك.</span>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card/60">
              <span className="font-bold text-xs text-foreground block">الحذف النهائي</span>
              <span className="text-[10px] text-muted-foreground block mt-1">إمكانية حذف أي خطبة أو حذف حسابك بأكمله نهائياً وفوراً.</span>
            </div>
          </div>
        </section>

        {/* Contact and Updates */}
        <section className="space-y-4 pt-4 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            تخضع هذه السياسة للتحديثات الدورية لمواكبة التطورات التقنية والضوابط الشرعية. تم التحديث في: مايو ٢٠٢٦ م.
          </p>
          <p className="text-sm font-semibold text-primary">
            لأي استفسار يخص أمانة بياناتك، نسعد بتواصلك معنا عبر صفحة الدعم والاتصال.
          </p>
        </section>
      </div>
    </StaticPage>
  ),
});
