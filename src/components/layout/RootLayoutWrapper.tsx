"use client";

import { ReactNode } from "react";
import { AppShell } from "./AppShell";

export function RootLayoutWrapper({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
