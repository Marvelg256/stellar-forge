"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MethodSelector } from "@/components/transactions/MethodSelector";
import { ParameterForm } from "@/components/transactions/ParameterForm";
import { TransactionPreview } from "@/components/transactions/TransactionPreview";
import { stellarComponents } from "@/data/components";
import {
  buildPreview,
  buildTransactionRequest,
  callableMethods,
  emptyParameters,
  implementedComponents,
  initialBuilderState,
  validateBuilderState,
} from "@/lib/transactions/builder";
import { prepareTransaction } from "@/lib/transactions/prepare";
import {
  TRANSACTION_NETWORKS,
  type TransactionNetwork,
} from "@/lib/transactions/networks";
import type {
  TransactionBuilderState,
  TransactionPreparation,
} from "@/lib/transactions/types";

const selectClass =
  "mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar";

const inputClass =
  "mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar";

const implemented = implementedComponents(stellarComponents);

export function TransactionBuilder() {
  const [state, setState] = useState<TransactionBuilderState>(() =>
    initialBuilderState(stellarComponents),
  );
  const [preparation, setPreparation] = useState<TransactionPreparation>({
    phase: "draft",
  });

  const selectedComponent =
    implemented.find((component) => component.slug === state.componentSlug) ??
    implemented[0];
  const selectedMethod = callableMethods(selectedComponent).find(
    (fn) => fn.name === state.methodName,
  );
  const validation = validateBuilderState(state, stellarComponents);
  const preview = buildPreview(state, stellarComponents, preparation);

  function selectComponent(slug: string) {
    const component = implemented.find(
      (candidate) => candidate.slug === slug,
    );
    if (!component) return;

    const method = callableMethods(component)[0];

    setState((previous) => ({
      ...previous,
      componentSlug: component.slug,
      methodName: method?.name ?? "",
      parameters: method ? emptyParameters(method.params) : {},
    }));
    setPreparation({ phase: "draft" });
  }

  function selectMethod(methodName: string) {
    const component = implemented.find(
      (candidate) => candidate.slug === state.componentSlug,
    );
    if (!component) return;

    const method = callableMethods(component).find(
      (fn) => fn.name === methodName,
    );
    if (!method) return;

    setState((previous) => ({
      ...previous,
      methodName: method.name,
      parameters: emptyParameters(method.params),
    }));
    setPreparation({ phase: "draft" });
  }

  function updateParameter(name: string, value: string) {
    setState((previous) => ({
      ...previous,
      parameters: { ...previous.parameters, [name]: value },
    }));
    setPreparation({ phase: "draft" });
  }

  async function build() {
    const request = buildTransactionRequest(state);
    setPreparation({ phase: "built", request });

    const result = await prepareTransaction(request, stellarComponents);
    setPreparation(
      result.status === "prepared"
        ? { phase: "prepared", result }
        : { phase: "failed", result },
    );
  }

  function reset() {
    setState(initialBuilderState(stellarComponents));
    setPreparation({ phase: "draft" });
  }

  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
            Builder
          </p>

          <div className="mt-5 space-y-5">
            <MethodSelector
              components={implemented}
              selectedComponent={selectedComponent}
              selectedMethodName={state.methodName}
              onComponentChange={selectComponent}
              onMethodChange={selectMethod}
            />

            <div>
              <label htmlFor="tx-network" className="block">
                <span className="font-sans text-sm text-text-primary">
                  Network
                </span>
              </label>

              <select
                id="tx-network"
                value={state.network}
                onChange={(event) => {
                  setState((previous) => ({
                    ...previous,
                    network: event.target.value as TransactionNetwork,
                  }));
                  setPreparation({ phase: "draft" });
                }}
                className={selectClass}
              >
                {TRANSACTION_NETWORKS.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tx-source-account" className="block">
                <span className="font-sans text-sm text-text-primary">
                  Source account
                </span>
              </label>

              <input
                id="tx-source-account"
                type="text"
                value={state.sourceAccount}
                onChange={(event) => {
                  setState((previous) => ({
                    ...previous,
                    sourceAccount: event.target.value,
                  }));
                  setPreparation({ phase: "draft" });
                }}
                placeholder="G..."
                className={inputClass}
              />

              <p className="mt-2 font-sans text-xs leading-relaxed text-text-secondary">
                Wallet connection will be available in a later phase.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
            Arguments
          </p>

          <div className="mt-5">
            <ParameterForm
              params={selectedMethod?.params ?? []}
              values={state.parameters}
              errors={validation.errors}
              onChange={updateParameter}
            />
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={build}>
            Build Transaction
          </Button>

          <Button variant="secondary" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>

      <TransactionPreview preview={preview} />
    </div>
  );
}