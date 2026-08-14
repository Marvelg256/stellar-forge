"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const components = [
  {
    value: "token",
    label: "Token",
    description: "Fungible token pattern",
  },
  {
    value: "payment",
    label: "Payment",
    description: "Stellar payment pattern",
  },
  {
    value: "access-control",
    label: "Access Control",
    description: "Role and permission checks",
  },
];

const componentDetails = {
  token: {
    title: "Token",
    description:
      "Configure the basic parameters for a fungible token component.",
    status: "Concept",
  },
  payment: {
    title: "Payment",
    description:
      "Configure the basic parameters for a Stellar payment component.",
    status: "Concept",
  },
  "access-control": {
    title: "Access Control",
    description:
      "Configure the basic parameters for role and permission checks.",
    status: "Concept",
  },
};

const codeTemplates = {
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
    pub fn send(
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
    pub fn require_role(
        env: Env,
        address: Address,
        role: Symbol,
    ) {
        // implementation
    }
}`,
};

type ComponentValue = keyof typeof componentDetails;

const defaultConfig = {
  name: "Forge Token",
  symbol: "FORGE",
  decimals: "7",
  network: "testnet",
};

export default function PlaygroundPage() {
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentValue>("token");

  const [name, setName] = useState(defaultConfig.name);
  const [symbol, setSymbol] = useState(defaultConfig.symbol);
  const [decimals, setDecimals] = useState(defaultConfig.decimals);
  const [network, setNetwork] = useState(defaultConfig.network);
  const [generated, setGenerated] = useState(false);

  const details = componentDetails[selectedComponent];
  const code = codeTemplates[selectedComponent];

  function handleComponentChange(value: ComponentValue) {
    setSelectedComponent(value);
    setGenerated(false);

    if (value === "token") {
      setName("Forge Token");
      setSymbol("FORGE");
      setDecimals("7");
    } else if (value === "payment") {
      setName("Forge Payment");
      setSymbol("PAY");
      setDecimals("7");
    } else {
      setName("Forge Access");
      setSymbol("ROLE");
      setDecimals("0");
    }
  }

  function handleGenerate() {
    setGenerated(true);
  }

  function handleReset() {
    setSelectedComponent("token");
    setName(defaultConfig.name);
    setSymbol(defaultConfig.symbol);
    setDecimals(defaultConfig.decimals);
    setNetwork(defaultConfig.network);
    setGenerated(false);
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
                {components.map((component) => {
                  const isSelected =
                    selectedComponent === component.value;

                  return (
                    <button
                      key={component.value}
                      type="button"
                      onClick={() =>
                        handleComponentChange(
                          component.value as ComponentValue,
                        )
                      }
                      className={`w-full rounded-default border px-3 py-3 text-left transition-colors duration-150 ease-out ${
                        isSelected
                          ? "border-accent-stellar"
                          : "border-border hover:border-accent-stellar/60"
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar motion-reduce:transition-none`}
                    >
                      <p className="font-display text-sm font-medium text-text-primary">
                        {component.label}
                      </p>

                      <p className="mt-1 font-sans text-xs text-text-secondary">
                        {component.description}
                      </p>
                    </button>
                  );
                })}
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
                    {details.title}
                  </h2>

                  <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-text-secondary">
                    {details.description}
                  </p>
                </div>

                <span className="rounded-default border border-border px-2 py-1 font-mono text-xs text-text-secondary">
                  {details.status}
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
                    Component name
                  </span>

                  <input
                    type="text"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setGenerated(false);
                    }}
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    Symbol
                  </span>

                  <input
                    type="text"
                    value={symbol}
                    onChange={(event) => {
                      setSymbol(event.target.value);
                      setGenerated(false);
                    }}
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
                    onChange={(event) => {
                      setDecimals(event.target.value);
                      setGenerated(false);
                    }}
                    min="0"
                    max="18"
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  />
                </label>

                <label className="block">
                  <span className="font-sans text-sm text-text-primary">
                    Network
                  </span>

                  <select
                    value={network}
                    onChange={(event) => {
                      setNetwork(event.target.value);
                      setGenerated(false);
                    }}
                    className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                  >
                    <option value="testnet">Stellar Testnet</option>
                    <option value="futurenet">Stellar Futurenet</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                >
                  Generate Pattern
                </Button>

                <Button
                  variant="secondary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </div>
            </Card>

            <Card className="font-mono text-xs">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <span className="text-text-secondary">
                  Generated structure
                </span>

                <span
                  className={
                    generated
                      ? "text-accent-forge"
                      : "text-text-secondary"
                  }
                >
                  {generated ? "Generated" : "Ready"}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-text-secondary">
                <span>
                  Name: <span className="text-text-primary">{name}</span>
                </span>

                <span>
                  Symbol:{" "}
                  <span className="text-text-primary">{symbol}</span>
                </span>

                <span>
                  Network:{" "}
                  <span className="text-text-primary">
                    {network === "testnet"
                      ? "Testnet"
                      : "Futurenet"}
                  </span>
                </span>
              </div>

              <pre className="mt-5 overflow-x-auto leading-relaxed text-text-secondary">
                <code>{code}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}