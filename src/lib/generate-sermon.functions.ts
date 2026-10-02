import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const PRIMARY_MODEL = "google/gemini-3-flash-preview";
const FALLBACK_MODEL = "google/gemini-2.5-flash";

const BriefSchema = z.object({
  topic: z.string().min(2).max(200),
  contentType: z.enum(["خطبة", "كلمة", "درس"]),
  audience: z.string().min(1).max(80),
  duration: z.number().int().min(2).max(60),
  tone: z.string().min(1).max(80),
  axes: z.array(z.string().min(1).max(120)).min(1).max(6),
});

type BriefInput = z.infer<typeof BriefSchema>;
type SectionKind = "intro" | "axis" | "closing" | "prayer";

interface SectionPlan {
  heading: string;
  kind: SectionKind;
  wordTarget: number;
}

interface GatewayResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

export interface GeneratedSection {
  heading: string;
  body: string;
}

export interface GeneratedSermon {
  title: string;
  sections: GeneratedSection[];
}

const SECTION_SYSTEM_PROMPT = `أنت خطيبٌ مسلمٌ مُفوَّه، تقف الآن على المنبر أمام جماعتك، تنظر في عيونهم صفاً صفاً: ترى الشيخ الكبير الذي أثقلته السنون في الصف الأول، وترى الشاب المُنهَك من عناء أسبوعه الطويل، وترى الأب الواجم الذي يحمل همّ قوت أولاده، وترى التائب المقترب، والغافل الذي لعلّ هذه الخطبة هي آخر موعظة تطرق سمعه في الدنيا. اكتب وأنت تموج بمشاعر الشفقة والحرص والمسؤولية، فأنت لا تُؤلّف مقالاً فكرياً بارداً، بل تصوغ رسالةً تهتز لها القلوب وتدمع لها العيون، وتنقذ بها نفساً حائرة.

قواعد اللغة والسبك (الالتزام التام باللسان العربي العتيق والبيان الأصيل):
- **المرجعية الأسلوبية**: الالتزام التام بالعربية العتيقة والفصحى الجزلة الموروثة على خطى أئمة البيان (كالجاحظ، وابن المقفع، والحريري، ومدرسة الرافعي ومحمود شاكر).
- **تطهير اللسان والتوقي من الحشو المعاصر**: اجتناب الحشو المعاصر والأفعال المساعدة (مثل: "بالنسبة لـ"، "تم فعل كذا"، "قام بـ") واستبدالها بالتراكيب المباشرة ("أما كذا فـ.."، "فُعِل"، "فَعَل").
- **إحياء التراث والإحكام الصرفي**: إيثار التراكيب العتيقة (نحو: "حِيال"، "بَيْدَ أن"، "لَمَّا"، "قَدْ")، وتفضيل المصادر الأصيلة على الصناعية (نحو: "رصانة" لا "موضوعية"، "كفاءة" لا "فعالية") وإحياء الغريب الفصيح.
- **أصالة التعبير والسبك التراثي**: التوقي التام من مجاراة القوالب التعبيرية المترجمة (نحو: "لعب دوراً"، "يسلط الضوء"، "نقطة تحول")، واجتناب الألفاظ الشائعة المبتذلة، وإيثار الكلمات التراثية الجزلة بعيداً عن الأساليب الصحفية والترجمات الهجينة.
- **التركيب البلاغي واقتضاب البنية**: تطبيق قواعد التقديم والتأخير (نحو: "الشفرةَ أصلحتُ")، وتجنب جموع المؤنث السالم الصناعية (نحو: "توجيهات"، "تحديثات") وإيثار جموع التكسير الفصيحة والمصادر الأصيلة، وحذف روابط الجمل وحروف الجر الزائدة التي يصح الاستغناء عنها حرصاً على جلالة المعنى ومقام الإيجاز.
- **مرجعية المعاجم**: اعتماد أمهات المعاجم العربية (نحو: لسان العرب، ومقاييس اللغة، والقاموس المحيط) حكماً وحيداً لضبط غريب الألفاظ وصحة الصرف.

روح الخطاب وعاطفته:
- تكلّم بلسان الناصح الشفيق، والمحب الرفيق، لا الواعظ الجاف المتسلط. أنت واحدٌ من السامعين، تخاف على نفسك قبل أن تخاف عليهم، وتداوي قلبك قبل أن تداوي قلوبهم.
- اجعل روح الخطاب جماعية ("نحن"، "أنفسنا"، "قلوبنا") بدلاً من الفوقية ("أنتم"، "عليكم"). أَقِرّ بضعفك وتقصيرك بصدق عذب (مثال: "والله ما وقفت هنا لأعلمكم، بل لأعظ نفساً بين جنبيّ هي أحوجكم للموعظة"، "إخواني.. ما أحوج قلوبنا المتعبة إلى..").
- نوّع النداءات العاطفية بصدق وبدون تكلّف: (يا إخوتاه، أحبتي في الله، يا عباد الله، يا أهل الإيمان، يا من عمّرتم هذا البيت في هذا اليوم المبارك..). تجنب تكرار نداء واحد في كل فقرة.

الأسلوب البلاغي والمنبري (لغة حية نابضة):
- **الإيقاع اللفظي المنبري**: اعتمد على الجمل القصيرة المتلاحقة المسبوكة بلسان جزيل التي تقرع القلوب، وتتلوها تساؤلات بلاغية حية (مثال: "مضت السنون.. وانطوت الأعمار.. فماذا أعددنا؟").
- **الوقفات العاطفية والاستدراكات الطبيعية**: ادخل في النص كلمات تشعرك بالارتجال والتأمل الحي (مثال: "قِفوا معي لحظة.."، "تأملوا هذا جيداً.."، "والله يا إخواني.."، "لعلي أرى في عيون بعضكم تساؤلاً..").
- **التصوير والتشبيه الملموس**: ابتعد عن التعريفات النظرية الجافة. ارسم صوراً ذهنية تعبر عن المعنى (بدل "الصبر مهم في المصائب" اكتب "الصبر كالغيث البارد يسكب السكينة على القلوب الملتهبة").
- **النزول إلى الواقع الملموس**: اضرب أمثلة من تفاصيل حياتهم المعاصرة اليومية بسبك تراثي فصيح: قلق الآباء على مستقبل الأبناء، ضجيج الهواتف وشاشاتها التي سرقت خشوع البيوت، ضغوط كسب العيش الحلال، الخلافات الأسرية التي تفسد الود.

ضوابط المادة العلمية (صارمة جداً في الأحاديث):
- لا تستشهد إلا بالقرآن الكريم والأحاديث **الصحيحة أو الحسنة** فقط، مما هو في الصحيحين (البخاري ومسلم) أو ما صححه أو حسّنه أئمة الشأن المعتبرون كالألباني وشعيب الأرناؤوط وابن باز وابن عثيمين واللجنة الدائمة.
- يَحرُم إيرادُ أي حديث **ضعيف أو منكر أو موضوع أو مُختلَف في تضعيفه**، ولو كان مشهوراً متداولاً على ألسنة الناس وفي كتب الرقائق. الشهرة ليست دليلاً على الصحة.
- **قاعدة قطعية لا استثناء فيها**: لا تُورد أي حديث في الخطبة إلا بعد التأكد من صحته أو حُسنه في موقع **https://hdith.com/** (الباحث الحديثي - Hadith MCP) و **https://tafsir.app/** (تفسير القرآن - Tarteel MCP) و **https://dorar.net/** (الموسوعة التراثية - Bahouth MCP). إن لم يكن الحديث موجوداً فيها بدرجة صحيح أو حسن، فلا تُورده مطلقاً.
- إذا شككت في درجة الحديث ولو شكاً يسيراً، فاتركه كلياً، واستعض عنه بآية قرآنية محكمة أو بأثر صحيح عن صحابي، أو بصياغة المعنى دون نسبته اللفظية للنبي ﷺ.
- إذا أوردت حديثاً، فأَتْبِعْه بعزو مختصر يبيّن درجته (مثل: رواه البخاري، رواه مسلم، متفق عليه، رواه أبو داود وصححه الألباني، رواه الترمذي وحسّنه).

قواعد صارمة للاقتباس والتنسيق:
- ضع كل آية قرآنية حصراً بين القوسين المزهّرين ﴿ ﴾، ولا تستخدم هذين القوسين لأي شيء آخر.
- ضع كل حديث نبوي حصراً بين علامتي التنصيص العربية «…»، ويجوز إتباعه بعزو مختصر خارج العلامتين.
- لا تستخدم "..." ولا '...' للآيات أو الأحاديث.
- لا تكتب Markdown، ولا عناوين فرعية، ولا تعداداً نقطياً أو رقمياً، ولا جداول إطلاقاً.

ممنوعات لغوية وتعبيرية وشرعية قاطعة (لتجنب الركاكة والنمطية الآلية والمجازات الخاطئة):
- **يُمنع منعاً باتاً التشبيه بالمفاهيم الدخيلة أو الألفاظ المنافية للشريعة والعقيدة**:
  • يُحظر تماماً استخدام كلمة (سحر / ساحر / سحرية) أو تشبيه العبادات والقرآن والإيمان والصلاة بالسحر.
  • يُحظر تماماً إيراد التشبيهات والمفاهيم الثقافية غير الإسلامية.
  • التزم بالهيئة والصورة المكانية والشرعية الصحيحة للمسجد: (صفوف المصلين المنتظمة، القيام، السجود، المنبر، المحراب، خفوق القلوب، السكينة، الوقار، الطمأنينة).
- **يُمنع تماماً استخدام التراكيب النمطية الآلية (AI Clichés)**:
  • (إنها ليست مجرد X... بل هي Y...) أو (هذه البيوت ليست حجارة مرصوصة... بل هي...).
  • التراكيب الأكاديمية والإنشائية الآلية: (في هذا العصر / في عالمنا اليوم / في عصرنا الحالي / في وقتنا الراهن / في مجتمعاتنا اليوم / بالنسبة لـ / قام بـ / تم التحديث).
  • التراكيب الركيكة المترجمة: (بالإضافة إلى ذلك / علاوة على ذلك / من هذا المنطلق / بناءً على ذلك / من الجدير بالذكر / تجدر الإشارة إلى / مما لا شك فيه / لعب دوراً / يسلط الضوء / نقطة تحول).
  • عبارات الختام الآلية: (في الختام / خلاصة القول / باختصار / نستخلص مما سبق / ختاماً لهذا الموضوع / وفي نهاية المطاف).
- لا تبدأ بمقدمة آلية مكررة أو تفسيرية بل ادخل فوراً في صلب الموضوع بأسلوب منبري أصيل يجمع فصاحة اللفظ وعمق المعنى.`;

