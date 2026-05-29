// Domain models — منصة الخطباء (نوازل العصر).

export type ContentType = "خطبة" | "كلمة" | "درس" | "مادة قصيرة";

export interface Category {
  id: string;
  nameAr: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}

export interface SermonSection {
  heading: string;
  body: string;
}

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  contentType: ContentType;
  excerpt: string;
  fullText: string;
  /** Pre-normalized text for search indexing. */
  normalizedText: string;
  /** Single category (flat taxonomy). */
  categorySlug: string;
  categoryName: string;
  tags: string[];
  language: "ar";
  contentStatus: "published" | "draft";
  createdAt: string;
  updatedAt: string;
  isGenerated: boolean;
  sections: SermonSection[];
  estimatedMinutes?: number;
}

export interface SearchResult {
  sermon: Sermon;
  score: number;
  matchedOn: Array<"title" | "category" | "tags" | "body">;
  hint?: string;
}

export type MessageRole = "user" | "assistant" | "system";

export type MessageType =
  | "text"
  | "search-results"
  | "sermon-reader"
  | "no-results"
  | "category-suggestion"
  | "create-intent"
  | "outline"
  | "draft";

export interface ConversationMessage {
  id: string;
  conversationId: string;
  role: MessageRole;
  messageType: MessageType;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type ConversationMode = "search" | "browse" | "create";

export interface Conversation {
  id: string;
  userId?: string;
  title: string;
  mode: ConversationMode;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  pinned: boolean;
  archived: boolean;
}

export type Intent =
  | { kind: "search"; query: string }
  | { kind: "create"; topic: string }
  | { kind: "browse"; query: string }
  | { kind: "ambiguous"; query: string };
