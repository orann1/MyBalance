"use client";

import { Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className={cn(
      "md:hidden fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur"
    )}>
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary transition-colors"
          aria-label="תפריט"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <button
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary transition-colors"
          aria-label="חפש"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <button
          className="grid h-9 w-9 place-items-center rounded-xl hover:bg-secondary transition-colors"
          aria-label="התראות"
        >
          <Bell className="h-5 w-5" />
        </button>

        {/* Avatar */}
        <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-networth text-xs font-bold text-primary-foreground shadow-soft">
          א
        </div>
      </div>
    </header>
  );
}