const TITLE_SYSTEM_PROMPT = `أنت محرر عناوين بارع للخطب والدروس الإسلامية بأسلوب عربي تراثي جزل. مهمتك صياغة عنوان واحد فقط يُشعل الفضول ويلمس الجرح قبل أن يُفسر المحتوى.

العنوان القوي للخطبة:
- يُشعر السامع أن هذه الخطبة كُتبت له هو تحديداً
- يلمس جرحاً حقيقياً في القلب أو يُثير تساؤلاً حارقاً
- يكون من 4 إلى 7 كلمات فقط بعبارات جزلة أصيلة
- لا يكشف كل المحتوى — يُومئ ولا يُصرّح

أقوى أنواع عناوين الخطب (اختر الأنسب للموضوع):
① السؤال المؤلم: يا من تحمل هماً لا يعلمه أحد
② التناقض الصادم: المؤمن الخائف من رحمة الله
③ الوصف المدهش: قلوب تبكي خلف أعين جافة
④ الخطاب المباشر: كلمة إلى من يصلي بلا قلب
⑤ الوعد الإيماني: بعد هذه الجمعة ستتغير

أعطني عنواناً واحداً فقط، بلا علامات تنصيص وبلا شرح.`;

function stripCodeFences(value: string) {
  return value.trim().replace(/^```(?:json|markdown|md|text)?\s*/i, "").replace(/\s*```$/i, "");
}

