import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 font-mono text-xs tracking-wide text-accent-stellar">
              SOROBAN COMPONENT LIBRARY — TESTNET
            </p>

            <h1 className="font-display text-4xl font-medium leading-tight text-text-primary sm:text-5xl">
              Build on Stellar without starting from zero.
            </h1>

            <p className="mt-5 max-w-md font-sans text-base leading-relaxed text-text-secondary">
              Stellar-Forge is an open-source library of reusable Soroban
              components, paired with documentation and an interactive
              playground — so you can understand a pattern, try it, and reuse
              it in your own project.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button variant="primary">Explore Components</Button>
              <Button variant="secondary">Open Playground</Button>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <p className="font-mono text-xs text-accent-stellar">01</p>

            <h2 className="mt-2 font-display text-base font-medium text-text-primary">
              Soroban components
            </h2>

            <p className="mt-2 font-sans text-sm text-text-secondary">
              Reusable, inspectable building blocks — tokens, payments,
              access control, and more.
            </p>
          </Card>

          <Card>
            <p className="font-mono text-xs text-accent-stellar">02</p>

            <h2 className="mt-2 font-display text-base font-medium text-text-primary">
              Developer playground
            </h2>

            <p className="mt-2 font-sans text-sm text-text-secondary">
              Configure a component and see how it behaves before wiring it
              into your own code.
            </p>
          </Card>

          <Card>
            <p className="font-mono text-xs text-accent-stellar">03</p>

            <h2 className="mt-2 font-display text-base font-medium text-text-primary">
              Docs &amp; resources
            </h2>

            <p className="mt-2 font-sans text-sm text-text-secondary">
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
          <span className="text-text-primary">pub struct</span> TokenComponent;
          {"\n\n"}
          <span className="text-accent-stellar">#[contractimpl]</span>
          {"\n"}
          <span className="text-text-primary">impl</span> TokenComponent {"{"}
          {"\n  "}
          <span className="text-text-primary">pub fn</span> transfer(env: Env,
          to: Address, amount: i128) {"{"}
          {"\n    "}...{"\n  "}
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