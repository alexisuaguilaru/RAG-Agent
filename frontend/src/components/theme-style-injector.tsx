"use client";

import React from "react";
import { themeConfig } from "@/config/theme.config";

export function ThemeStyleInjector() {
  const cssVariables = `
    :root {
      --primary: ${themeConfig.light.primary};
      --primary-foreground: ${themeConfig.light.primaryForeground};
      --secondary: ${themeConfig.light.secondary};
      --secondary-foreground: ${themeConfig.light.secondaryForeground};
      --accent: ${themeConfig.light.accent};
      --accent-foreground: ${themeConfig.light.accentForeground};
      --background: ${themeConfig.light.background};
      --foreground: ${themeConfig.light.foreground};
      --card: ${themeConfig.light.card};
      --card-foreground: ${themeConfig.light.cardForeground};
      --sidebar-bg: ${themeConfig.light.sidebarBg};
      --sidebar-fg: ${themeConfig.light.sidebarFg};
      --sidebar-border: ${themeConfig.light.sidebarBorder};
      --sidebar-accent: ${themeConfig.light.sidebarAccent};
      --sidebar-accent-fg: ${themeConfig.light.sidebarAccentFg};
      --muted: ${themeConfig.light.muted};
      --muted-foreground: ${themeConfig.light.mutedForeground};
      --border: ${themeConfig.light.border};
    }
    .dark {
      --primary: ${themeConfig.dark.primary};
      --primary-foreground: ${themeConfig.dark.primaryForeground};
      --secondary: ${themeConfig.dark.secondary};
      --secondary-foreground: ${themeConfig.dark.secondaryForeground};
      --accent: ${themeConfig.dark.accent};
      --accent-foreground: ${themeConfig.dark.accentForeground};
      --background: ${themeConfig.dark.background};
      --foreground: ${themeConfig.dark.foreground};
      --card: ${themeConfig.dark.card};
      --card-foreground: ${themeConfig.dark.cardForeground};
      --sidebar-bg: ${themeConfig.dark.sidebarBg};
      --sidebar-fg: ${themeConfig.dark.sidebarFg};
      --sidebar-border: ${themeConfig.dark.sidebarBorder};
      --sidebar-accent: ${themeConfig.dark.sidebarAccent};
      --sidebar-accent-fg: ${themeConfig.dark.sidebarAccentFg};
      --muted: ${themeConfig.dark.muted};
      --muted-foreground: ${themeConfig.dark.mutedForeground};
      --border: ${themeConfig.dark.border};
    }
  `;

  return (
    <style
      id="theme-config-injector"
      dangerouslySetInnerHTML={{ __html: cssVariables }}
    />
  );
}