/** Humanizer post-processor for classical Arabic purity */
function humanizeClassicalText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\bبالنسبة لـ\b/g, "أما حِيال ")
    .replace(/\bبالنسبة إلى\b/g, "أما عن ")
    .replace(/\bقام بـ([^.\n]+)/g, "$1")
    .replace(/\bتم ([أإا-ي]+)ه\b/g, "$1")
    .replace(/\bلعب دوراً\b/g, "كان له أثرٌ")
    .replace(/\bيسلط الضوء على\b/g, "يجلو المعنى في")
    .replace(/\bنقطة تحول\b/g, "معلَم ومُنقلَب")
    .replace(/\bفي هذا العصر\b/g, "في أيامنا هذه")
    .replace(/\bفي عصرنا الحالي\b/g, "في غمرة عصرنا")
    .replace(/\bفي وقتنا الراهن\b/g, "في زمننا هذا")
    .replace(/\bعلاوة على ذلك\b/g, "زد على ذلك")
    .replace(/\bبالإضافة إلى ذلك\b/g, "بَيْدَ أن")
    .replace(/\bمن الجدير بالذكر\b/g, "وحقيقٌ بالذكر")
    .replace(/\bتجدر الإشارة إلى\b/g, "ومما يسترعي البيان")
    .replace(/\bمما لا شك فيه\b/g, "ولا ريب في أن")
    .replace(/\bفي الختام\b/g, "وغايّة القول")
    .replace(/\bخلاصة القول\b/g, "وحسبُنا")
    .replace(/\bتحديثات\b/g, "مُستجدّات")
    .replace(/\bتوجيهات\b/g, "إرشادات")
    .replace(/\bفعالية\b/g, "كفاءة ونَفْع")
    .replace(/\bموضوعية\b/g, "رصانة وإحكام");
}

