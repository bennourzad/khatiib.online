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

        {/* Data Storage & Privacy */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <Server className="h-5 w-5 text-primary" />
            تخزين وحفظ مسودات خطبك
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            تتميز منصة خطيب بأنها **لا تتطلب تسجيل حساب** ولا تجمع أي معلومات شخصية أو بريد إلكتروني، مما يمنحك خصوصية وسرية مطلقة. إليك كيفية حفظ وتخزين بياناتك بأمان:
          </p>
          <ul className="space-y-3 pt-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong>تخزين محلي آمن (Local Browser Storage):</strong> يتم حفظ جميع مسوداتك وخطبك وإعداداتك بشكل محلي تماماً داخل ذاكرة متصفح الويب الخاص بجهازك، ولا يتم رفعها أو تخزينها في أي خوادم خارجية تابعة لنا.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong>تنزيل وحفظ ملفاتك (توصية هامة):</strong> نظراً لأن البيانات تُحفظ محلياً في متصفحك، فإنها قد تُحذف في حال قمت بمسح سجل التصفح (Cache/History) أو تغيير المتصفح أو الجهاز. **لذلك ننصحك بشدة وبشكل مستمر بتحميل مسوداتك كملفات وورد (Word) أو نسخها وحفظها في جهازك الخاص لكي لا تفقدها بأي شكل.**
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <strong>التفضيلات الشخصية:</strong> يتم تخزين خياراتك البصرية المفضلة (مثل تفعيل السمات داكن/فاتح وحجم الخط) محلياً أيضاً لتمنحك تجربة قراءة مخصصة ومريحة في كل مرة تفتح فيها المنصة.
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
            بصفتك صاحب الكلمة والرسالة، تمنحك منصة خطيب تحكماً كاملاً وحقوقاً أصيلة على بياناتك تشمل:
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
              <span className="font-bold text-xs text-foreground block">الإزالة ومسح الذاكرة</span>
              <span className="text-[10px] text-muted-foreground block mt-1">إمكانية حذف أي خطبة فردية فوراً أو مسح ذاكرة التخزين المحلية بالكامل.</span>
            </div>
          </div>
        </section>

        {/* Contact and Updates */}
        <section className="space-y-4 pt-4 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            تخضع هذه السياسة للتحديثات الدورية لمواكبة التطورات التقنية والضوابط الشرعية. تم التحديث في: مايو 2026 م.
          </p>
          <p className="text-sm font-semibold text-primary">
            لأي استفسار يخص أمانة بياناتك، نسعد بتواصلك معنا عبر صفحة الدعم والاتصال.
          </p>
        </section>
      </div>
    </StaticPage>
  ),
});
