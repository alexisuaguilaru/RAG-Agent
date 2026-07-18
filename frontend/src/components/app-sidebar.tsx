"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Bot, Plus, Trash2 } from "lucide-react";
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

export function AppSidebar() {
  const pathname = usePathname();

  // In a real application, these would be fetched from database/localStorage
  const [conversations, setConversations] = React.useState([
    { id: "default", title: "Active Session" },
  ]);

  const startNewChat = () => {
    // Generate new conversation or reset active state
    window.location.href = "/";
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
                <span className="text-xs text-muted-foreground text-left">Aegra Client</span>
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
                  onClick={startNewChat}
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
            <SidebarMenu>
              {conversations.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton asChild isActive={pathname === "/" || pathname === `/chat/${chat.id}`}>
                    <Link href="/" className="flex items-center justify-between gap-3 group/item">
                      <div className="flex items-center gap-3 truncate">
                        <MessageSquare className="size-4 text-muted-foreground" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
