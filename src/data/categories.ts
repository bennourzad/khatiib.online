import type { Category } from "@/types";

// 12 تصنيفًا شرعيًا معاصرًا — تهتم بنوازل العصر وجديد الأحداث،
// لا التصنيفات الفقهية التقليدية. التصنيفات مسطّحة (بدون فروع).
export const CATEGORIES: Category[] = [
  {
    id: "cat-nawazil-digital",
    nameAr: "فقه النوازل الرقمية",
    slug: "nawazil-digital",
    description:
      "أحكام الإنترنت والخصوصية والتشهير الإلكتروني والهوية الرقمية.",
    icon: "🌐",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "cat-ai-rulings",
    nameAr: "أحكام الذكاء الاصطناعي",
    slug: "ai-rulings",
    description:
      "استخدامات الذكاء الاصطناعي وحدوده الشرعية وأخلاقياته في الفتيا والتعليم.",
    icon: "🤖",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "cat-modern-finance",
    nameAr: "المعاملات المالية المعاصرة",
    slug: "modern-finance",
    description: "التمويل، البطاقات، التورّق، الفوائد البنكية، والتأمين.",
    icon: "💳",
    displayOrder: 3,
    isActive: true,
  },
  {
    id: "cat-crypto-investing",
    nameAr: "العملات الرقمية والاستثمار الحديث",
    slug: "crypto-investing",
    description: "الكريبتو، الأسهم، الصناديق، والاستثمار الإلكتروني.",
    icon: "🪙",
    displayOrder: 4,
    isActive: true,
  },
  {
    id: "cat-family-nawazil",
    nameAr: "نوازل الأسرة المعاصرة",
    slug: "family-nawazil",
    description:
      "الطلاق عبر الرسائل، الزواج عن بُعد، التواصل الزوجي في زمن الشاشات.",
    icon: "🏡",
    displayOrder: 5,
    isActive: true,
  },
  {
    id: "cat-digital-parenting",
    nameAr: "تربية الأبناء في العصر الرقمي",
    slug: "digital-parenting",
    description:
      "الألعاب الإلكترونية، السوشيال ميديا، الإدمان الرقمي، والمحتوى المسموم.",
    icon: "👶",
    displayOrder: 6,
    isActive: true,
  },
  {
    id: "cat-youth-issues",
    nameAr: "قضايا الشباب المعاصرة",
    slug: "youth-issues",
    description:
      "الهوية، الفراغ، الصحة النفسية، الزواج المؤجّل، ومنزلقات العصر.",
    icon: "🎓",
    displayOrder: 7,
    isActive: true,
  },
  {
    id: "cat-medical-fiqh",
    nameAr: "فقه الطب والمستجدات الحيوية",
    slug: "medical-fiqh",
    description: "التبرّع بالأعضاء، الإنجاب المساعد، الجينات، والتجميل.",
    icon: "🩺",
    displayOrder: 8,
    isActive: true,
  },
  {
    id: "cat-new-media",
    nameAr: "الإعلام الجديد ومسؤولية الكلمة",
    slug: "new-media",
    description:
      "المؤثرون، النشر، الإشاعة، والصدق في زمن السرعة والانتشار.",
    icon: "📣",
    displayOrder: 9,
    isActive: true,
  },
  {
    id: "cat-minorities-expat",
    nameAr: "فقه الأقليات والاغتراب",
    slug: "minorities-expat",
    description:
      "المسلم في بلاد غير المسلمين، الاندماج، والهوية الإسلامية في الغربة.",
    icon: "🌍",
    displayOrder: 10,
    isActive: true,
  },
  {
    id: "cat-environment",
    nameAr: "البيئة والاستهلاك الواعي",
    slug: "environment",
    description: "الإسراف، التغير المناخي، ترشيد الاستهلاك، وحفظ النعم.",
    icon: "🌱",
    displayOrder: 11,
    isActive: true,
  },
  {
    id: "cat-modern-fitan",
    nameAr: "الفتن المعاصرة وثوابت الهوية",
    slug: "modern-fitan",
    description:
      "الإلحاد، الشبهات الفكرية، التغريب، وثبات الهوية الإسلامية.",
    icon: "🛡️",
    displayOrder: 12,
    isActive: true,
  },
];

export function getAllCategories(): Category[] {
  return [...CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return CATEGORIES.find((c) => c.nameAr === name);
}
