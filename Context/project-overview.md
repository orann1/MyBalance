# MyBalance — Project Overview

## Product Name

MyBalance

## Product Summary

MyBalance is a Hebrew-first, RTL-first personal net worth and financial tracking application for Israeli users.

It helps individuals or households manage their full financial picture in one place:

- Cash
- Bank accounts
- Investment portfolios
- Pension funds
- Keren Hishtalmut
- Kupat Gemel
- Gemel LeHashkaa
- Real estate
- Other assets
- Mortgage
- Loans
- Credit card debt
- Other liabilities
- Net worth history
- Financial goals

## Primary Product Question

What is my full financial picture right now?

## Secondary Product Questions

- How is my net worth changing over time?
- What is driving the change?
- Where is my money allocated?
- Where am I overexposed?
- How much liquidity do I have?
- How close am I to my financial goals?
- How are my pension/gemel/hishtalmut tracks performing?

## Target Audience

Initial audience:
- Israeli individuals
- Israeli households
- Users who want one clear dashboard for all assets and liabilities
- Users who manually track finances today in spreadsheets

## MVP Strategy

Start manual-first.

Do not begin with bank integrations or Open Banking.

Initial phases:

1. Static Hebrew/RTL dashboard with mock data
2. Manual accounts, assets, and liabilities
3. Net worth snapshots
4. Pension/Gemel public data sync via Data.gov.il
5. Goals and allocation analysis
6. Import/export workflows

## Product Boundary

MyBalance is not:
- A financial advisor
- Pension advisor
- Tax advisor
- Trading platform
- Bank
- Regulated portfolio manager

MyBalance should provide tracking, visibility, analysis, and informational insights only.

## Israeli Context

Default assumptions:

- Default locale: Hebrew (`he`)
- Default direction: RTL
- Default currency: ILS
- Default number/date locale: `he-IL`
- Future English/LTR support prepared from day one.

Important Israeli asset types:

- Bank cash
- Israeli brokerage account
- Foreign brokerage account
- Pension fund
- Keren Hishtalmut
- Kupat Gemel
- Gemel LeHashkaa
- Real estate
- Mortgage
- Loans
- Credit card debt

## Core Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- next-intl
- Zod
- React Hook Form
- Recharts
- TanStack Table
- date-fns
- Auth.js
- Vercel Cron
- Playwright
- Vitest

## Related Docs

- `Context/README.md`
- `Context/current-feature.md`
- `Context/data-model.md`
- `Context/security-and-privacy.md`
- `Context/i18n-and-localization.md`
