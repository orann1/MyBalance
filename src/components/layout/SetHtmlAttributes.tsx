"use client";

import { useEffect } from "react";

interface SetHtmlAttributesProps {
  lang: string;
  dir: string;
}

// Patches the <html> element's lang and dir attributes after hydration.
// Needed because the root layout (app/layout.tsx) statically sets lang="he" dir="rtl"
// for all routes. Locale-prefixed routes use this component to correct the attributes.
export function SetHtmlAttributes({ lang, dir }: SetHtmlAttributesProps) {
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", dir);
  }, [lang, dir]);

  return null;
}
