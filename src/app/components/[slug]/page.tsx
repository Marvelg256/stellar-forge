import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import {
  getComponentBySlug,
  stellarComponents,
} from "@/data/components";

interface ComponentDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return stellarComponents.map((component) => ({
    slug: component.slug,
  }));
}

export default async function ComponentDetailPage({
  params,
}: ComponentDetailPageProps) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/components"
          className="font-mono text-xs text-text-secondary transition-colors hover:text-accent-stellar"
        >
          ← Back to components
        </Link>

        <div className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              {component.category}
            </span>

            <span className="rounded-default border border-border px-2 py-1 font-mono text-xs text-text-secondary">
              {component.status}
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-text-primary sm:text-5xl">
            {component.name}
          </h1>

          <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-text-secondary sm:text-lg">
            {component.description}
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <Card>
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              Overview
            </p>

            <h2 className="mt-3 font-display text-2xl font-medium text-text-primary">
              Understand the pattern
            </h2>

            <p className="mt-4 font-sans text-sm leading-7 text-text-secondary">
              {component.overview}
            </p>
          </Card>

          <Card>
            <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
              Component status
            </p>

            <div className="mt-4">
              <p className="font-display text-lg font-medium text-text-primary">
                {component.status}
              </p>

              <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">
                {component.status === "Implemented"
                  ? "This component has a real, tested Soroban contract in the Stellar-Forge contracts workspace."
                  : "This component is currently represented as a reusable pattern in the Stellar-Forge catalog."}
              </p>
            </div>
          </Card>
        </div>

        <section className="mt-6">
          <Card>
            <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
              Use cases
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {component.useCases.map((useCase) => (
                <div
                  key={useCase}
                  className="rounded-default border border-border p-4"
                >
                  <p className="font-sans text-sm leading-relaxed text-text-secondary">
                    {useCase}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {component.interface && component.implementation && (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <Card>
              <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
                Public interface
              </p>

              <div className="mt-5 space-y-4">
                {component.interface.map((fn) => {
                  const params = fn.params
                    .map((param) => `${param.name}: ${param.type}`)
                    .join(", ");

                  return (
                    <div
                      key={fn.name}
                      className="rounded-default border border-border p-4"
                    >
                      <p className="font-mono text-xs text-text-primary">
                        <span className="text-accent-stellar">
                          {fn.name}
                        </span>
                        {"("}
                        {params}
                        {")"}
                        {fn.returns ? ` -> ${fn.returns}` : ""}
                      </p>

                      {fn.description && (
                        <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">
                          {fn.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                Implementation
              </p>

              <dl className="mt-4 space-y-4">
                <div>
                  <dt className="font-sans text-sm text-text-primary">
                    Language
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-text-secondary">
                    {component.implementation.language}
                  </dd>
                </div>

                <div>
                  <dt className="font-sans text-sm text-text-primary">
                    Package
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-text-secondary">
                    {component.implementation.package}
                  </dd>
                </div>

                <div>
                  <dt className="font-sans text-sm text-text-primary">
                    Source
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-text-secondary">
                    {component.implementation.sourcePath}
                  </dd>
                </div>

                <div>
                  <dt className="font-sans text-sm text-text-primary">
                    Build target
                  </dt>
                  <dd className="mt-1 font-mono text-xs text-text-secondary">
                    {component.implementation.buildTarget}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        )}

        <section className="mt-6">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                  Next step
                </p>

                <h2 className="mt-2 font-display text-xl font-medium text-text-primary">
                  Experiment with this pattern
                </h2>

                <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-text-secondary">
                  Open the playground to configure the pattern and inspect its
                  generated structure before integrating it into a project.
                </p>
              </div>

              <Link
                href="/playground"
                className="rounded-default border border-accent-stellar px-4 py-2 font-mono text-xs text-accent-stellar transition-colors hover:bg-accent-stellar/10"
              >
                Open Playground →
              </Link>
            </div>
          </Card>
        </section>
      </section>
    </main>
  );
}