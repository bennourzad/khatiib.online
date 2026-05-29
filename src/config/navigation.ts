import {
  MessageSquarePlus,
  Compass,
  Star,
  History,
  BookMarked,
  Sparkles,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  labelAr: string;
  icon: LucideIcon;
  exact?: boolean;
  comingSoon?: boolean;
}

/** Primary app nav — RTL ordered top→bottom. */
export const PRIMARY_NAV: NavItem[] = [
  { to: "/app", labelAr: "محادثة جديدة", icon: MessageSquarePlus, exact: true },
  { to: "/app/categories", labelAr: "التصنيفات", icon: Compass },
  { to: "/app/create", labelAr: "ورشة صياغة الخطبة", icon: Sparkles },
];

export const LIBRARY_NAV: NavItem[] = [
  { to: "/app/favorites", labelAr: "المفضلة", icon: Star },
  { to: "/app/saved", labelAr: "خطبي المحفوظة", icon: BookMarked },
  { to: "/app/history", labelAr: "السجل", icon: History },
];

export const ACCOUNT_NAV: NavItem[] = [
  { to: "/app/profile", labelAr: "الملف الشخصي", icon: User },
  // { to: "/app/settings", labelAr: "الإعدادات", icon: Settings },
];

export const ADMIN_NAV: NavItem[] = [];

/** Mock recent conversations — replaced by service layer in later phase. */
export const MOCK_RECENT_CONVERSATIONS = [
  { id: "c1", title: "خطبة عن الصبر للشباب" },
  { id: "c2", title: "كلمة قصيرة عن الصدق" },
  { id: "c3", title: "الاستعداد لرمضان" },
  { id: "c4", title: "بر الوالدين — صياغة جديدة" },
];