function cleanModelText(value: string) {
  const stripped = stripCodeFences(value)
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/[“”"]/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return humanizeClassicalText(stripped);
}

function getTextFromGateway(json: GatewayResponse) {
  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) {
    console.error("AI empty response", JSON.stringify(json).slice(0, 1000));
    throw new Error("لم يُرجع النموذج نصاً صالحاً");
  }
  return cleanModelText(text);
}

async function callGatewayText({
  apiKey,
  gatewayUrl,
  models,
  systemPrompt,
  userPrompt,
  temperature = 0.7,
}: {
  apiKey: string;
  gatewayUrl: string;
  models: string[];
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}) {
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const res = await fetch(gatewayUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          temperature,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      });

      if (res.status === 429) throw new Error("تجاوزت حد الاستخدام، حاول بعد قليل");
      if (res.status === 402) throw new Error("نفد رصيد خدمة الذكاء الاصطناعي، يرجى التحقق من الرصيد في الإعدادات");

      if (!res.ok) {
        const txt = await res.text();
        console.error("AI gateway error", model, res.status, txt.slice(0, 1000));

        if (res.status >= 500 && model !== models[models.length - 1]) {
          continue;
        }

        if (res.status === 504) {
          throw new Error("استغرق توليد النص وقتاً أطول من المتوقع، حاول مجدداً");
        }

        throw new Error(`فشل الاتصال بمولّد الخطب (${res.status})`);
      }

      const json = (await res.json()) as GatewayResponse;
      return getTextFromGateway(json);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("تعذّر الاتصال بخدمة التوليد");
      if (model === models[models.length - 1] || lastError.message.includes("حد الاستخدام") || lastError.message.includes("أرصدة")) {
        break;
      }
    }
  }

  throw lastError ?? new Error("تعذّر توليد النص الآن");
}

async function callNativeGeminiWithRetry(
  params: {
    apiKey: string;
    model: string;
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
  },
  retries = 3,
  delayMs = 2000
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await callNativeGemini(params);
    } catch (err: any) {
      // QUOTA_EXCEEDED means the model's billing/daily limit is exhausted — no point retrying same model
      if (err.message === "QUOTA_EXCEEDED") throw err;

      const isRateLimit = err.status === 429 || err.message.includes("تجاوزت حد الاستخدام");
      const isTransient = err.status >= 500 || err.message.includes("fetch failed");

      if ((isRateLimit || isTransient) && attempt < retries) {
        // If it's a 429 rate limit, wait longer to let the window reset
        const waitTime = isRateLimit
          ? (attempt === 1 ? 8000 : 15000)
          : (attempt * delayMs); // 2s, 4s for transient errors
        console.warn(`[Gemini API Error] Model: ${params.model}, attempt ${attempt} failed with status ${err.status || 'unknown'}. Retrying in ${waitTime}ms...`);
        await new Promise((res) => setTimeout(res, waitTime));
        continue;
      }
      throw err;
    }
  }
  throw new Error("تعذّر توليد النص");
}

async function callNativeGemini({
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  temperature = 0.7,
}: {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
}) {
  console.log(`[API Call] Invoking model ${model} using API Key signature: ${apiKey.slice(0, 8)}...${apiKey.slice(-5)}`);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature,
      }
    })
  });

  if (response.status === 429 || response.status === 402) {
    const errorBody = await response.json().catch(() => ({})) as any;
    const msg = (errorBody?.error?.message ?? "").toLowerCase();
    const isQuota =
      errorBody?.error?.status === "RESOURCE_EXHAUSTED" ||
      msg.includes("quota") ||
      msg.includes("billing") ||
      response.status === 402;
    console.error(`[Gemini Quota/Rate Error] Model: ${model}, status: ${response.status}`, JSON.stringify(errorBody).slice(0, 500));
    if (isQuota) {
      const err = new Error("QUOTA_EXCEEDED") as any;
      err.status = response.status;
      throw err;
    }
    const err = new Error("تجاوزت حد الاستخدام لـ Gemini، يرجى المحاولة بعد دقيقة") as any;
    err.status = response.status;
    throw err;
  }

  if (!response.ok) {
    const txt = await response.text();
    console.error("Gemini Native API Error", model, response.status, txt.slice(0, 1000));
    const err = new Error(`فشل الاتصال بمولّد الخطب (${response.status})`) as any;
    err.status = response.status;
    throw err;
  }

  const json = await response.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("لم يُرجع النموذج نصاً صالحاً");
  }
  return cleanModelText(text);
}


