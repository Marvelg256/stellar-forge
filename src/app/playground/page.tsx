"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { stellarComponents } from "@/data/components";

type ComponentSlug =
  | "token"
  | "payment"
  | "access-control"
  | "escrow"
  | "subscription"
  | "multi-signature";

type Network = "testnet" | "futurenet";

const generatedPatterns: Record<ComponentSlug, string> = {
  token: `#[contract]
pub struct TokenComponent;

#[contractimpl]
impl TokenComponent {
    pub fn transfer(
        env: Env,
        to: Address,
        amount: i128,
    ) {
        // implementation
    }
}`,

  payment: `#[contract]
pub struct PaymentComponent;

#[contractimpl]
impl PaymentComponent {
    pub fn pay(
        env: Env,
        to: Address,
        amount: i128,
    ) {
        // implementation
    }
}`,

  "access-control": `#[contract]
pub struct AccessControlComponent;

#[contractimpl]
impl AccessControlComponent {
    pub fn authorize(
        env: Env,
        account: Address,
    ) {
        // permission check
    }
}`,

  escrow: `#[contract]
pub struct EscrowComponent;

#[contractimpl]
impl EscrowComponent {
    pub fn deposit(
        env: Env,
        depositor: Address,
        amount: i128,
    ) {
        // escrow deposit
    }

    pub fn release(
        env: Env,
        recipient: Address,
    ) {
        // conditional release
    }
}`,

  subscription: `#[contract]
pub struct SubscriptionComponent;

#[contractimpl]
impl SubscriptionComponent {
    pub fn subscribe(
        env: Env,
        subscriber: Address,
    ) {
        // create subscription
    }

    pub fn charge(
        env: Env,
        subscriber: Address,
        amount: i128,
    ) {
        // recurring payment
    }
}`,

  "multi-signature": `#[contract]
pub struct MultiSignatureComponent;

#[contractimpl]
impl MultiSignatureComponent {
    pub fn approve(
        env: Env,
        signer: Address,
    ) {
        // record approval
    }

    pub fn execute(
        env: Env,
    ) {
        // execute after required approvals
    }
}`,
};

const defaultValues: Record<
  ComponentSlug,
  {
    name: string;
    symbol: string;
    decimals: string;
    network: Network;
  }
> = {
  token: {
    name: "Forge Token",
    symbol: "FORGE",
    decimals: "7",
    network: "testnet",
  },

  payment: {
    name: "Payment",
    symbol: "XLM",
    decimals: "7",
    network: "testnet",
  },

  "access-control": {
    name: "Admin",
    symbol: "ADMIN",
    decimals: "0",
    network: "testnet",
  },

  escrow: {
    name: "Escrow",
    symbol: "XLM",
    decimals: "7",
    network: "testnet",
  },

  subscription: {
    name: "Subscription",
    symbol: "XLM",
    decimals: "7",
    network: "testnet",
  },

  "multi-signature": {
    name: "Multi-Signature",
    symbol: "XLM",
    decimals: "7",
    network: "testnet",
  },
};

