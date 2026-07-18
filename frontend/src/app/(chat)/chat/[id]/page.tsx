import { Chat } from "@/components/chat";

export default async function ThreadChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Chat threadId={id} />;
}