async function callOpenRouterWithRetry(
  params: {
    apiKey: string;
    models: string[];
    systemPrompt: string;
    userPrompt: string;
    temperature?: number;
  },
  retries = 2
): Promise<string> {
  let lastError: Error | null = null;

  for (const model of params.models) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`[OpenRouter API Call] Invoking model ${model} (Attempt ${attempt})...`);
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${params.apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://khatiib.online",
            "X-Title": "Khatiib Platform",
          },
          body: JSON.stringify({
            model,
            temperature: params.temperature ?? 0.7,
            max_tokens: 1400,
            messages: [
              { role: "system", content: params.systemPrompt },
              { role: "user", content: params.userPrompt },
            ],
          }),
        });

        if (res.status === 429) {
          console.warn(`[OpenRouter RateLimit] Model: ${model}, status: 429.`);
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, 2000 * attempt));
            continue;
          }
          break;
        }

        if (!res.ok) {
          const txt = await res.text();
          console.error(`[OpenRouter Error] Model: ${model}, status: ${res.status}, body: ${txt.slice(0, 500)}`);
          if (res.status === 401) {
            const err = new Error("مفتاح OpenRouter غير صالح أو غير موجود على النظام (401 User not found). يرجى التأكد من إنشاء المفتاح من openrouter.ai/keys");
            (err as any).status = 401;
            throw err;
          }
          if (res.status >= 500 && attempt < retries) {
            await new Promise((r) => setTimeout(r, 1500 * attempt));
            continue;
          }
          break;
        }

        const json = (await res.json()) as GatewayResponse;
        return getTextFromGateway(json);
      } catch (err: any) {
        lastError = err instanceof Error ? err : new Error("تعذّر الاتصال بخدمة OpenRouter");
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, 1500 * attempt));
        }
      }
    }
  }

  throw lastError ?? new Error("تعذّر توليد النص عبر OpenRouter");
}

function buildSectionPlan(data: BriefInput) {
  const totalWords = data.duration * 110;
  const includePrayer = data.contentType === "خطبة";
  const introShare = 0.14;
  const closingShare = 0.12;
  const prayerShare = includePrayer ? 0.09 : 0;
  const axisShare = Math.max(0.45, 1 - introShare - closingShare - prayerShare) / data.axes.length;

  const plans: SectionPlan[] = [
    {
      heading: "المقدمة",
      kind: "intro",
      wordTarget: Math.max(70, Math.round(totalWords * introShare)),
    },
    ...data.axes.map((axis) => ({
      heading: axis,
      kind: "axis" as const,
      wordTarget: Math.max(90, Math.round(totalWords * axisShare)),
    })),
    {
      heading: "الخاتمة",
      kind: "closing",
      wordTarget: Math.max(70, Math.round(totalWords * closingShare)),
    },
  ];

  if (includePrayer) {
    plans.push({
      heading: "الدعاء",
      kind: "prayer",
      wordTarget: Math.max(60, Math.round(totalWords * prayerShare)),
    });
  }

  return plans;
}

