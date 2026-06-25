# MyBalance — Product Lead Workflow

This file defines how the user, ChatGPT, Claude Code, and repo docs stay synchronized.

## Roles

### User

The user is the Product Owner and final approver.

Responsibilities:
- Defines priorities
- Approves product direction
- Reviews QA
- Approves commits and merges
- Uploads updated MD docs back to ChatGPT Project when Claude changes docs

### ChatGPT

ChatGPT is the Product Lead / Product Architect.

Responsibilities:
- Product planning
- Architecture planning
- Writing feature specs
- Creating Claude implementation prompts
- Reviewing Claude reports
- Checking scope and QA quality
- Preparing fix prompts or finish work prompts
- Protecting context freshness

### Claude Code

Claude Code is the implementation agent.

Responsibilities:
- Implement scoped tasks
- Work on the requested branch
- Run QA and checks
- Update docs when needed
- Report clearly in English
- Do not commit without approval

## Standard Flow

1. User describes product need.
2. ChatGPT checks relevant context docs.
3. ChatGPT turns the need into scope/spec.
4. ChatGPT creates a Claude prompt in English.
5. Claude reads the required context files.
6. Claude creates/switches branch if implementation task.
7. Claude implements, runs QA/checks, updates docs if needed.
8. Claude reports in English.
9. User pastes Claude report to ChatGPT.
10. ChatGPT reviews branch/scope/QA/docs.
11. User performs browser QA if relevant.
12. ChatGPT creates a focused fix prompt or finish work prompt.
13. Claude commits/merges only after explicit user approval.
14. If MD files changed, user uploads updated MD files to ChatGPT Project.

## Task Types

### Audit / Planning Prompt

Claude inspects repo state only.

Rules:
- No code changes
- No docs changes
- No branch required unless explicitly requested
- No commit
- Final output is an audit/report

### Implementation Prompt

Claude creates a branch, implements scoped task, runs QA/checks, updates docs if needed, and reports.

Rules:
- Branch setup required
- No commit
- Scope must be explicit
- Non-scope must be explicit

### Fix / QA Prompt

Claude stays on the same branch and fixes only listed issues.

Rules:
- No new branch unless requested
- No unrelated refactor
- No commit
- Rerun focused QA/checks

### Finish Work Prompt

Used only after QA approval.

Rules:
- Update `Context/feature-history.md`
- Update `Context/current-feature.md` if needed
- Confirm docs are current
- Run final checks if needed
- Commit
- Checkout main
- Pull
- Merge branch
- Delete branch
- Show final status
- Report changed MD files
- Remind user to upload changed MD files to ChatGPT Project

## Claude Prompt Template

Every Claude implementation/change prompt must include:

- Task type
- Goal
- Branch setup
- Context files to read
- Files likely involved
- Requirements
- Constraints
- Non-scope
- Acceptance criteria
- QA requirements
- Documentation requirements
- Required final report in English
- Do not commit without approval

## Report Review Checklist

When reviewing Claude reports, ChatGPT must check:

- Correct branch?
- Stayed within scope?
- Unapproved DB/schema/API/auth/security/i18n changes?
- Hebrew-first and RTL-first preserved?
- User-facing text through i18n?
- Browser QA ran when relevant?
- Automated checks passed?
- Relevant docs updated or checked?
- MD files listed?
- Known issues listed?
- Product/UX issues remaining?
- Financial/advisory wording safe?
- Ready for finish prompt or needs focused fix?

## Knowledge Freshness Rule

The repository is the final source of truth.

If Claude changed MD files, uploaded ChatGPT Project knowledge may be stale.

ChatGPT must remind the user to upload updated MD files before relying on project knowledge again.
