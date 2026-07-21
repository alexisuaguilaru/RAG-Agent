"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare, Bot, Plus, Trash2, Loader2, Pencil, Check, X, FolderKanban } from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface ThreadItem {
  id: string;
  title: string;
  createdAt?: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [threads, setThreads] = React.useState<ThreadItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingThreadId, setEditingThreadId] = React.useState<string | null>(null);
  const [editingTitle, setEditingTitle] = React.useState("");

  // Fetch Aegra open threads on mount
  const loadThreads = React.useCallback(() => {
    setIsLoading(true);
    fetch("/api/threads?userId=generic_user")
      .then((res) => {
        if (!res.ok) return { threads: [] };
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.threads)) {
          setThreads(data.threads);
        } else {
          setThreads([]);
        }
      })
      .catch(() => {
        setThreads([]);
      })
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

  const handleStartRename = (e: React.MouseEvent, thread: ThreadItem) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingThreadId(thread.id);
    setEditingTitle(thread.title);
  };

  const handleSaveRename = async (e: React.FormEvent | React.MouseEvent, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!editingTitle.trim()) return;

    try {
      const res = await fetch(`/api/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });
      if (res.ok) {
        setThreads((prev) =>
          prev.map((t) => (t.id === threadId ? { ...t, title: editingTitle.trim() } : t))
        );
      }
    } catch (err) {
      console.error("Failed to rename thread:", err);
    } finally {
      setEditingThreadId(null);
    }
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingThreadId(null);
  };

  return (
    <Sidebar collapsible="icon" className="border-r bg-sidebar">
      <SidebarHeader className="py-4 border-b border-sidebar-border px-3 overflow-hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "w-full justify-start gap-3 select-none px-2",
                isCollapsed && "justify-center px-0"
              )}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                <Bot className="size-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col gap-0.5 leading-none truncate">
                  <span className="font-semibold text-foreground truncate">AI Chatbot</span>
                  <span className="text-xs text-muted-foreground text-left truncate">Aegra Threads</span>
                </div>
              )}
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
                  title="New Chat"
                  className={cn(
                    "flex w-full items-center gap-2 justify-center rounded-lg bg-foreground text-background py-2 text-sm font-semibold hover:opacity-90 transition-all cursor-pointer overflow-hidden",
                    isCollapsed && "size-9 p-0 rounded-lg mx-auto"
                  )}
                >
                  <Plus className="size-4 shrink-0" />
                  {!isCollapsed && <span className="truncate">New Chat</span>}
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>History</SidebarGroupLabel>
          <SidebarGroupContent>
            {isLoading ? (
              <div className={cn("flex items-center gap-2 px-3 py-4 text-xs text-muted-foreground", isCollapsed && "justify-center px-0")}>
                <Loader2 className="size-3.5 animate-spin shrink-0" />
                {!isCollapsed && <span>Loading history...</span>}
              </div>
            ) : threads.length === 0 ? (
              !isCollapsed && (
                <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                  No active conversations
                </div>
              )
            ) : (
              <SidebarMenu>
                {threads.map((chat) => {
                  const isActive = pathname === `/chat/${chat.id}`;
                  const isEditingThis = editingThreadId === chat.id;

                  if (isEditingThis && !isCollapsed) {
                    return (
                      <SidebarMenuItem key={chat.id}>
                        <div
                          className="flex items-center gap-1 w-full px-2 py-1 bg-muted rounded-md border border-sidebar-border"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveRename(e, chat.id);
                              if (e.key === "Escape") handleCancelRename(e as any);
                            }}
                            className="w-full text-xs bg-background px-1.5 py-1 rounded border border-input focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                            autoFocus
                          />
                          <button
                            onClick={(e) => handleSaveRename(e, chat.id)}
                            title="Save title"
                            className="p-1 text-primary hover:text-primary/80 cursor-pointer"
                          >
                            <Check className="size-3.5" />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            title="Cancel"
                            className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      </SidebarMenuItem>
                    );
                  }

                  return (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={chat.title}>
                        <Link
                          href={`/chat/${chat.id}`}
                          className={cn(
                            "flex items-center gap-2.5 group/item overflow-hidden",
                            isCollapsed ? "justify-center px-0" : "justify-between"
                          )}
                        >
                          <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                          {!isCollapsed && (
                            <>
                              <span className="truncate text-xs flex-1 min-w-0">{chat.title}</span>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => handleStartRename(e, chat)}
                                  title="Rename thread"
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded shrink-0"
                                >
                                  <Pencil className="size-3.5" />
                                </button>
                                <button
                                  onClick={(e) => handleDeleteThread(e, chat.id)}
                                  title="Delete thread"
                                  className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer rounded shrink-0"
                                >
                                  {deletingId === chat.id ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <Trash2 className="size-3.5" />
                                  )}
                                </button>
                              </div>
                            </>
                          )}
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

      <SidebarFooter className="border-t border-sidebar-border py-3 px-3 overflow-hidden">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-sidebar-border/60 bg-background/50 shadow-xs cursor-pointer",
            isCollapsed ? "justify-center px-0 py-2.5" : "w-full"
          )}
          title="RAG Document Admin Dashboard"
        >
          <FolderKanban className="size-4 shrink-0 text-amber-500" />
          {!isCollapsed && (
            <span className="truncate font-semibold">RAG Documents Admin</span>
          )}
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
