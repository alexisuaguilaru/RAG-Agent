"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Bot, Plus, Trash2, Loader2 } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";

interface ThreadItem {
  id: string;
  title: string;
  createdAt?: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [threads, setThreads] = React.useState<ThreadItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Fetch Aegra open threads on mount
  const loadThreads = React.useCallback(() => {
    setIsLoading(true);
    fetch("/api/threads?userId=generic_user")
      .then((res) => res.json())
      .then((data) => {
        if (data.threads) {
          setThreads(data.threads);
        }
      })
      .catch((err) => console.error("Failed to fetch threads:", err))
      .finally(() => setIsLoading(false));
  }, []);

  React.useEffect(() => {
    loadThreads();

    const handleThreadsUpdated = () => {
      loadThreads();
    };

    window.addEventListener("threads-updated", handleThreadsUpdated);
    return () => window.removeEventListener("threads-updated", handleThreadsUpdated);
  }, [loadThreads]);

  const handleCreateNewChat = () => {
    router.push("/");
  };

  const handleDeleteThread = async (e: React.MouseEvent, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (deletingId === threadId) return;
    setDeletingId(threadId);

    try {
      const res = await fetch(`/api/threads/${threadId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setThreads((prev) => prev.filter((t) => t.id !== threadId));
        if (pathname === `/chat/${threadId}`) {
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Failed to delete thread:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader className="py-4 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="w-full justify-start gap-3 select-none">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-foreground">AI Chatbot</span>
                <span className="text-xs text-muted-foreground text-left">Aegra Threads</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-2 py-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <button
                  onClick={handleCreateNewChat}
                  className="flex w-full items-center gap-2 justify-center rounded-lg bg-foreground text-background py-2 text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Plus className="size-4" />
                  <span>New Chat</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className="flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" />
                <span>Loading history...</span>
              </div>
            ) : threads.length === 0 ? (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                No active conversations
              </div>
            ) : (
              <SidebarMenu>
                {threads.map((chat) => {
                  const isActive = pathname === `/chat/${chat.id}`;
                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={`/chat/${chat.id}`} className="flex items-center justify-between gap-2 group/item">
                          <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                            <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                            <span className="truncate text-xs">{chat.title}</span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteThread(e, chat.id)}
                            title="Delete thread"
                            className="opacity-0 group-hover/item:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity cursor-pointer rounded"
                          >
                            {deletingId === chat.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                          </button>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border py-4">
        <div className="flex items-center justify-between px-3 text-xs text-muted-foreground">
          <span>Decoupled Agent Protocol</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
