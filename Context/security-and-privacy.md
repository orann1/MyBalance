# MyBalance — Security and Privacy

## Sensitivity

MyBalance stores sensitive personal financial data.

Treat the following as sensitive:

- Account balances
- Asset values
- Liability balances
- Net worth
- Financial goals
- Institution names
- Uploaded financial files
- Imported statements
- User identity
- Managed savings balances and notes (Phase 2B+)
- Managed savings group names and free-text ownership labels (Phase 2D-2A) — personal financial categorization, treated with the same sensitivity as balances/notes: not logged unnecessarily, not exposed in URLs

## Core Rules

- Do not log sensitive financial values unnecessarily.
- Do not expose balances in URLs.
- Do not store secrets in the repository.
- Do not send private financial data to AI providers unless explicitly designed and approved.
- Use authentication before storing real user data.
- Use server-side validation for every write.
- Use source/freshness timestamps for financial data.

## AI Boundary

AI may help summarize or explain data only if explicitly enabled.

AI must not:
- Recommend investments
- Recommend pension transfers
- Provide tax advice
- Make regulated financial decisions
- Claim guaranteed outcomes

## Public Data

PensionNet/GemelNet data is public fund-level data.
It is not personal user financial data unless combined with user-entered balances.

### Phase 2C-3B — Public Fund Linking

`ManagedSavingsHolding` may carry an optional, user-confirmed `publicFundId` link to a `PublicFund` record:

- The link is identity-only (fund id, fund name, managing company, source, latest report period) plus fund-level public return metrics. AUM is never displayed or stored on the link.
- The link is created only via explicit user action (`linkManagedSavingsHoldingToPublicFund`) from `EditManagedFundModal` — never inferred or set automatically by sync.
- Linking/unlinking never changes the holding's balance, contributions, fees, or notes — only `publicFundId` is updated.
- A linked `ManagedSavingsHolding` creates a combined personal context (personal balance + public fund identity). This combined context must not be logged unnecessarily. Server actions do not log personal balance values alongside linked fund IDs. No personal data is sent to external services.
- Link/unlink server actions are ownership-checked against the dev user (same pattern as other managed savings writes) and reject operations on holdings the dev user does not own or that are archived.
- Server action error responses are a closed, generic union (`"validation" | "not_found" | "unauthorized" | "server_error"`) — no DB error messages or stack traces are returned to the client, and personal balances/notes are not logged.
- Public fund returns are never presented as the user's personal return. The linked fund's `latestAnnualized5YrReturn` is used only as a projection assumption (`getEffectiveAnnualReturn`) — clearly distinguished from personal realized returns. The mock/fallback public performance card is unchanged by this phase.
- No personal data is sent to Data.gov.il or any external service — the matching UI searches the local DB only (Phase 2C-3A backend).

### Phase 2F-2 — Fund Scenario Comparison (COMPLETED)

The comparison modal (internal name: Fund Replacement Simulator) combines personal data (current balance, monthly contribution, personal management fee) with public fund-level data (a candidate fund's public return/fee) to compute an informational projection comparison:

- The combined result is treated with the same sensitivity as any other personal-plus-public-fund context (see the Phase 2C-3B rule above) — not logged, not placed in URLs, not persisted, no analytics.
- Nothing computed by the simulator is written to the database; there is no "saved simulation" record.
- No Data.gov.il or other external calls are made by the simulator — all data comes from the already-loaded holding and the already-computed Similar Tracks Comparison peer data.
- The candidate's public average management fee is never presented as a fee guaranteed or available to the user, and the candidate's projected value is never labeled as a recommendation.
- **QA fix round (2026-07-16)**: the product-facing name was changed from "Fund Replacement Simulator" to "Fund Scenario Comparison" (Hebrew: "השוואת תרחישי קרנות") to remove any switch/replacement framing from user-facing text. Result wording uses neutral "under these assumptions, the compared fund scenario is higher/lower by X" phrasing, and a short explicit disclaimer states the information is "not a recommendation to switch funds." No behavior/data-handling change — wording and layout only.

## Phase 2B — Managed Savings Persistence

Once Phase 2B persists managed savings holdings to the database:

- Managed savings balances and notes are sensitive personal financial data.
- Do not log balances or notes unnecessarily.
- Do not expose balances or notes in URLs.
- Phase 2B is single-user/dev only — there is no multi-user isolation yet.
- Before production or multi-user use, Auth.js, per-user authorization, and user isolation are required.

## Future Requirements

Before multi-user production:
- Authentication
- Authorization
- Per-user data isolation
- Backup strategy
- Audit trail for changes
- Rate limiting on write endpoints
- Secure import pipeline