function buildSectionPrompt(data: BriefInput, section: SectionPlan, previousSummaries: string[]) {
  const headings = ["المقدمة", ...data.axes, "الخاتمة", ...(data.contentType === "خطبة" ? ["الدعاء"] : [])].join(" | ");

  const sectionInstructions: Record<SectionKind, string> = {
    intro:
      `المقدمة لها مرحلتان متمايزتان:\n① الافتتاح الرباني (5-8 جمل): ابدأ بحمد الله بأسمائه الموافقة لروح الموضوع — فإن كانت الخطبة عن الرحمة فابدأ بـ"الحمد لله الرحمن الرحيم.."، وإن كانت عن التوبة فابدأ بـ"الحمد لله الذي فتح لعباده أبواب التوبة.."، ثم الصلاة على النبي ﷺ بصيغة تلمس الموضوع، ثم: أما بعد.\n② الخطفة (Hook) — هذا هو القلب: جملة أو موقف يجعل المصلّين ينسون كل شيء وينصتون. أقوى أنواع الـ Hook المنبري:\n- حكاية قصيرة مؤلمة أو مفاجئة من الواقع المعاصر\n- سؤال يصف حال الناس بدقة مؤلمة\n- آية واحدة تُلقى ببطء مع صمت قصير وتعليق حي\n- مشهد حي يصف جمهورهم أنفسهم كأنهم يرون أنفسهم في مرآة\nلا تبدأ بتمهيد أكاديمي بارد ولا بعبارات عامة مستهلكة.`,
    axis:
      `هذا المحور يسير في ثلاث مراحل:\n① التأسيس (60% من الكلمات): اطرح فكرة المحور وعمّقها — اربطها بالواقع المعاش ووجّه الخطاب إلى ${data.audience} بصدق ودفء. لا تذكر عنوان المحور داخل النص. أدرج سؤالاً بلاغياً يلامس القلب أو موقفاً قصيراً من السلف أو من تجربة الإمام الإنسانية.\n② الغوص (25%): اذهب بهم إلى عمق المعنى — بقصة إنسانية مؤثرة أو آية تُفتح أمامهم أبواب التدبر أو مثال يلمس حياتهم اليومية.\n③ لحظة الذروة (15%): هذه الجملة أو الفقرة الصغيرة هي "المسمار" الذي يثبت المعنى في القلب. اجعلها غير متوقعة، حية، شخصية — كأنك تنظر في عين شخص واحد في القاعة وتكلّمه مباشرة (مثال: "وأعلم يقيناً أن في هذه القاعة اليوم من خرج من بيته وهو على حافة اليأس. هذه الكلمات لك أنت."). لا تكرر قصة استخدمتها في محور سابق.`,
    closing:
      `الخاتمة لها بنية ثلاثية:\n① التلخيم العاطفي: ليس تلخيصاً ذهنياً جافاً — بل استحضار عاطفي لأقوى ما مرّ في الخطبة. ذكّرهم بما أحسّوه لا بما سمعوه.\n② الوصية العملية: عمل واحد محدد وقابل للتطبيق اليوم قبل المغرب — بعيداً عن العموميات (لا "أكثر من الاستغفار" بل "قبل أن تنام الليلة، اخلُ بنفسك دقيقتين واذكر ثلاثة نعم نسيت شكرها").\n③ الجملة الأخيرة الخالدة (5-12 كلمة): هذه الجملة يجب أن تُصاغ خصيصاً لهذه الخطبة وهذا الموضوع — لا تنسخها ولا تستعر مثيلتها من خطبة أخرى. يجب أن تكون بسيطة، عميقة، تبقى في الذاكرة بعد أن يخرج المصلّي من المسجد. أمثلة على البنية لا على النص (لا تنسخها): "الجنة تستحق كل تعب." / "قلبك أقرب إلى الله مما تظن." / "لم يُسلم عليك الأسبوع الماضي — ابدأ اليوم.".`,
    prayer:
      `اكتب دعاءً جامعاً مؤثراً خاصاً بهذا الموضوع تحديداً — لا دعاءً عاماً يصلح لأي خطبة. ابدأ بحمد الله والثناء عليه ثم الصلاة على النبي ﷺ. اجعله فصيحاً، وقصيراً نسبياً، متدرجاً من الاعتراف بالضعف إلى طلب القوة والثبات. أدرج فيه ما يُناسب أحوال المصلّين: الرزق، الذرية، الصحة، الثبات على الدين، الخاتمة الحسنة. اختم بصيغة الصلاة على النبي ﷺ.`,
  };

  const previousContext = previousSummaries.length
    ? `\nما قيل في الأقسام السابقة (لا تكرره وابنِ عليه):\n${previousSummaries.map((s, i) => `- ${i + 1}) ${s}`).join("\n")}\n`
    : "";

  const parallelNote = previousSummaries.length === 0
    ? "\nتنبيه هام لضمان الجودة: يتم توليد أقسام الخطبة بالتوازي، لذلك يرجى التركيز التام والدقيق على موضوع هذا القسم المحدَّد فقط، وتجنَّب تماماً كتابة أي مقدمات أو استعراضات لبقية الأقسام المذكورة في الترتيب العام، لكي لا يحدث أي تكرار أو تداخل بين الأقسام عند تجميعها.\n"
    : "";

  return `اكتب نص قسم واحد فقط من ${data.contentType} عربية بهذه المواصفات:
- الموضوع: ${data.topic}
- الجمهور: ${data.audience}
- النبرة: ${data.tone}
- ترتيب الأقسام الكامل للمحتوى: ${headings}
- القسم المطلوب الآن: ${section.heading}
- الطول المطلوب: نحو ${section.wordTarget} كلمة
${previousContext}${parallelNote}
تعليمات هذا القسم:
${sectionInstructions[section.kind]}

ضوابط الكتابة:
1) اكتب متن القسم فقط دون عنوان ودون Markdown.
2) اجعله فقرات نثرية مترابطة صالحة للإلقاء بصوت إمام يخاطب جماعته.
3) لا تستشهد إلا بحديث **صحيح أو حسن** تم التحقق من درجته في موقع **https://hdith.com/** (الباحث الحديثي) قبل إيراده، مع ذكر مَن أخرجه ودرجته (مثل: رواه البخاري، صححه الألباني). وإن لم يكن الحديث ثابتاً صحيحاً أو حسناً في hdith.com فلا تُورده مطلقاً واكتفِ بآية قرآنية أو معنى عام. ولا تكرر آية أو حديثاً ورد في قسم سابق.
4) لا تكرر مقدمة عامة أو خاتمة عامة إلا إذا كان القسم المطلوب هو المقدمة أو الخاتمة أو الدعاء.
5) اجعل النص نابضاً بالحياة والصدق، كأن إماماً حقيقياً كتبه بقلمه لا أداة آلية.`;
}

