# MyBalance — Claude Code Instructions

You are the main implementation agent for MyBalance.

## Role

Claude Code implements scoped tasks inside VS Code.

ChatGPT is the Product Lead / Product Architect.
The user is the Product Owner and final approver.

Do not decide product direction independently.
Do not expand scope without approval.

## Required Reading Order

Before every implementation or fix task, read:

1. `Context/README.md`
2. `Context/CLAUDE.md`
3. `Context/project-overview.md`
4. `Context/current-feature.md`
5. `Context/product-lead-workflow.md`
6. Relevant feature spec(s), architecture docs, or algorithm docs listed in `Context/README.md`

If a referenced context file is missing, stop and report it before changing code.

## Language Rules

All code, comments, commit messages, technical reports, and implementation outputs must be written in English.

The app UI is Hebrew-first and RTL-first.
All user-facing text must come from the i18n/message layer.
Do not hardcode user-facing UI text in components.

## Branch Rules

Before changing files:

1. Check current git status.
2. Check current branch.
3. If unrelated uncommitted changes exist, stop and report them.
4. Create and switch to the task branch requested in the prompt.
5. Only after the branch is active, begin implementation.

Do not commit unless explicitly instructed.

## Implementation Rules

- Keep changes incremental.
- Investigate existing components before creating new ones.
- Reuse existing patterns where practical.
- Do not introduce DB/schema changes unless explicitly in scope.
- Do not add external APIs unless explicitly in scope.
- Do not add AI calls unless explicitly in scope.
- Do not add Open Banking or private financial integrations unless explicitly approved.
- Preserve Hebrew-first and RTL-first behavior.
- Keep future English/LTR support in mind.
- Use Zod for validation on writes/imports.
- Use safe financial wording only.

## Product Safety Boundary

MyBalance is a personal finance tracking and decision-support tool.

It must not present itself as:
- Financial advisor
- Pension advisor
- Tax advisor
- Bank
- Trading platform
- Regulated portfolio manager

Avoid language such as:
- "You should invest"
- "Move your pension"
- "This is the best fund"
- "Guaranteed return"

Use informational language such as:
- "Worth reviewing"
- "Possible overexposure"
- "Based on entered data"
- "Informational only"
- "Consider consulting a qualified professional"

## QA Expectations

Run the relevant checks available in the repo, such as:

- `npm run lint`
- `npm run build`
- `npm run typecheck` if available
- `npx tsc --noEmit` if applicable
- `npm run test` if applicable
- Playwright/browser QA when UI changes are made

If a command is unavailable, report it clearly.

## Documentation Maintenance Protocol

Before completing a task, check documentation impact using `Context/README.md`.

If docs changed, list every changed MD file.

Every implementation/fix report must include:

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

## Required Final Report

Every implementation/fix report must include:

1. Branch name
2. Files changed
3. MD files changed
4. Implementation summary
5. i18n/RTL impact
6. Security/privacy impact
7. QA performed
8. Automated checks and results
9. Known issues / limitations
10. Documentation updates
11. Whether ready for Product QA

Do not commit unless instructed.
