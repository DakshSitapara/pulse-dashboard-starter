"use client";

import { createContext, useContext, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

interface SearchContextValue {
  search: string;
  setSearch: (value: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useAppSearch() {
  const value = useContext(SearchContext);
  if (!value) throw new Error("useAppSearch must be used inside AppShell.");
  return value;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState("");

  return (
    <SearchContext.Provider value={{ search, setSearch }}>
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Topbar search={search} onSearchChange={setSearch} />
          <div className="route-content">{children}</div>
        </div>
      </div>
    </SearchContext.Provider>
  );
}
