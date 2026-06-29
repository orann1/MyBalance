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
