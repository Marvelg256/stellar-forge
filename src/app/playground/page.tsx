"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SandboxPanel } from "@/components/playground/SandboxPanel";
import {
  getConfigDefaults,
  stellarComponents,
  type ConfigField,
  type StellarComponent,
} from "@/data/components";

function buildGeneratedCode(
  component: StellarComponent,
  values: Record<string, string>,
): string {
  const header = (component.config ?? [])
    .map((field) => `// ${field.label}: ${values[field.key]}`)
    .join("\n");

  if (!component.implementation || !component.interface) {
    return [
      header,
      "",
      "// No implemented interface spec yet.",
      "// This component is currently a catalog concept.",
      "// Its real interface will be defined when the contract lands.",
    ].join("\n");
  }

  const signatures = component.interface
    .map((fn) => {
      const params = fn.params.map((p) => `${p.name}: ${p.type}`).join(", ");
      const returns = fn.returns ? ` -> ${fn.returns}` : "";
      return `    pub fn ${fn.name}(${params})${returns};`;
    })
    .join("\n");

  return [
    header,
    "",
    `// Source: ${component.implementation.sourcePath}`,
    "",
    `#[contract]`,
    `pub struct ${component.name};`,
    "",
    "#[contractimpl]",
    `impl ${component.name} {`,
    signatures,
    "}",
  ].join("\n");
}

export default function PlaygroundPage() {
  const [selectedSlug, setSelectedSlug] = useState<string>("token");
  const [configValues, setConfigValues] = useState<Record<string, string>>(
    () => getConfigDefaults(stellarComponents[0]),
  );
  const [generatedCode, setGeneratedCode] = useState(() =>
    buildGeneratedCode(stellarComponents[0], getConfigDefaults(stellarComponents[0])),
  );

  const selectedComponent =
    stellarComponents.find((component) => component.slug === selectedSlug) ??
    stellarComponents[0];

  function selectComponent(slug: string) {
    const component = stellarComponents.find((c) => c.slug === slug);
    if (!component) return;

    const defaults = getConfigDefaults(component);
    setSelectedSlug(slug);
    setConfigValues(defaults);
    setGeneratedCode(buildGeneratedCode(component, defaults));
  }

  function updateConfigValue(key: string, value: string) {
    setConfigValues((previous) => ({ ...previous, [key]: value }));
  }

  function generatePattern() {
    setGeneratedCode(buildGeneratedCode(selectedComponent, configValues));
  }

  function resetConfiguration() {
    const defaults = getConfigDefaults(selectedComponent);
    setConfigValues(defaults);
    setGeneratedCode(buildGeneratedCode(selectedComponent, defaults));
  }

  function renderConfigField(field: ConfigField) {
    if (field.type === "select") {
      return (
        <select
          value={configValues[field.key]}
          onChange={(event) => updateConfigValue(field.key, event.target.value)}
          disabled={field.disabled}
          className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar disabled:cursor-not-allowed disabled:opacity-50"
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    const isNumber = field.type === "number";

    return (
      <input
        type={field.type}
        value={configValues[field.key]}
        onChange={(event) => updateConfigValue(field.key, event.target.value)}
        min={field.min}
        max={field.max}
        disabled={field.disabled}
        className={`mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar disabled:cursor-not-allowed disabled:opacity-50 ${
          field.mono ? "font-mono" : "font-sans"
        }`}
        {...(isNumber ? { inputMode: "numeric" as const } : {})}
      />
    );
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
                {stellarComponents.map((component) => (
                  <button
                    key={component.slug}
                    type="button"
                    onClick={() => selectComponent(component.slug)}
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
                {(selectedComponent.config ?? []).map((field) => (
                  <label key={field.key} className="block">
                    <span className="font-sans text-sm text-text-primary">
                      {field.label}
                    </span>

                    {renderConfigField(field)}
                  </label>
                ))}
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

            {selectedComponent.status === "Implemented" &&
            (selectedComponent.interface?.length ?? 0) > 0 ? (
              <SandboxPanel
                key={selectedSlug}
                component={selectedComponent}
                configValues={configValues}
              />
            ) : null}

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