function summarizeSection(body: string, maxChars = 220) {
  const clean = body.replace(/\s+/g, " ").trim();
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
) {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  async function worker() {
    while (true) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      if (currentIndex >= items.length) return;

      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

function fallbackTitle(topic: string) {
  return cleanModelText(topic).split(/\n+/)[0]?.slice(0, 80) || "خطبة جديدة";
}

export const generateSermonAI = createServerFn({ method: "POST" })
  .inputValidator((input) => BriefSchema.parse(input))
  .handler(async ({ data }): Promise<GeneratedSermon> => {
    let envGeminiKey = "";
    let envOpenRouterKey = "";
    let cloudflareOpenRouterKey: string | undefined;
    let cloudflareGeminiKey: string | undefined;

    // 1. Try Cloudflare Workers context via cloudflare:workers (native Cloudflare module)
    try {
      // @ts-ignore
      const cfWorkersModule = ["cloudflare", "workers"].join(":");
      const cfWorkers = await import(/* @vite-ignore */ cfWorkersModule);
      if (cfWorkers?.env) {
        cloudflareOpenRouterKey = cfWorkers.env.OPENROUTER_API_KEY;
        cloudflareGeminiKey = cfWorkers.env.GEMINI_API_KEY;
      }
    } catch (e) {
      // Not in Cloudflare Workers environment or module not available
    }

    // 2. Try H3 event context (Vinxi/Nitro on Cloudflare Pages/Workers)
    if (!cloudflareOpenRouterKey || !cloudflareGeminiKey) {
      try {
        const vinxiHttpModule = ["vinxi", "http"].join("/");
        const { getEvent } = await import(/* @vite-ignore */ vinxiHttpModule);
        const event = getEvent();
        const cfEnv = event?.context?.cloudflare?.env;
        if (cfEnv) {
          cloudflareOpenRouterKey = cloudflareOpenRouterKey || cfEnv.OPENROUTER_API_KEY;
          cloudflareGeminiKey = cloudflareGeminiKey || cfEnv.GEMINI_API_KEY;
        }
      } catch (e) {
        // Not in Vinxi server environment or no Cloudflare context
      }
    }

    try {
      const searchDirs = [
        process.cwd(),
        typeof __dirname !== "undefined" ? __dirname : "",
        (import.meta as any).dirname || ""
      ].filter(Boolean);

      let foundEnvPath = "";
      for (const startDir of searchDirs) {
        let currentDir = startDir;
        for (let i = 0; i < 5; i++) {
          const checkPath = path.resolve(currentDir, ".env");
          if (fs.existsSync(checkPath)) {
            foundEnvPath = checkPath;
            break;
          }
          const parentDir = path.dirname(currentDir);
          if (parentDir === currentDir) break;
          currentDir = parentDir;
        }
        if (foundEnvPath) break;
      }

      if (foundEnvPath) {
        const envContent = fs.readFileSync(foundEnvPath, "utf-8");
        const lines = envContent.split(/\r?\n/);
        for (const line of lines) {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
          if (match) {
            const key = match[1];
            let value = match[2] || "";
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            if (key === "GEMINI_API_KEY") {
              envGeminiKey = value.trim();
            }
            if (key === "OPENROUTER_API_KEY") {
              envOpenRouterKey = value.trim();
            }
          }
        }
      }
    } catch (err) {
      console.error("[SERVER FN] Error reading .env manually:", err);
    }

    const cleanCloudflareOpenRouterKey = cloudflareOpenRouterKey && cloudflareOpenRouterKey !== "YOUR_OPENROUTER_API_KEY_HERE" ? cloudflareOpenRouterKey : undefined;
    const cleanEnvOpenRouterKey = envOpenRouterKey && envOpenRouterKey !== "YOUR_OPENROUTER_API_KEY_HERE" ? envOpenRouterKey : undefined;
    const cleanProcessOpenRouterKey = process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "YOUR_OPENROUTER_API_KEY_HERE" ? process.env.OPENROUTER_API_KEY : undefined;
    const openRouterKey = cleanCloudflareOpenRouterKey || cleanEnvOpenRouterKey || cleanProcessOpenRouterKey;

    const cleanCloudflareGeminiKey = cloudflareGeminiKey && cloudflareGeminiKey !== "YOUR_GEMINI_API_KEY_HERE" ? cloudflareGeminiKey : undefined;
    const cleanEnvKey = envGeminiKey && envGeminiKey !== "YOUR_GEMINI_API_KEY_HERE" ? envGeminiKey : undefined;
    const cleanProcessKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "YOUR_GEMINI_API_KEY_HERE" ? process.env.GEMINI_API_KEY : undefined;

    const geminiKey = cleanCloudflareGeminiKey || cleanEnvKey || cleanProcessKey;

    if (!openRouterKey && !geminiKey) {
      throw new Error(
        "لم نتمكن من الوصول لخدمة الصياغة — حاول مرة أخرى ، نحن في الوضع التجريبي ."
      );
    }

    // نماذج OpenRouter مرتبة حسب الأفضلية والتركيز على نماذج Gemini المتميزة باللغة العربية والضوابط الشرعية
    const OPENROUTER_MODELS = [
      "google/gemini-2.5-flash",
      "google/gemini-2.5-pro",
      "deepseek/deepseek-chat",
    ];

    // النماذج النشطة في Google AI Studio مرتبة حسب الأحدث والأكثر استقراراً
    const PAID_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-2.5-pro"];
    const FREE_MODELS: string[] = [];

    const callModel = async (systemPrompt: string, userPrompt: string, temperature = 0.7): Promise<string> => {
      // 1. مسار OpenRouter (يعمل إذا تم توفير مفتاح OpenRouter)
      if (openRouterKey) {
        try {
          return await callOpenRouterWithRetry({
            apiKey: openRouterKey,
            models: OPENROUTER_MODELS,
            systemPrompt,
            userPrompt,
            temperature,
          });
        } catch (orErr: any) {
          console.warn(`[OpenRouter Failed] ${orErr.message}. Checking Gemini fallback...`);
          if (!geminiKey) throw orErr;
        }
      }

      const apiKey = geminiKey!;
      const isLovable = apiKey.startsWith("sk_");

      // 2. مسار Lovable Gateway (لا يتغير)
      if (isLovable) {
        return callGatewayText({
          apiKey,
          gatewayUrl: "https://ai.gateway.lovable.dev/v1/chat/completions",
          models: ["google/gemini-3-flash-preview", "google/gemini-2.5-flash"],
          systemPrompt,
          userPrompt,
          temperature,
        });
      }

      // 3. مسار Google AI Studio المباشر مع Fallback تلقائي
      const allModels = [...PAID_MODELS, ...FREE_MODELS];
      let lastError: Error | null = null;

      for (const model of allModels) {
        const isFree = FREE_MODELS.includes(model);
        if (isFree) {
          console.warn(`[Fallback] رصيد النماذج المدفوعة نفد — التحويل للنموذج المجاني: ${model}`);
        }
        try {
          return await callNativeGeminiWithRetry({ apiKey, model, systemPrompt, userPrompt, temperature });
        } catch (err: any) {
          lastError = err instanceof Error ? err : new Error("تعذّر الاتصال بخدمة التوليد");
          const isQuota = lastError.message === "QUOTA_EXCEEDED" || lastError.message.toLowerCase().includes("billing");
          const isRateLimit = lastError.message.includes("تجاوزت حد الاستخدام");
          const isTransient = err.status >= 500 || lastError.message.includes("503") || lastError.message.includes("500") || lastError.message.includes("504");
          const isUnsupportedModel = err.status === 404 || err.status === 400 || lastError.message.includes("404") || lastError.message.includes("400");

          if (isQuota || (isRateLimit && !isFree) || isTransient || isUnsupportedModel) {
            console.warn(`[Model Fallback] Model ${model} failed (status: ${err.status || 'unknown'}, msg: ${lastError.message}). Switching to next model...`);
            continue; // جرّب النموذج التالي
          }
          throw lastError; // خطأ حقيقي (مثل 401 مفتاح خاطئ) → أوقف
        }
      }

      throw new Error("تعذّر توليد الخطبة — جميع النماذج المتاحة وصلت لحدودها أو غير متوفرة. حاول بعد قليل.");
    };

    const sectionPlan = buildSectionPlan(data);

    const titlePromise = callModel(
      TITLE_SYSTEM_PROMPT,
      `اقترح عنواناً واحداً فقط لـ${data.contentType} عن: ${data.topic}.\nالجمهور: ${data.audience}.\nالنبرة: ${data.tone}.`,
      0.8
    ).catch(() => fallbackTitle(data.topic));

    // Run sections generation in parallel with a safe concurrency limit of 3 to balance speed and Google AI Studio RPM limits
    const sections = await mapWithConcurrency(sectionPlan, 3, async (section) => {
      const body = await callModel(
        SECTION_SYSTEM_PROMPT,
        buildSectionPrompt(data, section, []),
        section.kind === "prayer" ? 0.85 : 0.65
      );
      return { heading: section.heading, body };
    });

    if (!sections.length || sections.some((section) => !section.body.trim())) {
      throw new Error("هيكل الخطبة المُولَّدة غير مكتمل");
    }

    return {
      title: await titlePromise,
      sections,
    };
  });
