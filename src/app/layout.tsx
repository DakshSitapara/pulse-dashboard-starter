import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/provider";
import { ThemeSync } from "@/components/theme-sync";
import { AppShell } from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Pulse — Your world, in focus",
  description: "A personalized dashboard for news and movie discoveries.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ThemeSync />
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  );
}
