"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  return [theme, toggleTheme];
}
