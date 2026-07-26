/**
 * Frontend Theme & Color Palette Configuration
 * 
 * Customize main, secondary, background, card, sidebar, and accent colors
 * for both Light Mode and Dark Mode.
 * 
 * Modifying these values will automatically retheme the entire application.
 */

export interface ThemeColors {
  /** Main brand primary color (buttons, active states, key icons) */
  primary: string;
  /** Text/icon color on top of primary background */
  primaryForeground: string;

  /** Secondary brand color (secondary buttons, subtle highlights) */
  secondary: string;
  /** Text/icon color on top of secondary background */
  secondaryForeground: string;

  /** Interactive accent color (hover states, active pills) */
  accent: string;
  /** Text color on accent background */
  accentForeground: string;

  /** Main application page background */
  background: string;
  /** Primary text color */
  foreground: string;

  /** Card / Modal container background */
  card: string;
  /** Text color inside cards */
  cardForeground: string;

  /** Sidebar container background */
  sidebarBg: string;
  /** Sidebar navigation text color */
  sidebarFg: string;
  /** Sidebar border color */
  sidebarBorder: string;
  /** Sidebar item hover / active background */
  sidebarAccent: string;
  /** Sidebar item hover / active text color */
  sidebarAccentFg: string;

  /** Muted / Disabled element background */
  muted: string;
  /** Subtitle, placeholder, and secondary text color */
  mutedForeground: string;

  /** Standard element border color */
  border: string;
}

export interface DesignConfig {
  name: string;
  description: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const themeConfig: DesignConfig = {
  name: "Modern Blue Palette",
  description: "Configurable color system for Light and Dark themes",

  /* LIGHT THEME PALETTE */
  light: {
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#60a5fa",
    secondaryForeground: "#ffffff",
    accent: "#eff6ff",
    accentForeground: "#93c5fd",
    background: "#ffffff",
    foreground: "#0f172a",
    card: "#ffffff",
    cardForeground: "#0f172a",
    sidebarBg: "#f8fafc",
    sidebarFg: "#334155",
    sidebarBorder: "#e2e8f0",
    sidebarAccent: "#f1f5f9",
    sidebarAccentFg: "#0f172a",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
    border: "#e2e8f0",
  },

  /* DARK THEME PALETTE */
  dark: {
    primary: "#3b82f6",
    primaryForeground: "#ffffff",
    secondary: "#60a5fa",
    secondaryForeground: "#0f172a",
    accent: "#1e3a8a",
    accentForeground: "#93c5fd",
    background: "#090d16",
    foreground: "#f8fafc",
    card: "#0f172a",
    cardForeground: "#f8fafc",
    sidebarBg: "#0b1120",
    sidebarFg: "#cbd5e1",
    sidebarBorder: "#1e293b",
    sidebarAccent: "#1e293b",
    sidebarAccentFg: "#f8fafc",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
    border: "#1e293b",
  },
};