export default function PlaygroundPage() {
  const [selectedSlug, setSelectedSlug] =
    useState<ComponentSlug>("token");

  const [name, setName] = useState(defaultValues.token.name);
  const [symbol, setSymbol] = useState(defaultValues.token.symbol);
  const [decimals, setDecimals] = useState(defaultValues.token.decimals);
  const [network, setNetwork] = useState<Network>(
    defaultValues.token.network,
  );

  const [generatedCode, setGeneratedCode] = useState(
    generatedPatterns.token,
  );

  const selectedComponent =
    stellarComponents.find(
      (component) => component.slug === selectedSlug,
    ) ?? stellarComponents[0];

  function selectComponent(slug: ComponentSlug) {
    const defaults = defaultValues[slug];

    setSelectedSlug(slug);
    setName(defaults.name);
    setSymbol(defaults.symbol);
    setDecimals(defaults.decimals);
    setNetwork(defaults.network);
    setGeneratedCode(generatedPatterns[slug]);
  }

  function generatePattern() {
    let code = generatedPatterns[selectedSlug];

    if (selectedSlug === "token") {
      code = `// ${name} (${symbol})
// Decimals: ${decimals}
// Network: ${network}

${generatedPatterns.token}`;
    }

    if (selectedSlug === "payment") {
      code = `// Payment pattern
// Asset: ${symbol}
// Network: ${network}

${generatedPatterns.payment}`;
    }

    if (selectedSlug === "access-control") {
      code = `// Access control pattern
// Role: ${name}
// Network: ${network}

${generatedPatterns["access-control"]}`;
    }

    if (selectedSlug === "escrow") {
      code = `// Escrow pattern
// Asset: ${symbol}
// Network: ${network}

${generatedPatterns.escrow}`;
    }

    if (selectedSlug === "subscription") {
      code = `// Subscription pattern
// Plan: ${name}
// Asset: ${symbol}
// Network: ${network}

${generatedPatterns.subscription}`;
    }

    if (selectedSlug === "multi-signature") {
      code = `// Multi-signature pattern
// Configuration: ${name}
// Required signers: ${symbol}
// Network: ${network}

${generatedPatterns["multi-signature"]}`;
    }

    setGeneratedCode(code);
  }

  function resetConfiguration() {
    const defaults = defaultValues[selectedSlug];

    setName(defaults.name);
    setSymbol(defaults.symbol);
    setDecimals(defaults.decimals);
    setNetwork(defaults.network);
    setGeneratedCode(generatedPatterns[selectedSlug]);
  }

  const isAccessControl = selectedSlug === "access-control";
  const isMultiSignature = selectedSlug === "multi-signature";

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.18em] text-accent-stellar">
            STELLAR-FORGE / PLAYGROUND
          </p>

          <h1 className="font-display text-3xl font-medium text-text-primary sm:text-4xl">
            Experiment before you integrate.
          </h1>

          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-text-secondary">
            Configure a reusable Soroban component, inspect its inputs and
            generated structure, then take the pattern into your own project.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
          <Card>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                Component
              </p>

              <div className="mt-4 space-y-2">
                {stellarComponents.map((component) => (
                  <button
                    key={component.slug}
                    type="button"
                    onClick={() =>
                      selectComponent(component.slug as ComponentSlug)
                    }
                    className={`w-full rounded-default border px-3 py-3 text-left transition-colors duration-150 ${
                      selectedSlug === component.slug
                        ? "border-accent-stellar"
                        : "border-border hover:border-accent-stellar/60"
                    }`}
                  >
                    <p className="font-display text-sm font-medium text-text-primary">
                      {component.name}
                    </p>

                    <p className="mt-1 font-sans text-xs text-text-secondary">
                      {component.shortDescription}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
                    Selected component
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-medium text-text-primary">
                    {selectedComponent.name}
                  </h2>

                  <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-text-secondary">
                    {selectedComponent.description}
                  </p>
                </div>

                <span className="rounded-default border border-border px-2 py-1 font-mono text-xs text-text-secondary">
                  {selectedComponent.status}
                </span>
              </div>
            </Card>

            <Card>
              <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
                Configuration
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    {isAccessControl
                      ? "Role name"
                      : isMultiSignature
                        ? "Configuration name"
                        : selectedSlug === "subscription"
                          ? "Plan name"
                          : selectedSlug === "escrow"
                            ? "Escrow name"
                            : selectedSlug === "payment"
                              ? "Payment name"
                              : "Token name"}
                  </span>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    {isMultiSignature ? "Required signers" : "Symbol / Asset"}
                  </span>

                  <input
                    type="text"
                    value={symbol}
                    onChange={(event) => setSymbol(event.target.value)}
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    Decimals
                  </span>

                  <input
                    type="number"
                    value={decimals}
                    onChange={(event) => setDecimals(event.target.value)}
                    min="0"
                    max="18"
                    disabled={isAccessControl || isMultiSignature}
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    Network
                  </span>

                  <select
                    value={network}
                    onChange={(event) =>
                      setNetwork(event.target.value as Network)
                    }
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  >
                    <option value="testnet">Stellar Testnet</option>
                    <option value="futurenet">Stellar Futurenet</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary" onClick={generatePattern}>
                  Generate Pattern
                </Button>

                <Button variant="secondary" onClick={resetConfiguration}>
                  Reset
                </Button>
              </div>
            </Card>

            <Card className="font-mono text-xs">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-text-secondary">
                  Generated structure
                </span>

                <span className="text-accent-forge">Ready</span>
              </div>

              <pre className="mt-4 overflow-x-auto leading-relaxed text-text-secondary">
                <code>{generatedCode}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}