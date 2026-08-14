import Link from "next/link";
import { Card } from "@/components/ui/Card";

const sections = [
  {
    href: "#getting-started",
    number: "01",
    title: "Getting started",
    description:
      "Understand what Stellar-Forge is and how the toolkit is organized.",
  },
  {
    href: "#components",
    number: "02",
    title: "Components",
    description:
      "Learn how reusable Soroban building blocks are structured and documented.",
  },
  {
    href: "#playground",
    number: "03",
    title: "Playground",
    description:
      "Experiment with component configurations before integrating them into a project.",
  },
  {
    href: "#reuse",
    number: "04",
    title: "Reuse in your project",
    description:
      "Take a component pattern from Stellar-Forge and adapt it to your own application.",
  },
];

export default function DocsPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs tracking-[0.18em] text-accent-stellar">
            STELLAR-FORGE / DOCUMENTATION
          </p>

          <h1 className="font-display text-4xl font-medium leading-tight text-text-primary sm:text-5xl">
            Build with understanding.
          </h1>

          <p className="mt-5 font-sans text-base leading-7 text-text-secondary sm:text-lg">
            Learn how Stellar-Forge organizes reusable Soroban patterns,
            experiment with them in the playground, and understand what you
            are integrating before you use it in your own project.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {sections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group block rounded-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
            >
              <Card className="h-full transition-colors duration-200 ease-out group-hover:border-accent-stellar/60 motion-reduce:transition-none">
                <p className="font-mono text-xs text-accent-stellar">
                  {section.number}
                </p>

                <h2 className="mt-2 font-display text-lg font-medium text-text-primary">
                  {section.title}
                </h2>

                <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">
                  {section.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 max-w-3xl space-y-12">
          <section id="getting-started">
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              01 / Getting started
            </p>

            <h2 className="mt-3 font-display text-2xl font-medium text-text-primary">
              Start with the pattern, not the implementation.
            </h2>

            <p className="mt-4 font-sans text-sm leading-7 text-text-secondary">
              Stellar-Forge is designed to help developers discover common
              Stellar and Soroban building blocks, understand the pattern
              behind them, and experiment with their configuration before
              writing them into a project.
            </p>
          </section>

          <section id="components">
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              02 / Components
            </p>

            <h2 className="mt-3 font-display text-2xl font-medium text-text-primary">
              Explore reusable building blocks.
            </h2>

            <p className="mt-4 font-sans text-sm leading-7 text-text-secondary">
              The component catalog contains patterns such as tokens,
              payments, access control, escrow, subscriptions, and
              multi-signature workflows. Each component has its own page where
              its purpose, configuration, and implementation details can be
              explored.
            </p>

            <Link
              href="/components"
              className="mt-5 inline-flex font-mono text-xs text-accent-stellar hover:underline"
            >
              Browse components →
            </Link>
          </section>

          <section id="playground">
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              03 / Playground
            </p>

            <h2 className="mt-3 font-display text-2xl font-medium text-text-primary">
              Experiment before you integrate.
            </h2>

            <p className="mt-4 font-sans text-sm leading-7 text-text-secondary">
              The playground provides an interactive space for configuring
              reusable component patterns and inspecting the structure they
              produce. It is intended to make experimentation easier before
              moving into a real application.
            </p>

            <Link
              href="/playground"
              className="mt-5 inline-flex font-mono text-xs text-accent-stellar hover:underline"
            >
              Open playground →
            </Link>
          </section>

          <section id="reuse">
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              04 / Reuse in your project
            </p>

            <h2 className="mt-3 font-display text-2xl font-medium text-text-primary">
              Understand it, then make it yours.
            </h2>

            <p className="mt-4 font-sans text-sm leading-7 text-text-secondary">
              Stellar-Forge is intended to provide understandable starting
              points rather than opaque abstractions. Once a pattern makes
              sense, you can inspect its implementation, adapt the structure,
              and integrate the parts your application actually needs.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}