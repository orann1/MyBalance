# MyBalance — i18n and Localization

## Policy

MyBalance is Hebrew-first and RTL-first.

Default locale:
- `he`

Default direction:
- `rtl`

Prepared future locale:
- `en`

Future direction:
- `ltr`

## Required Behavior

- Hebrew is the default UI language.
- The root path `/` serves Hebrew content directly without a locale prefix (canonical Hebrew route).
- English is accessible under the `/en` prefix.
- The `/he` path redirects to `/` (no separate Hebrew-prefixed route).
- The app supports locale-aware routes from the beginning.
- English support may be incomplete in the MVP, but the architecture must support it.
- All user-facing text must come from translation files.

## Recommended Library

Use `next-intl`.

## Suggested Structure

```txt
src/
├── i18n/
│   ├── config.ts
│   ├── routing.ts
│   ├── navigation.ts
│   └── request.ts
├── messages/
│   ├── he.json
│   └── en.json
└── lib/
    └── locale/
        ├── direction.ts
        └── formatters.ts
```

## App Routes

```txt
app/
├── layout.tsx              # Root layout — truly minimal. Static lang="he" dir="rtl".
│                           #   No locale detection, no RootLayoutProvider, no AppShell.
├── (root)/
│   ├── layout.tsx          # Hebrew group layout. Calls setRequestLocale("he"),
│   │                       #   renders RootLayoutProvider("he") → AppShell.
│   ├── page.tsx            # Hebrew dashboard (/) — inside (root) group, no URL impact.
│   ├── managed-savings/
│   │   └── page.tsx        # /managed-savings — Hebrew managed savings
│   └── pension-gemel/
│       └── page.tsx        # /pension-gemel — Hebrew pension/gemel
└── [locale]/
    ├── layout.tsx          # Locale layout. Calls setRequestLocale(locale),
    │                       #   renders SetHtmlAttributes + RootLayoutProvider(locale).
    ├── managed-savings/
    │   └── page.tsx        # /en/managed-savings — English managed savings
    ├── pension-gemel/
    │   └── page.tsx        # /en/pension-gemel — English pension/gemel
    ├── accounts/
    ├── assets/
    ├── liabilities/
    ├── goals/
    └── settings/
```

Routing structure:
- `/` → Hebrew via `(root)/page.tsx` (unprefixed, canonical Hebrew route)
- `/managed-savings` → Hebrew via `(root)/managed-savings/page.tsx`
- `/pension-gemel` → Hebrew via `(root)/pension-gemel/page.tsx`
- `/en` → English via `[locale]/layout.tsx`
- `/en/managed-savings` → English via `[locale]/managed-savings/page.tsx`
- `/he` → redirects to `/` (no separate Hebrew-prefixed route)

## Why Route Group `(root)` is Required

`next-intl`'s `getLocale()` and `useLocale()` read from a React `cache()` slot that is populated by `setRequestLocale(locale)`. In Next.js App Router, the root layout renders BEFORE any nested layout.

**Problem (pre-Round 3)**: If `app/layout.tsx` called `getLocale()` to determine direction, it always received the default locale ("he") — because `setRequestLocale("en")` in `[locale]/layout.tsx` had not yet run. English routes received Hebrew messages and RTL direction.

**Solution**: `app/layout.tsx` is statically minimal — it does not read locale at all. Each shell layout (`(root)/layout.tsx` for Hebrew, `[locale]/layout.tsx` for English) calls `setRequestLocale()` first, then renders `RootLayoutProvider` (which mounts `NextIntlClientProvider` + `AppShell`). This guarantees locale is set before any locale-dependent code runs.

## HTML Direction

The root `<html>` element is statically set to `lang="he" dir="rtl"` in `app/layout.tsx`.

For English routes, `src/components/layout/SetHtmlAttributes.tsx` (a client component) patches `document.documentElement` after hydration:

```tsx
useEffect(() => {
  document.documentElement.setAttribute("lang", locale);
  document.documentElement.setAttribute("dir", dir);
}, [locale, dir]);
```

`AppShell.tsx` also applies `dir={dir}` explicitly on its root flex container div (derived from `useLocale()`) so that CSS direction cascade is correct within the shell even before the `<html>` patch completes.

Locale direction map:

```ts
export const localeDirection = {
  he: "rtl",
  en: "ltr",
} as const;
```

## Formatting Defaults

Hebrew defaults:

- Locale: `he-IL`
- Currency: `ILS`
- Direction: `rtl`

Use centralized helpers:

- `formatCurrency`
- `formatPercent`
- `formatDate`
- `formatNumber`
- `formatMonth`

## Translation Rule

Do not write:

```tsx
<h1>ההון שלי</h1>
```

Use:

```tsx
<h1>{t("dashboard.title")}</h1>
```

## RTL/LTR Layout Rule

Prefer logical CSS and Tailwind spacing utilities:

- `ms-*`
- `me-*`
- `ps-*`
- `pe-*`

Avoid hardcoded physical direction unless needed.

## Charts

Not all chart behavior should flip in RTL.
Usually keep financial time-series charts chronological from left to right.

## Known Limitations

**`<html lang/dir>` is `he/rtl` in the initial server-rendered HTML for all routes, including `/en/*`.**

The root layout (`app/layout.tsx`) statically sets `lang="he" dir="rtl"` on the `<html>` element and cannot be overridden by nested layouts in Next.js App Router. `SetHtmlAttributes` corrects `document.documentElement.lang` and `document.documentElement.dir` for English routes after client hydration.

There is no visible layout flash because `AppShell` (a client component) is SSR-rendered with `dir="ltr"` on its container div for English routes, which overrides the `<html dir>` attribute for all content within it from the first paint.

The `<html lang>` attribute in the raw HTML response will show `he` for English routes until JavaScript loads. This is a minor SEO and accessibility concern. It should be addressed in a dedicated i18n hardening task — not in Phase 2B scope.

## Documentation Impact

If locale routing, message structure, direction handling, or formatting changes, update this file.
