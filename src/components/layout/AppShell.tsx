"use client";

import { useState, ReactNode } from "react";
import { useLocale } from "next-intl";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MobileDrawer } from "./MobileDrawer";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const locale = useLocale();
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <div dir={dir} className="flex min-h-screen w-full">
      {/* Desktop sidebar — right side (RTL), participates in flex layout */}
      <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile header */}
        <MobileHeader onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Mobile drawer */}
        <MobileDrawer
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main content */}
        <main className="min-w-0 flex-1 px-4 pb-12 pt-6 md:px-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
