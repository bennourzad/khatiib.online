import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";
import { FileText, ShieldAlert, Award, FileSignature, CheckCircle2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "الشروط والأحكام وميثاق المنبر — منصة خطيب" },
      {
        name: "description",
        content: "تعرف على شروط استخدام منصة خطيب، ميثاق الأمانة العلمية والمسؤولية الفقهية لخطباء وأئمة مساجد منبر رسول الله ﷺ.",
      },
    ],
  }),
  component: () => (
    <StaticPage
      title="الشروط والأحكام وميثاق المنبر"
      intro="باستخدامك لمنصة خطيب، فإنك تدخل في عهد تعاون علمي وأمانة منبرية لخدمة الدعوة الإسلامية الرشيدة. يرجى قراءة ميثاق الاستخدام والمسؤوليات الفقهية بعناية."
    >
      {/* Quranic Quote Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center my-6">
        <p className="text-primary font-serif text-lg leading-relaxed">
          ﴿ وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ ۖ وَلَا تَعَاوَنُوا عَلَى الْإِثْمِ وَالْعُدْوَانِ ﴾
        </p>
        <p className="text-xs text-muted-foreground mt-2">سورة المائدة · جزء من الآية ٢</p>
      </div>

      <div className="space-y-8 mt-8">
        {/* Core Covenant */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <Award className="h-5 w-5 text-primary" />
            الميثاق الفلسفي والشرعي
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            المنبر أمانة عظيمة، ورسالة مقدسة لا تقبل التهاون. نود التأكيد على المبادئ التالية التي تحكم طبيعة عمل منصتنا:
          </p>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground/90 space-y-2">
            <p>
              <strong>«المنصة أداة مساعدة وليست بديلاً للخطيب صاحبة البصيرة»:</strong>
              إن منصة خطيب صُممت لتكون ورشة عمل ذكية لتكسر جمود الصفحة البيضاء وتختصر وقت البحث الشاق، وتوثق الأدلة.
            </p>
            <p>
              لا يمكن إطلاقًا لأي نظام ذكاء اصطناعي أن يحل محل روح ووجدان الإمام وعلمه الشرعي وفهمه لواقع جماعته ومصلّيه الفعليين.
            </p>
          </div>
        </section>

        {/* Scientific and Fiqh Responsibility */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <ShieldAlert className="h-5 w-5 text-primary" />
            المسؤولية الشرعية والفقهية
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            يتحمل الإمام والخطيب المستخدم للمنصة المسؤولية الكاملة والشرعية والأخلاقية عما يُلقيه من فوق المنبر:
          </p>
          <ul className="space-y-3 pt-2 text-sm leading-relaxed">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
              <div>
                <strong>التحقق العلمي الدقيق:</strong> يلتزم المستخدم بمراجعة كافة الآيات القرآنية والتأكد من رسمها ومواضعها، وفحص درجة صحة الأحاديث المخرّجة عبر الأدوات المتاحة (hdith.com)، واستبعاد أي أحاديث ضعيفة أو منكرة.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
              <div>
                <strong>تطبيع المحتوى للواقع:</strong> المستخدم ملزم بتطويع الهياكل المقترحة لواقع مصلّيه، وحل المشكلات الفقهية والاجتماعية بما يراه متناسبًا مع المصلحة الشرعية المعتمدة.
              </div>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
              <div>
                <strong>إضافة اللمسة الإنسانية:</strong> لا يجوز إلقاء الخطبة المولدة بالكامل بشكل بصري أو آلي دون مراجعة وتهذيب ووضع الخطيب لروحه وعلمه وحنجرته في كلماتها.
              </div>
            </li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <FileSignature className="h-5 w-5 text-primary" />
            الملكية الفكرية ورسالة المنبر
          </h2>
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <p className="text-xs leading-relaxed text-muted-foreground">
              أي مسودة أو نص خطبة تقوم بصياغته وتعديله باستخدام منصة **خطيب** هو **ملك فكري مطلق وخاص بك وحدك**. 
              لا تدعي المنصة أي حقوق ملكية أو نشر أو توزيع على خطبك ومؤلفاتك المنبرية، ولديك الحرية الكاملة في إلقائها، نشرها كتابيًا، أو طباعتها وتوزيعها دعويًا.
            </p>
          </div>
        </section>

        {/* Prohibited Misuse */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <BookOpen className="h-5 w-5 text-primary" />
            محظورات الاستخدام الصارمة
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            تأكيدًا على أمانة المنبر وحرمته، يُحظر تمامًا استخدام المنصة في الأغراض التالية:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside pr-4">
            <li>صياغة خطب تدعو للفرقة، الفتنة الطائفية، أو الكراهية بين المسلمين.</li>
            <li>استخدام أدوات الصياغة لتوليد ونشر فتاوى شاذة أو غير معتمدة علميًا.</li>
            <li>محاولة اختراق أو إساءة استخدام البنية التحتية للمنصة أو تعطيل خدماتها.</li>
          </ul>
        </section>

        {/* Dynamic Revisions */}
        <section className="space-y-4 pt-4 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            تخضع هذه الشروط للمراجعة والتطوير المستمر لضمان توافقها مع الضوابط الشرعية المعتمدة. تم التحديث في: مايو ٢٠٢٦ م.
          </p>
          <p className="text-sm font-semibold text-primary">
            نسأل الله عز وجل أن يتقبل منا ومنكم صالح الأعمال، وأن يجعل كلماتنا شاهدة لنا لا علينا.
          </p>
        </section>
      </div>
    </StaticPage>
  ),
});
