# MyBalance Context Routing Map

This file is the primary routing map for ChatGPT and Claude Code.

Do not read every file for every task.
Use this file to decide which context files are relevant.

## Always Read First

For every implementation or product-planning task:

1. `Context/CLAUDE.md`
2. `Context/project-overview.md`
3. `Context/current-feature.md`
4. `Context/product-lead-workflow.md`
5. The relevant feature spec or algorithm file listed below

## Product and Workflow Docs

| File | Purpose |
|---|---|
| `Context/project-overview.md` | Product vision, MVP strategy, product boundaries, tech stack |
| `Context/current-feature.md` | Active phase, current scope, non-scope, acceptance criteria |
| `Context/product-lead-workflow.md` | How user, ChatGPT, Claude, and repo docs work together |
| `Context/CLAUDE.md` | Permanent implementation rules for Claude Code |
| `Context/coding-standards.md` | Code, quality, testing, i18n, financial-data standards |
| `Context/feature-history.md` | Completed phases and historical decisions only |
| `Context/security-and-privacy.md` | Privacy, sensitive financial data, AI and logging boundaries |
| `Context/i18n-and-localization.md` | Hebrew-first, RTL-first, future English/LTR rules |

## Architecture and Data Docs

| Work type | Read these files |
|---|---|
| DB/schema/domain model | `Context/data-model.md` |
| Public data sources | `Context/api-data-sources.md` |
| Scheduled/manual sync | `Context/sync-workflows.md` + `Context/api-data-sources.md` |
| Net worth calculations | `Context/Algorithms/net-worth-calculation.md` |
| Allocation analysis | `Context/Algorithms/allocation-analysis.md` |
| Pension/Gemel return calculations | `Context/Algorithms/pension-return-calculation.md` |

## Feature Routing

| Work type | Read these files |
|---|---|
| Dashboard | `Context/Features/dashboard-feature-spec.md` |
| Accounts | `Context/Features/accounts-feature-spec.md` |
| Assets | `Context/Features/assets-feature-spec.md` |
| Liabilities | `Context/Features/liabilities-feature-spec.md` |
| Pension/Gemel sync | `Context/Features/pension-gemel-sync-feature-spec.md` |
| Net worth snapshots | `Context/Features/net-worth-snapshots-feature-spec.md` |
| Goals | `Context/Features/goals-feature-spec.md` |
| Import/export | `Context/Features/import-export-feature-spec.md` |
| Admin tools | `Context/Features/admin-feature-spec.md` |

## Documentation Update Map

If Claude changes this area, update/check these docs:

| Changed area | Update/check |
|---|---|
| Prisma schema / domain model | `Context/data-model.md` |
| Dashboard behavior | `Context/Features/dashboard-feature-spec.md` |
| Account behavior | `Context/Features/accounts-feature-spec.md` |
| Asset behavior | `Context/Features/assets-feature-spec.md` |
| Liability behavior | `Context/Features/liabilities-feature-spec.md` |
| Pension/Gemel sync | `Context/Features/pension-gemel-sync-feature-spec.md`, `Context/api-data-sources.md`, `Context/sync-workflows.md` |
| Net worth snapshots | `Context/Features/net-worth-snapshots-feature-spec.md`, `Context/Algorithms/net-worth-calculation.md` |
| Goals | `Context/Features/goals-feature-spec.md` |
| Import/export | `Context/Features/import-export-feature-spec.md` |
| Admin tools | `Context/Features/admin-feature-spec.md` |
| i18n / RTL / locale routing | `Context/i18n-and-localization.md`, `Context/coding-standards.md` |
| Security/privacy/auth | `Context/security-and-privacy.md` |
| Calculation logic | Relevant file under `Context/Algorithms/` |
| Active phase completed | `Context/feature-history.md` and `Context/current-feature.md` |
| Workflow changed | `Context/product-lead-workflow.md`, `Context/CLAUDE.md`, this README |

## Required Documentation Report

Every Claude implementation/fix report must include:

```md
## Documentation Updates

Updated:
- ...

Checked but not updated:
- ...

Reason:
- ...

MD files changed:
- ...
```

If MD files changed, the user must upload the updated files to the ChatGPT Project before relying on project knowledge again.

## Knowledge Freshness Rule

The repository is the final source of truth.

Uploaded ChatGPT Project files may become stale after Claude changes MD files in the repo.

If uploaded docs may be stale, say so clearly and rely on the latest Claude report until the updated files are uploaded.
