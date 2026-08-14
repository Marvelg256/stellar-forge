import { ComponentCard } from "@/components/catalog/ComponentCard";

interface CatalogEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
}

const components: CatalogEntry[] = [
  {
    slug: "token",
    name: "Token",
    description:
      "A fungible token pattern for issuing and transferring balances on Soroban.",
    category: "Tokens",
  },
  {
    slug: "payment",
    name: "Payment",
    description:
      "A minimal pattern for building and submitting a Stellar payment.",
    category: "Payments",
  },
  {
    slug: "access-control",
    name: "Access Control",
    description:
      "Role- and permission-based access checks for a Soroban contract.",
    category: "Security",
  },
  {
    slug: "escrow",
    name: "Escrow",
    description:
      "Holds funds until a defined condition or set of signers releases them.",
    category: "Payments",
  },
  {
    slug: "subscription",
    name: "Subscription",
    description:
      "A recurring-payment pattern for periodic, agreed-upon transfers.",
    category: "Payments",
  },
  {
    slug: "multi-signature",
    name: "Multi-signature",
    description:
      "Requires multiple approving signers before a transaction executes.",
    category: "Security",
  },
];

const categories = ["All", "Tokens", "Payments", "Security"];

export default function ComponentsPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="mb-4 font-mono text-xs tracking-wide text-accent-stellar">
          COMPONENT CATALOG — CONCEPTS, NOT YET IMPLEMENTED
        </p>

        <h1 className="font-display text-3xl font-medium text-text-primary sm:text-4xl">
          Reusable Stellar &amp; Soroban building blocks
        </h1>

        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-text-secondary">
          Each entry below outlines a common Soroban pattern — what it does
          and why you&apos;d reach for it. These are catalog descriptions, not
          finished contract implementations yet; code, docs, and a playground
          for each one are coming in later steps.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            placeholder="Search components..."
            aria-label="Search components"
            className="w-full rounded-default border border-border bg-surface px-4 py-2 font-sans text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar sm:max-w-xs"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className={`rounded-default border px-3 py-1 font-mono text-xs ${
                  category === "All"
                    ? "border-accent-stellar text-accent-stellar"
                    : "border-border text-text-secondary"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {components.map((component) => (
            <ComponentCard
              key={component.slug}
              name={component.name}
              description={component.description}
              category={component.category}
              href={`/components/${component.slug}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}