<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Stellar-Forge Project Instructions

## Project Context

Stellar-Forge is a developer platform for discovering, understanding, experimenting with, and reusing Stellar/Soroban building blocks.

The project is currently in the foundation stage. Development should proceed incrementally and avoid introducing unnecessary complexity before it is required.

## Core Principles

When working on Stellar-Forge:

1. Prefer simple, maintainable solutions.
2. Reuse existing components and utilities before creating duplicates.
3. Keep the application responsive across desktop and mobile.
4. Prioritize accessibility.
5. Keep TypeScript strict and type-safe.
6. Avoid unnecessary dependencies.
7. Keep the UI consistent with the established design system.
8. Do not introduce backend infrastructure until the project actually requires it.
9. Do not implement production blockchain transactions when a safe mock/interface is sufficient for the current MVP stage.
10. Verify changes with linting and TypeScript checks before considering a task complete.

## Technology

The current core stack is:

- Next.js
- React
- TypeScript
- Tailwind CSS
- pnpm

Stellar/Soroban tooling will be introduced progressively as the relevant project features are implemented.

## Development Workflow

Before making significant changes:

1. Inspect the existing project structure.
2. Read relevant Next.js documentation in `node_modules/next/dist/docs/` when required.
3. Understand the existing implementation before replacing it.
4. Make the smallest reasonable change that solves the task.
5. Run linting.
6. Run TypeScript checks.
7. Test the affected functionality locally.

Useful commands:

bash
pnpm dev
pnpm lint
pnpm exec tsc --noEmit
pnpm build

## Git Workflow

Keep commits focused and meaningful.

Do not commit:
node_modules
.next
environment secrets
API keys
private credentials
temporary files

Use clear commit messages describing the change.
