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
- The root route should redirect to Hebrew.
- The app should support locale-aware routes from the beginning.
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
└── [locale]/
    ├── layout.tsx
    ├── page.tsx
    ├── accounts/
    ├── assets/
    ├── liabilities/
    ├── goals/
    └── settings/
```

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
