import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/marketing/StaticPage";
import { FileText, ShieldAlert, Award, FileSignature, CheckCircle2, BookOpen, Globe } from "lucide-react";

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
              <strong>«المنصة أداة مساعدة وليست بديلاً للخطيب صاحب البصيرة»:</strong>
              إن منصة خطيب صُممت لتكون ورشة عمل ذكية لتكسر جمود الصفحة البيضاء وتختصر وقت البحث الشاق، وتوثق الأدلة.
            </p>
            <p>
              لا يمكن إطلاقًا لأي نظام ذكاء اصطناعي أن يحل محل روح ووجدان الإمام الخطبي وعلمه الشرعي وفهمه لواقع جماعته ومصلّيه الفعليين.
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

        {/* Reliable Sources and Operation Mechanism */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <Globe className="h-5 w-5 text-primary" />
            آلية جلب المصادر وحرمة البيانات (أمان فني وشرعي)
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            تلتزم منصة <strong>خطيب</strong> بأعلى معايير الأمان الفني والنزاهة الشرعية في جلب النصوص والأدلة الفقهية وتخريج الأحاديث:
          </p>
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4">
            <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-xl opacity-70" />

            <div className="flex gap-4 items-start relative z-10">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                ✓
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  تصفح سريع وآمن للمصادر العامة
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  تقوم المنصة بتصفح المواقع والموسوعات الفقهية والحديثية العامة المفتوحة للجميع على الإنترنت (مثل الدرر السنية وموسوعات التفاسير المعتمدة) بشكل سريع جداً وتلقائي، لقراءة الآيات والأحاديث النبوية الشريفة والتحقق من صحتها وتخريجها.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start relative z-10">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                🔒
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  احترام الملكية وحظر الاختراق الفني
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong>نؤكد بشكل قاطع أنه لا يتم اختراق أو انتهاك أي من هذه المصادر أو قواعد البيانات بأي شكل من الأشكال.</strong> عمليتنا قانونية وفنية 100% وتعتمد على البروتوكولات المسموح بها للتصفح العام وقراءة المحتوى المفتوح، وذلك احتراماً للأمانة الرقمية وحقوق الجهات المالكة لتلك المواقع.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start relative z-10">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                ✍️
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">
                  صياغة احترافية وموثوقة للمسودات
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  بعد القراءة الفورية والسريعة للأدلة، تقوم الأداة بتجميع النصوص وصياغة هيكل مسودة الخطبة بشكل احترافي رصين يليق بجلال المنبر وعظمة الرسالة، مما يضمن خلو المسودات من الركاكة اللغوية وتدعيمها بأدلة شرعية موثوقة وثابتة.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Sources List */}
          <div className="mt-4 bg-card border border-border/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 pb-2 border-b border-border/40">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              المصادر العلمية الموثوقة التي تتصفحها المنصة:
            </h3>

            <div className="space-y-4 divide-y divide-border/30">
              <div className="pt-0 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">الموسوعة الحديثية - الدرر السنية</span>
                  <a
                    href="https://dorar.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-[10px]"
                  >
                    dorar.net ↗
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>عملها:</strong> تصفح سريع للتحقق الدقيق من درجة صحة الأحاديث الشريفة، ومعرفة أحكام كبار المحدثين عليها لضمان نقاوة الخطبة من الأحاديث الموضوعة.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">الباحث الحديثي - تطبيق حديث</span>
                  <a
                    href="https://hdith.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-[10px]"
                  >
                    hdith.com ↗
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>عملها:</strong> البحث الفوري وتخريج الأحاديث النبوية الشريفة من بطون أمهات الكتب الفقهية والحديثية بشكل لحظي مأمون.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">الباحث القرآني ومصحف المدينة</span>
                  <a
                    href="https://surah.my"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-[10px]"
                  >
                    surah.my ↗
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>عملها:</strong> جلب الآيات الكريمة برسمها العثماني المعتمد من المصحف الشريف وضبط تفسيرها وسياقها الفقهي السليم.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">موسوعة الفقه الإسلامي ومواقع الفتاوى الرسمية</span>
                  <a
                    href="https://islamweb.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-[10px]"
                  >
                    islamweb.net ↗
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>عملها:</strong> تصفح المسائل والتقسيمات الفقهية والتأصيلية المعتمدة لدى المذاهب الأربعة لضمان سلامة الأحكام الفقهية الواردة في المسودة.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">موقع إسلام سؤال وجواب</span>
                  <a
                    href="https://islamqa.info"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-[10px]"
                  >
                    islamqa.info ↗
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>عملها:</strong> تصفح الفتاوى الشرعية المحررة والمسائل التأصيلية للتحقق الفوري من سلامة الأقوال الفقهية المعتبرة.
                </p>
              </div>

              <div className="pt-3 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-primary">موقع إمام المسجد</span>
                  <a
                    href="https://alimam.ws/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-mono text-[10px]"
                  >
                    alimam.ws ↗
                  </a>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>عملها:</strong> الاسترشاد بالحقائب الدعوية المعتمدة والخطب النموذجية والموضوعات المعاصرة لتغذية محتوى الوعظ والإرشاد.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground flex items-center gap-2.5 pb-2 border-b border-border/60">
            <FileSignature className="h-5 w-5 text-primary" />
            الملكية الفكرية ورسالة المنبر
          </h2>
          <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
            <p className="text-xs leading-relaxed text-muted-foreground">
              أي مسودة أو نص خطبة تقوم بصياغته وتعديله باستخدام منصة <strong>خطيب</strong>  هو <strong>ملك فكري مطلق وخاص بك وحدك</strong> .
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
            <li>إعداد محتوى يدعو إلى الغلو، التكفير، أو مساندة الأفكار والتيارات المتطرفة.</li>
            <li>انتحال الصفات العلمية أو الدعوية لتوجيه الرأي العام دون أهلية شرعية.</li>
            <li>سرقة الجهود العلمية، تزوير النقولات، أو نسبة الخطب والمؤلفات لغير أصحابها.</li>
            <li>نشر وتداول الأحاديث المكذوبة (الموضوعة) أو القصص الخرافية التي تشوه العقيدة.</li>
            <li>استغلال المنصة للترويج التجاري، الدعاية الشخصية، أو التشهير بالأفراد والمؤسسات.</li>
            <li>الهندسة العكسية لبرمجيات المنصة، أو نسخ خوارزمياتها، أو إعادة بيع خدماتها بدون إذن.</li>
          </ul>
        </section>

        {/* Dynamic Revisions */}
        <section className="space-y-4 pt-4 border-t border-border/60 text-center">
          <p className="text-xs text-muted-foreground">
            تخضع هذه الشروط للمراجعة والتطوير المستمر لضمان توافقها مع الضوابط الشرعية المعتمدة. تم التحديث في: مايو 2026 م.
          </p>
          <p className="text-sm font-semibold text-primary">
            نسأل الله عز وجل أن يتقبل منا ومنكم صالح الأعمال، وأن يجعل كلماتنا شاهدة لنا لا علينا.
          </p>
        </section>
      </div>
    </StaticPage>
  ),
});
