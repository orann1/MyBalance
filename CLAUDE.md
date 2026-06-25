# Claude Entry Point — MyBalance

Before working on this repository, read the project context files in this order:

1. `Context/README.md`
2. `Context/CLAUDE.md`
3. `Context/project-overview.md`
4. `Context/current-feature.md`
5. `Context/product-lead-workflow.md`

Then read the relevant feature spec, architecture doc, or algorithm doc listed in `Context/README.md`.

The full Claude Code instructions live in:

`Context/CLAUDE.md`

## Required Rules

- Do not change files before following the branch rules in `Context/CLAUDE.md`.
- Do not commit without explicit user approval.
- Do not decide product direction independently.
- Do not expand scope without approval.
- Preserve Hebrew-first and RTL-first behavior.
- Do not hardcode user-facing UI text in components.
- Use translation/message files for all visible UI text.
- Keep implementation reports in English.
- Report all changed MD files.
- If documentation files change, remind the user to upload the updated MD files to the ChatGPT Project.

## Project Source of Truth

The repository documentation under `Context/` is the source of truth.

If there is a conflict between this root file and `Context/CLAUDE.md`, follow `Context/CLAUDE.md`.

If a referenced context file is missing, stop and report it before changing code.