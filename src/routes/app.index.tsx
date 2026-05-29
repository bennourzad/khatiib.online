import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ChatView } from "@/features/chat/ChatView";

const searchSchema = z.object({
  q: z.string().optional(),
  cid: z.string().optional(),
  n: z.string().optional(),
});

export const Route = createFileRoute("/app/")({
  validateSearch: searchSchema,
  component: ChatRoute,
});

function ChatRoute() {
  const { q, cid, n } = Route.useSearch();
  return <ChatView key={`${cid ?? ""}-${n ?? ""}-${q ?? ""}`} initialQuery={q} resumeConversationId={cid} />;
}
