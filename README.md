# Stellar-Forge

> A developer platform for discovering, understanding, experimenting with, and reusing Stellar/Soroban building blocks.

Stellar-Forge is an open-source developer platform designed to make building on the Stellar ecosystem easier, faster, and more accessible.

The project aims to provide developers with a centralized place to discover reusable Stellar/Soroban components, understand how they work, experiment with them, and eventually integrate them into their own applications.

## Vision

Make Stellar development more accessible by turning commonly used building blocks into discoverable, understandable, and reusable components.

## MVP

The first version of Stellar-Forge will focus on:

- [ ] Landing page
- [ ] Component Library
- [ ] 5–10 reusable Stellar/Soroban components
- [ ] Interactive component documentation
- [ ] Search and filtering
- [ ] Interactive Playground
- [ ] Wallet connection interface
- [ ] Transaction builder interface/mock
- [ ] GitHub authentication or initial placeholder
- [ ] Responsive design
- [ ] Contribution guide

### Not in the initial MVP

The following features are intentionally deferred:

- Full component marketplace
- AI-powered development features
- Complex deployment workflows
- Complete backend integrations
- Advanced analytics
- Full production wallet infrastructure

These may be considered in later phases.

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Package Manager

- pnpm

### Development Tools

- Git
- GitHub
- VS Code

### Stellar Ecosystem

- Stellar
- Soroban
- Stellar SDK / tooling as required during development

Additional technologies will be introduced only when they become necessary for the project.

## Project Structure

The project currently follows a Next.js App Router structure.

stellar-forge/
├── public/
├── src/
│ └── app/
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── postcss.config.mjs
├── README.md
└── tsconfig.json

## Local Development

### Requirements

Make sure the following are installed:
Node.js
pnpm
Git
Install dependencies
pnpm install
Start the development server
pnpm dev

Then open:
http://localhost:3000
Run linting
pnpm lint
Run TypeScript checks
pnpm exec tsc --noEmit
Create a production build
pnpm build
Development Principles

Stellar-Forge will be developed incrementally.

We will prioritize:
Working software
Clean and understandable code
Good developer experience
Reusable components
Documentation
Accessibility
Responsive design
Security
Maintainability

New technologies and dependencies should only be introduced when they solve a clear project requirement.

## Project Roadmap

### Phase 0 — Planning & Environment

Define project idea
Define project vision
Define MVP scope
Prepare development environment
Configure Git
Configure GitHub
Create GitHub repository
Initialize project
Verify Next.js development server
Verify linting
Verify TypeScript

### Phase 1 — Foundation

Clean project documentation
Establish project structure
Create initial application shell
Establish design direction
Create navigation structure
Create reusable UI foundations
Build initial landing page
Establish component architecture

### Phase 2 — Component Library

Define component data model
Create component catalog
Add initial Stellar/Soroban components
Create component detail pages
Add search
Add filtering

### Phase 3 — Playground

Design playground interface
Add code/editor area
Add configuration controls
Add wallet connection interface
Add transaction builder
Connect appropriate Stellar tooling

### Phase 4 — Documentation & Developer Experience

Improve documentation
Add usage examples
Add contribution guide
Add GitHub integration
Improve accessibility
Improve responsive behavior

### Phase 5 — Testing & Production Preparation

Functional testing
Type checking
Linting
Performance review
Security review
Production build
Deployment preparation

## Milestones

### Milestone 3 — Local Playground Execution (COMPLETE)

Milestone 3 established the first complete real local Soroban execution
loop in Stellar-Forge: the browser playground executes the real token
contract in an isolated Soroban Host on the local machine, with no network,
wallet, or external services involved.

Verified architecture:

```text
Browser Playground
    ↓
POST /api/playground
    ↓
execFile(sandbox-runner.exe)
    ↓
real token.wasm
    ↓
Soroban Host
    ↓
actual contract execution
    ↓
structured JSON result/error
    ↓
Playground UI
```

#### Part 1 — Real Rust sandbox runner (COMPLETE)

- Completed and validated.
- Rust `sandbox-runner` executes the real `token.wasm` locally.
- Uses the Soroban Host / test VM architecture, with a fresh, isolated
  environment per execution.
- Produces structured JSON results and errors.
- Deterministic sandbox identities (`admin`, `user1`, `user2`, `deployer`).

#### Part 2 — Next.js API bridge (COMPLETE)

- Completed and validated.
- `POST /api/playground` invokes `sandbox-runner.exe` via `execFile`.
- Constructor and contract calls are validated and passed to the local
  runner over stdin.
- Real execution results and errors are returned to the browser as
  structured JSON.
- The WASM path is resolved server-side; it is never accepted from the
  browser.

#### Part 3 — Playground integration (COMPLETE)

- Completed and manually verified in the browser.
- The existing data-driven playground now includes a local sandbox
  execution area (`SandboxPanel`).
- Uses the shared component model in `src/data/components.ts`.
- Token operations are exposed from the existing interface metadata.
- Supports: initialize/constructor, mint, transfer, balance.
- Existing configuration is preserved: name, symbol, decimals, network.
- Configuration is mapped into the API constructor request.
- The UI maintains a local operation history and replays it as
  constructor → previous calls → current call for each execution, keeping
  the operation sequence continuous within each fresh sandbox environment.
- Successful results and returned values are displayed.
- Contract errors are displayed as the actual API/runner/contract errors;
  no fake success is produced.
- API/runner errors are distinguished from contract execution errors.
- Duplicate execution is guarded while an operation is running.
- Reset Sandbox clears the local execution history.

Manual browser verification completed:

- Configuration: Name "Forge Token", Symbol "FORGE", Decimals 7.
- Successful demonstration: Initialize → Mint 1000 → Transfer 600 →
  Balance, verified balance result 600.
- Failure demonstration: transfer greater than the available balance,
  verified that the actual contract error was returned and displayed, with
  no fake success produced.

Validation completed:

- `pnpm.cmd lint`
- `pnpm.cmd exec tsc --noEmit`
- `pnpm.cmd build`
- Browser `/playground` manual testing
- Successful execution flow
- Genuine contract failure flow
- Loading/running state
- Duplicate submission protection

Files involved in Milestone 3 implementation:

- `src/components/playground/SandboxPanel.tsx` — new local execution UI
  component
- `src/app/playground/page.tsx` — integrates the sandbox panel into the
  existing playground
- `src/app/api/playground/route.ts` — minimal validation fix required
  because constructor-only execution legitimately sends `calls: []`
- The Rust runner was not modified during Part 3
- `src/data/components.ts` was not modified

#### Architectural note

The API/runner execution model is stateless per request, so the playground
replays the complete local operation history against a fresh execution
environment for each API request. This preserves honest execution
continuity without pretending that browser-side state is contract state.

Known behavior: if an operation fails, the failed operation remains in the
replay history. Subsequent operations therefore reproduce the failure
until the sandbox is reset. This is intentional and keeps execution
deterministic and honest.

Contributions will eventually be welcomed from developers interested in the Stellar ecosystem.

Contribution guidelines will be added as the project matures.

License

License information will be added before the project reaches its public release stage.
