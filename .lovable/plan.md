
## الأهداف

1. حذف كل ما يخص موقع alimam.ws (محتوى + سحب + تصنيفات + صفحات إدارة).
2. الحفاظ الكامل على ورشة صياغة الخطبة `/app/create` كما هي.
3. إنشاء 12 تصنيفًا شرعيًا معاصرًا (نوازل العصر) فارغة المحتوى الفعلي، مع 2-3 مواد تجريبية لكل تصنيف لتجربة التدفق.
4. إعادة توجيه بحث الشات ليبحث محليًا داخل مواد التصنيفات الجديدة بدل البحث الحي في موقع الإمام.

---

## 1) الحذف الكامل لمحتوى وخصائص موقع الإمام

### ملفات تُحذف بالكامل
- `src/data/categories.ts` (سيُعاد إنشاؤه فارغًا من بنية الإمام).
- `src/data/sermons.ts` (سيُعاد إنشاؤه بمواد تجريبية للتصنيفات الجديدة).
- `src/data/alimam-archive.json` (إن وجد) وأي ملفات أرشيف JSON مرتبطة.
- `src/lib/alimam-live.functions.ts` — server functions للبحث/السحب الحي (Firecrawl).
- `src/lib/alimam-post.functions.ts`.
- `src/lib/sermons-import.functions.ts`.
- `src/stores/importedSermons.ts`.
- `src/features/chat/messages/AlimamResultsMessage.tsx`.
- `src/features/chat/messages/AlimamReaderMessage.tsx`.
- جميع صفحات الإدارة:
  `src/routes/admin.tsx`, `admin.index.tsx`, `admin.categories.tsx`, `admin.sermons.tsx`, `admin.settings.tsx`, `admin.users.tsx`.
- `src/components/admin/AdminSidebar.tsx`, `src/components/admin/StatCard.tsx`.
- أي راوت/مكون مرتبط فقط بسحب أو استيراد مواد الإمام.

### إزالة الاعتمادات
- إزالة استخدام Firecrawl من الكود (الإبقاء على `FIRECRAWL_API_KEY` كسر سرّي اختياري — قابل للحذف لاحقًا).
- تنظيف `package.json` من `@mendable/firecrawl-js` إن لم يعد مستخدمًا.

### تنظيف القوائم والمسارات
- في `src/config/navigation.ts`: حذف أي إشارة للإدارة، الإبقاء على: محادثة جديدة، التصنيفات، ورشة صياغة الخطبة، المفضلة، خطبي المحفوظة، السجل، الملف الشخصي.
- التأكد من خلو `__root.tsx` و `app.tsx` من أي إشارة لأقسام الإمام أو الإدارة.

---

## 2) التصنيفات الـ12 الجديدة (نوازل ومعاصرة)

اقتراحي للقائمة الأولية (قابلة للتعديل قبل/أثناء التنفيذ):

| # | العنوان | المجال |
|---|---------|--------|
| 1 | فقه النوازل الرقمية | الإنترنت، الخصوصية، التشهير الإلكتروني |
| 2 | أحكام الذكاء الاصطناعي | استخدامه، حدوده، أخلاقياته |
| 3 | المعاملات المالية المعاصرة | التمويل، الكروت، التورق، البنوك |
| 4 | فقه العملات الرقمية والاستثمار الحديث | كريبتو، أسهم، صناديق |
| 5 | نوازل الأسرة المعاصرة | الطلاق الرقمي، التواصل الزوجي، التربية في زمن الشاشات |
| 6 | تربية الأبناء في العصر الرقمي | الألعاب، السوشيال ميديا، الإدمان الرقمي |
| 7 | قضايا الشباب المعاصرة | الهوية، الفراغ، الصحة النفسية |
| 8 | فقه الطب والمستجدات الحيوية | التبرع بالأعضاء، الإنجاب المساعد، التجميل |
| 9 | الإعلام الجديد ومسؤولية الكلمة | المؤثرون، النشر، الإشاعة |
| 10 | فقه الأقليات والاغتراب | المسلم في بلاد غير المسلمين |
| 11 | البيئة والاستهلاك الواعي | الإسراف، التغير المناخي، الترشيد |
| 12 | الفتن المعاصرة وثوابت الهوية | الإلحاد، الشبهات، التغريب الفكري |

كل تصنيف يحصل على: `id`, `nameAr`, `slug`, `description`, `icon` (lucide أو إيموجي)، `displayOrder`.

---

## 3) إعادة بناء نموذج البيانات

### تبسيط `src/types/index.ts`
- إزالة `CategoryGroup` الموروث من الإمام و `mainSection`/`subCategory`/`isOriginalSource`/`generationParentId`/`sourceSite`.
- `Category` يصبح: `{ id, nameAr, slug, description, icon, displayOrder, isActive }` (تصنيفات مسطّحة، بلا أبناء).
- `Sermon` يصبح: `{ id, title, slug, excerpt, fullText, normalizedText, categorySlug, tags, sections, estimatedMinutes, contentStatus, createdAt, updatedAt, isGenerated }`.
- الحفاظ على `SearchResult`, `ConversationMessage`, `Conversation`, `Intent`.

### `src/data/categories.ts` (جديد، يدوي وفارغ من بنية الإمام)
- تصدير مصفوفة `CATEGORIES` تحوي الـ12 عنوانًا فقط.
- دوال مساعدة: `getCategoryBySlug`, `getAllCategories`.

### `src/data/sermons.ts` (جديد، مواد تجريبية)
- 2-3 خطب/مواد تجريبية لكل تصنيف (≈ 30 مادة)، كل مادة تشمل: عنوان، مقتطف، 3-4 أقسام (`sections`)، وسوم، ربط بـ `categorySlug`.
- المحتوى تجريبي قصير عربي، يصلح للعرض ولاختبار البحث.

### `src/lib/arabic.ts`
- الإبقاء كما هو (تطبيع البحث العربي مطلوب للبحث المحلي).

---

## 4) إعادة بناء طبقة البحث المحلية

### `src/services/searchService.ts`
- يبقى ولكن يستهلك المواد الجديدة فقط (إزالة `importedSermonsStore`).
- الاحتفاظ بمنطق ترجيح: عنوان > وسوم > تصنيف > نص.
- `searchSermons(query, { categorySlug?, limit?, minScore? })`.
- `suggestRelatedCategories(query)` يعتمد على التصنيفات الجديدة.

---

## 5) إعادة بناء تدفق المحادثة

### `src/features/chat/ChatView.tsx`
- إزالة `searchAlimam` / `scrapeAlimam` و `useServerFn`.
- البحث يصبح متزامنًا محليًا: `searchSermons(query)` يُستدعى مباشرة.
- أنواع `ChatNode` تتحول إلى: `user`, `searching` (لمسة بصرية