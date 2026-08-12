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

Contributions will eventually be welcomed from developers interested in the Stellar ecosystem.

Contribution guidelines will be added as the project matures.

License

License information will be added before the project reaches its public release stage.
