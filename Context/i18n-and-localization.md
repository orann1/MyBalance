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
├── layout.tsx           # Root layout (sets lang="he" dir="rtl" for default)
├── page.tsx             # Root page renders Hebrew (/) without prefix
└── [locale]/
    ├── layout.tsx       # Locale-specific layout (sets lang/dir per locale)
    ├── page.tsx         # Locale-specific pages (/en, /he)
    ├── accounts/
    ├── assets/
    ├── liabilities/
    ├── goals/
    └── settings/
```

Routing structure:
- `/` → Hebrew via root page (unprefixed, canonical Hebrew route)
- `/en` → English via [locale] page
- `/he` → redirects to `/` (no separate Hebrew-prefixed route)

## HTML Direction

Set:

```tsx
<html lang={locale} dir={direction}>
```

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

## Documentation Impact

If locale routing, message structure, direction handling, or formatting changes, update this file.
