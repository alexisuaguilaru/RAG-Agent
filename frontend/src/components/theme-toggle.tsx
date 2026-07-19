"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border bg-background text-sm font-medium transition-colors cursor-pointer"
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-sidebar-border bg-background text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-500 transition-all duration-200" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transition-all duration-200" />
      )}
    </button>
  );
}
