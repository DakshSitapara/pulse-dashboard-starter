"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";

export function ThemeSync() {
  const theme = useAppSelector((state) => state.preferences.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return null;
}
