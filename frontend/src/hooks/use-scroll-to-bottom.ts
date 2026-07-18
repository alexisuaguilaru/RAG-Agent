"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useScrollToBottom<T extends HTMLElement>(): [
  RefObject<T | null>,
  RefObject<HTMLDivElement | null>,
] {
  const containerRef = useRef<T | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return [containerRef, endRef];
}
