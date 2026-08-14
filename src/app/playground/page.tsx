"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type ComponentValue = "token" | "payment" | "access-control";

interface PlaygroundComponent {
  value: ComponentValue;
  label: string;
  description: string;
  category: string;
  defaults: {
    name: string;
    symbol: string;
    decimals: string;
    network: "testnet" | "futurenet";
  };
  code: string;
}

const components: PlaygroundComponent[] = [
  {
    value: "token",
    label: "Token",
    description: "Fungible token pattern",
    category: "Tokens",
    defaults: {
      name: "Forge Token",
      symbol: "FORGE",
      decimals: "7",
      network: "testnet",
    },
    code: `#[contract]
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
  },
  {
    value: "payment",
    label: "Payment",
    description: "Stellar payment pattern",
    category: "Payments",
    defaults: {
      name: "Payment",
      symbol: "XLM",
      decimals: "7",
      network: "testnet",
    },
    code: `#[contract]
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
  },
  {
    value: "access-control",
    label: "Access Control",
    description: "Role and permission checks",
    category: "Security",
    defaults: {
      name: "Admin",
      symbol: "ADMIN",
      decimals: "0",
      network: "testnet",
    },
    code: `#[contract]
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
  },
];

export default function PlaygroundPage() {
  const [selectedValue, setSelectedValue] =
    useState<ComponentValue>("token");

  const [tokenName, setTokenName] = useState("Forge Token");
  const [symbol, setSymbol] = useState("FORGE");
  const [decimals, setDecimals] = useState("7");
  const [network, setNetwork] =
    useState<"testnet" | "futurenet">("testnet");

  const [generatedCode, setGeneratedCode] = useState(
    components[0].code,
  );

  const selectedComponent =
    components.find((component) => component.value === selectedValue) ??
    components[0];

  function selectComponent(value: ComponentValue) {
    const component =
      components.find((item) => item.value === value) ?? components[0];

    setSelectedValue(component.value);
    setTokenName(component.defaults.name);
    setSymbol(component.defaults.symbol);
    setDecimals(component.defaults.decimals);
    setNetwork(component.defaults.network);
    setGeneratedCode(component.code);
  }

  function generatePattern() {
    let code = selectedComponent.code;

    if (selectedValue === "token") {
      code = `// ${tokenName} (${symbol})
// Decimals: ${decimals}
// Network: ${network}

${selectedComponent.code}`;
    }

    if (selectedValue === "payment") {
      code = `// Payment pattern
// Asset: ${symbol}
// Network: ${network}

${selectedComponent.code}`;
    }

    if (selectedValue === "access-control") {
      code = `// Access control pattern
// Role: ${tokenName}
// Network: ${network}

${selectedComponent.code}`;
    }

    setGeneratedCode(code);
  }

  function resetConfiguration() {
    setTokenName(selectedComponent.defaults.name);
    setSymbol(selectedComponent.defaults.symbol);
    setDecimals(selectedComponent.defaults.decimals);
    setNetwork(selectedComponent.defaults.network);
    setGeneratedCode(selectedComponent.code);
  }

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
                {components.map((component) => (
                  <button
                    key={component.value}
                    type="button"
                    onClick={() => selectComponent(component.value)}
                    className={`w-full rounded-default border px-3 py-3 text-left transition-colors duration-150 ${
                      selectedValue === component.value
                        ? "border-accent-stellar"
                        : "border-border hover:border-accent-stellar/60"
                    }`}
                  >
                    <p className="font-display text-sm font-medium text-text-primary">
                      {component.label}
                    </p>

                    <p className="mt-1 font-sans text-xs text-text-secondary">
                      {component.description}
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
                    {selectedComponent.label}
                  </h2>

                  <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-text-secondary">
                    {selectedComponent.description}
                  </p>
                </div>

                <span className="rounded-default border border-border px-2 py-1 font-mono text-xs text-text-secondary">
                  Concept
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
                    {selectedValue === "access-control"
                      ? "Role name"
                      : "Token name"}
                  </span>

                  <input
                    type="text"
                    value={tokenName}
                    onChange={(event) => setTokenName(event.target.value)}
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    Symbol / Asset
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
                    disabled={selectedValue === "access-control"}
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
                      setNetwork(
                        event.target.value as "testnet" | "futurenet",
                      )
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