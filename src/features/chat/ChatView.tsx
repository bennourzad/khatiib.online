import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { Composer } from "./Composer";
import { EmptyHome } from "./EmptyHome";
import { UserMessage, AssistantMessage, AssistantBlock } from "./messages/MessageBubble";
import { SearchResultsMessage } from "./messages/SearchResultsMessage";
import { SermonReaderMessage } from "./messages/SermonReaderMessage";
import { NoResultsMessage } from "./messages/NoResultsMessage";
import { CreateIntentMessage } from "./messages/CreateIntentMessage";
import { QuickChips } from "./QuickChips";

import { classifyIntent } from "@/services/intentService";
import { searchSermons } from "@/services/searchService";
import { historyStore } from "@/stores/history";
import { getCategoryByName } from "@/data/categories";
import type { SearchResult, Sermon } from "@/types";

type ChatNode =
  | { id: string; kind: "user"; text: string }
  | { id: string; kind: "results"; query: string; results: SearchResult[] }
  | { id: string; kind: "no-results"; query: string; relatedCategories: string[] }
  | { id: string; kind: "reader"; sermon: Sermon }
  | { id: string; kind: "create-intent"; topic: string }
  | { id: string; kind: "ambiguous"; query: string };

const nid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);

export function ChatView({
  initialQuery,
  resumeConversationId,
}: {
  initialQuery?: string;
  resumeConversationId?: string;
} = {}) {
  const [nodes, setNodes] = useState<ChatNode[]>([]);
  const conversationIdRef = useRef<string | null>(resumeConversationId ?? null);
  const navigate = useNavigate();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [nodes.length]);

  const push = useCallback((n: ChatNode) => setNodes((p) => [...p, n]), []);

  const startCreate = useCallback(
    (topic?: string) => {
      navigate({ to: "/app/create", search: topic ? { topic } : {} });
    },
    [navigate],
  );

  const openSermon = useCallback(
    (sermon: Sermon) => {
      push({ id: nid(), kind: "reader", sermon });
    },
    [push],
  );

  const exploreCategoryByName = useCallback(
    (name: string) => {
      const cat = getCategoryByName(name);
      if (cat) navigate({ to: "/app/categories/$slug", params: { slug: cat.slug } });
    },
    [navigate],
  );

  const handleSend = useCallback(
    (text: string) => {
      push({ id: nid(), kind: "user", text });

      const intent = classifyIntent(text);
      const mode: "search" | "create" | "browse" =
        intent.kind === "create" ? "create" : intent.kind === "browse" ? "browse" : "search";

      if (!conversationIdRef.current) {
        conversationIdRef.current = historyStore.startConversation(text, mode);
      } else {
        historyStore.touch(conversationIdRef.current, text);
      }

      if (intent.kind === "create") {
        push({ id: nid(), kind: "create-intent", topic: intent.topic });
        return;
      }

      if (intent.kind === "ambiguous") {
        push({ id: nid(), kind: "ambiguous", query: intent.query });
        return;
      }

      const query = intent.kind === "search" ? intent.query : text;
      const results = searchSermons(query, { limit: 1 });

      if (results.length === 0) {
        push({ id: nid(), kind: "create-intent", topic: query });
        return;
      }

      push({ id: nid(), kind: "reader", sermon: results[0].sermon });
    },
    [push],
  );

  const autoSentRef = useRef(false);
  useEffect(() => {
    if (autoSentRef.current) return;
    if (initialQuery && initialQuery.trim()) {
      autoSentRef.current = true;
      handleSend(initialQuery.trim());
    }
  }, [initialQuery, handleSend]);

  const isEmpty = nodes.length === 0;

  return (
    <div className="flex h-[calc(100svh-3.5rem)] flex-col">
      <div ref={scrollerRef} className="flex-1 overflow-y-auto" aria-live="polite">
        {isEmpty ? (
          <EmptyHome onPromptSelect={handleSend} onSend={handleSend} />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
            {nodes.map((n) => (
              <NodeRenderer
                key={n.id}
                node={n}
                onOpenSermon={openSermon}
                onStartCreate={startCreate}
                onSend={handleSend}
                onExploreCategory={exploreCategoryByName}
              />
            ))}
          </div>
        )}
      </div>

      {!isEmpty && (
        <div className="border-t border-border bg-background/80 backdrop-blur">
          <div className="mx-auto w-full max-w-3xl px-4 py-3">
            <Composer onSend={handleSend} />
          </div>
        </div>
      )}
    </div>
  );
}

function NodeRenderer({
  node,
  onOpenSermon,
  onStartCreate,
  onSend,
  onExploreCategory,
}: {
  node: ChatNode;
  onOpenSermon: (s: Sermon) => void;
  onStartCreate: (topic?: string) => void;
  onSend: (q: string) => void;
  onExploreCategory: (name: string) => void;
}) {
  switch (node.kind) {
    case "user":
      return <UserMessage>{node.text}</UserMessage>;
    case "results":
      return (
        <SearchResultsMessage
          query={node.query}
          results={node.results}
          onOpen={onOpenSermon}
          onCreateCustom={(s) => onStartCreate(s.title)}
        />
      );
    case "reader":
      return (
        <SermonReaderMessage
          sermon={node.sermon}
          onCreateCustom={() => onStartCreate(node.sermon.title)}
        />
      );
    case "no-results":
      return (
        <NoResultsMessage
          query={node.query}
          relatedCategories={node.relatedCategories}
          alternativeQueries={[`${node.query} للشباب`, `${node.query} مختصرة`]}
          onTryAlternative={onSend}
          onExploreCategory={onExploreCategory}
          onStartCreate={() => onStartCreate(node.query)}
        />
      );
    case "create-intent":
      return <CreateIntentMessage topic={node.topic} onStart={() => onStartCreate(node.topic)} />;
    case "ambiguous":
      return (
        <div className="space-y-3">
          <AssistantMessage>
            هل تقصد البحث عن «{node.query}» داخل التصنيفات، أم بدء صياغة خطبة جديدة؟
          </AssistantMessage>
          <AssistantBlock>
            <QuickChips
              items={["ابحث داخل التصنيفات", "ابدأ صياغة خطبة جديدة"]}
              onSelect={(c) => {
                if (c.startsWith("ابدأ")) onStartCreate(node.query);
                else onSend(node.query);
              }}
            />
          </AssistantBlock>
        </div>
      );
  }
}
