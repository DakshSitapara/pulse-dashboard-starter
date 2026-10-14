"use client";

import { Bell, Moon, Search, Sun } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTheme } from "@/store/preferences-slice";

export function Topbar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);

  return (
    <header className="topbar">
      <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>Discover</strong></div>
      <div className="topbar-actions">
        <label className="search-box">
          <Search size={17} />
          <input
            aria-label="Search content"
            placeholder="Search anything..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <kbd>⌘ K</kbd>
        </label>
        <button className="icon-button" aria-label="Toggle theme" onClick={() => dispatch(setTheme(theme === "light" ? "dark" : "light"))}>
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18} /><span /></button>
        <div className="topbar-avatar" aria-label="Guest profile">D</div>
      </div>
    </header>
  );
}
