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
