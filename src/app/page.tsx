import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-5 font-mono text-xs tracking-[0.18em] text-accent-stellar">
              STELLAR-FORGE / SOROBAN TOOLING
            </p>

            <h1 className="max-w-2xl font-display text-5xl font-medium leading-[1.08] tracking-tight text-text-primary sm:text-6xl">
              Build, understand, and reuse Soroban components.
            </h1>

            <p className="mt-6 max-w-xl font-sans text-base leading-7 text-text-secondary sm:text-lg">
              A developer-focused toolkit for discovering reusable Stellar
              building blocks, experimenting with them, and understanding how
              they work before bringing them into your own projects.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/components">
                <Button variant="primary">Explore Components</Button>
              </Link>

              <Link href="/playground">
                <Button variant="secondary">Open Playground</Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-text-secondary">
              <span>Open source</span>
              <span>Soroban</span>
              <span>Developer-first</span>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* Core product areas */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-8">
          <p className="font-mono text-xs tracking-[0.18em] text-accent-stellar">
            THE TOOLKIT
          </p>

          <h2 className="mt-2 font-display text-2xl font-medium text-text-primary sm:text-3xl">
            Everything you need to work with reusable Soroban building blocks.
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="font-mono text-xs text-accent-stellar">01</p>

            <h3 className="mt-2 font-display text-base font-medium text-text-primary">
              Soroban components
            </h3>

            <p className="mt-2 font-sans text-sm leading-6 text-text-secondary">
              Reusable, inspectable building blocks: tokens, payments,
              access control, and more.
            </p>
          </Card>

          <Card>
            <p className="font-mono text-xs text-accent-stellar">02</p>

            <h3 className="mt-2 font-display text-base font-medium text-text-primary">
              Developer playground
            </h3>

            <p className="mt-2 font-sans text-sm leading-6 text-text-secondary">
              Configure a component and see how it behaves before wiring it
              into your own code.
            </p>
          </Card>

          <Card>
            <p className="font-mono text-xs text-accent-stellar">03</p>

            <h3 className="mt-2 font-display text-base font-medium text-text-primary">
              Docs &amp; resources
            </h3>

            <p className="mt-2 font-sans text-sm leading-6 text-text-secondary">
              Implementation notes, usage examples, and links to source for
              every component.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}

function HeroVisual() {
  return (
    <Card className="font-mono text-xs" aria-hidden="true">
      <div className="mb-4 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full border border-border" />
        <span className="h-2.5 w-2.5 rounded-full border border-border" />
        <span className="h-2.5 w-2.5 rounded-full border border-border" />

        <span className="ml-2 text-text-secondary">token.rs</span>
      </div>

      <pre className="overflow-x-auto leading-relaxed text-text-secondary">
        <code>
          <span className="text-accent-stellar">#[contract]</span>
          {"\n"}
          <span className="text-text-primary">pub struct</span>{" "}
          TokenComponent;
          {"\n\n"}
          <span className="text-accent-stellar">#[contractimpl]</span>
          {"\n"}
          <span className="text-text-primary">impl</span> TokenComponent {"{"}
          {"\n  "}
          <span className="text-text-primary">pub fn</span> transfer(env: Env,
          {"\n    "}to: Address, amount: i128) {"{"}
          {"\n    "}...
          {"\n  "}
          {"}"}
          {"\n"}
          {"}"}
        </code>
      </pre>

      <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-text-secondary">
        <span className="h-1.5 w-1.5 rounded-full bg-accent-forge" />
        <span>Ready to run in Playground</span>
      </div>
    </Card>
  );
}