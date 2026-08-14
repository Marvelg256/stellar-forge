import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";

interface ComponentDetail {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: string;
  overview: string;
  useCases: string[];
}

const components: ComponentDetail[] = [
  {
    slug: "token",
    name: "Token",
    description:
      "A fungible token pattern for issuing and transferring balances on Soroban.",
    category: "Tokens",
    status: "Concept",
    overview:
      "A reusable token pattern for representing balances and transferring value between Stellar addresses through a Soroban contract.",
    useCases: [
      "Issuing a project token",
      "Managing token balances",
      "Transferring tokens between addresses",
    ],
  },
  {
    slug: "payment",
    name: "Payment",
    description:
      "A minimal pattern for building and submitting a Stellar payment.",
    category: "Payments",
    status: "Concept",
    overview:
      "A focused pattern for creating and submitting a Stellar payment while keeping the transaction flow easy to understand and reuse.",
    useCases: [
      "Sending XLM or assets",
      "Building payment transactions",
      "Learning the Stellar payment flow",
    ],
  },
  {
    slug: "access-control",
    name: "Access Control",
    description:
      "Role- and permission-based access checks for a Soroban contract.",
    category: "Security",
    status: "Concept",
    overview:
      "A reusable authorization pattern for controlling which addresses can perform specific actions within a Soroban contract.",
    useCases: [
      "Owner-only contract actions",
      "Role-based permissions",
      "Protecting sensitive contract functions",
    ],
  },
  {
    slug: "escrow",
    name: "Escrow",
    description:
      "Holds funds until a defined condition or set of signers releases them.",
    category: "Payments",
    status: "Concept",
    overview:
      "An escrow pattern for temporarily holding funds until predefined conditions are satisfied and the funds can be released.",
    useCases: [
      "Conditional payments",
      "Buyer and seller agreements",
      "Multi-party fund releases",
    ],
  },
  {
    slug: "subscription",
    name: "Subscription",
    description:
      "A recurring-payment pattern for periodic, agreed-upon transfers.",
    category: "Payments",
    status: "Concept",
    overview:
      "A reusable pattern for representing recurring payments between parties according to an agreed schedule.",
    useCases: [
      "Recurring payments",
      "Membership systems",
      "Periodic service payments",
    ],
  },
  {
    slug: "multi-signature",
    name: "Multi-signature",
    description:
      "Requires multiple approving signers before a transaction executes.",
    category: "Security",
    status: "Concept",
    overview:
      "A multi-signature pattern that requires approval from multiple authorized parties before an action can proceed.",
    useCases: [
      "Shared treasury control",
      "DAO-style approvals",
      "High-value transaction authorization",
    ],
  },
];

export function generateStaticParams() {
  return components.map((component) => ({
    slug: component.slug,
  }));
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const component = components.find((item) => item.slug === slug);

  if (!component) {
    notFound();
  }

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/components"
          className="font-mono text-xs text-text-secondary transition-colors duration-150 hover:text-accent-stellar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
        >
          ← Back to components
        </Link>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
                {component.category}
              </span>

              <span className="rounded-default border border-border px-2 py-0.5 font-mono text-[11px] text-text-secondary">
                {component.status}
              </span>
            </div>

            <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-text-primary sm:text-5xl">
              {component.name}
            </h1>

            <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-text-secondary sm:text-lg">
              {component.description}
            </p>

            <div className="mt-10">
              <h2 className="font-display text-xl font-medium text-text-primary">
                Overview
              </h2>

              <p className="mt-3 max-w-2xl font-sans text-sm leading-7 text-text-secondary">
                {component.overview}
              </p>
            </div>

            <div className="mt-10">
              <h2 className="font-display text-xl font-medium text-text-primary">
                Common use cases
              </h2>

              <ul className="mt-4 space-y-3">
                {component.useCases.map((useCase) => (
                  <li
                    key={useCase}
                    className="flex items-start gap-3 font-sans text-sm leading-6 text-text-secondary"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-forge"
                    />
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Card className="h-fit">
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              Component status
            </p>

            <h2 className="mt-3 font-display text-lg font-medium text-text-primary">
              {component.name}
            </h2>

            <div className="mt-5 space-y-3 border-t border-border pt-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-text-secondary">
                  Category
                </span>

                <span className="font-mono text-xs text-text-primary">
                  {component.category}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm text-text-secondary">
                  Status
                </span>

                <span className="font-mono text-xs text-accent-stellar">
                  {component.status}
                </span>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <p className="font-sans text-sm leading-6 text-text-secondary">
                Implementation, documentation, and playground support will be
                added as Stellar-Forge develops.
              </p>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}