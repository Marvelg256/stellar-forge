"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { FunctionSpec, StellarComponent } from "@/data/components";

const ADMIN_IDENTITY = "admin";
const IDENTITY_OPTIONS = ["admin", "user1", "user2"] as const;
const ADDRESS_TYPES = new Set(["Address", "MuxedAddress"]);
const ADMIN_ONLY_OPS = new Set(["mint", "set_admin"]);
const SIGNER_REQUIRED_OPS = new Set([
  "transfer",
  "approve",
  "transfer_from",
  "burn",
  "burn_from",
  "mint",
  "set_admin",
]);
const INTEGER_PATTERN = /^-?\d+$/;
const DECIMAL_PATTERN = /^\d+$/;
const I128_MIN = BigInt("-170141183460469231731687303715884105728");
const I128_MAX = BigInt("170141183460469231731687303715884105727");
const U32_MAX = BigInt("4294967295");

type StepStatus =
  | "pending"
  | "ok"
  | "contract-error"
  | "runner-error"
  | "api-error";

interface StepError {
  kind: string;
  type?: string;
  code?: string;
  message?: string;
}

interface Step {
  id: number;
  fn: string;
  label: string;
  args: string[];
  status: StepStatus;
  result?: unknown;
  error?: StepError;
}

interface ApiCallResult {
  fn: string;
  ok: boolean;
  result?: unknown;
  error?: StepError;
}

interface ApiResponse {
  ok: boolean;
  deployedContract?: string;
  calls?: ApiCallResult[];
  error?: StepError;
}

const STATUS_STYLES: Record<StepStatus, string> = {
  pending: "border-border text-text-secondary",
  ok: "border-accent-stellar/40 text-accent-stellar",
  "contract-error": "border-accent-forge/60 text-accent-forge",
  "runner-error": "border-accent-forge/60 text-accent-forge",
  "api-error": "border-accent-forge/60 text-accent-forge",
};

const STATUS_LABELS: Record<StepStatus, string> = {
  pending: "pending",
  ok: "ok",
  "contract-error": "contract error",
  "runner-error": "runner error",
  "api-error": "api error",
};

let nextStepId = 1;

function defaultArgValue(param: FunctionSpec["params"][number], index: number): string {
  if (ADDRESS_TYPES.has(param.type)) {
    return index === 0 ? ADMIN_IDENTITY : "user1";
  }
  if (param.type === "i128") return "1000";
  return "";
}

function signerFor(fn: FunctionSpec, args: string[]): string | undefined {
  if (!SIGNER_REQUIRED_OPS.has(fn.name)) return undefined;
  if (ADMIN_ONLY_OPS.has(fn.name)) return ADMIN_IDENTITY;
  const index = fn.params.findIndex((param) => ADDRESS_TYPES.has(param.type));
  return index >= 0 ? args[index] : undefined;
}

function callPayload(fn: FunctionSpec, args: string[]): Record<string, unknown> {
  const signer = signerFor(fn, args);
  return signer
    ? { fn: fn.name, args, signer }
    : { fn: fn.name, args };
}

function stepLabel(fn: FunctionSpec, args: string[]): string {
  return `${fn.name}(${args.join(", ")})`;
}

function formatResult(result: unknown): string {
  if (
    typeof result === "string" ||
    typeof result === "number" ||
    result === null
  ) {
    return String(result);
  }
  return JSON.stringify(result);
}

function formatError(error: StepError): string {
  if (error.kind === "contract") {
    const details = error.code
      ? `${error.type ?? "Contract"}/${error.code}`
      : error.type ?? "contract error";
    return `contract error — ${details}`;
  }
  return `${error.kind} error — ${error.message ?? "no details"}`;
}

function validateParamValue(
  param: FunctionSpec["params"][number],
  value: string,
): string | null {
  if (value.trim().length === 0) return null;
  if (param.type === "i128") {
    if (!INTEGER_PATTERN.test(value)) return "must be an integer";
    const n = BigInt(value);
    if (n < I128_MIN || n > I128_MAX) return "outside the i128 range";
    return null;
  }
  if (param.type === "u32") {
    if (!DECIMAL_PATTERN.test(value)) return "must be a whole number";
    if (BigInt(value) > U32_MAX) return "outside the u32 range";
    return null;
  }
  return null;
}

export function SandboxPanel({
  component,
  configValues,
}: {
  component: StellarComponent;
  configValues: Record<string, string>;
}) {
  const ops = (component.interface ?? []).filter(
    (fn) => fn.name !== "__constructor",
  );
  const [steps, setSteps] = useState<Step[]>([]);
  const [opName, setOpName] = useState(() => ops[0]?.name ?? "");
  const [argValues, setArgValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (ops[0]?.params ?? []).map((param, index) => [
        param.name,
        defaultArgValue(param, index),
      ]),
    ),
  );
  const [initializing, setInitializing] = useState(false);
  const [running, setRunning] = useState(false);
  const [deployedContract, setDeployedContract] = useState<string | null>(null);

  if (ops.length === 0) return null;

  const busy = initializing || running;
  const selectedOp = ops.find((op) => op.name === opName) ?? ops[0];
  const args = selectedOp.params.map((param) => argValues[param.name] ?? "");
  const hasEmptyArgs = args.some((value) => value.trim().length === 0);
  const argErrors = Object.fromEntries(
    selectedOp.params.map((param) => [
      param.name,
      validateParamValue(param, argValues[param.name] ?? ""),
    ]),
  );
  const hasInvalidArgs = Object.values(argErrors).some(
    (message) => message !== null,
  );
  const signer = signerFor(selectedOp, args);

  function changeOp(name: string) {
    const fn = ops.find((op) => op.name === name);
    if (!fn) return;
    setOpName(name);
    setArgValues(
      Object.fromEntries(
        fn.params.map((param, index) => [
          param.name,
          defaultArgValue(param, index),
        ]),
      ),
    );
  }

  function buildConstructor(): Record<string, unknown> {
    return {
      admin: ADMIN_IDENTITY,
      decimal: configValues.decimals,
      name: configValues.name,
      symbol: configValues.symbol,
    };
  }

  function callsPayload(stepsToSend: Step[]): Record<string, unknown>[] {
    return stepsToSend
      .filter((step) => step.fn !== "__constructor")
      .map((step) => {
        const fn = ops.find((op) => op.name === step.fn);
        return fn
          ? callPayload(fn, step.args)
          : { fn: step.fn, args: step.args };
      });
  }

  function applyResponse(response: ApiResponse, submitted: Step[]): Step[] {
    if (!response.ok) {
      const error = response.error ?? {
        kind: "api",
        message: "unexpected API failure",
      };
      return submitted.map((step) =>
        step.status === "pending"
          ? { ...step, status: "api-error" as const, error }
          : step,
      );
    }
    const results = response.calls ?? [];
    let callIndex = 0;
    return submitted.map((step) => {
      if (step.fn === "__constructor") {
        return response.deployedContract
          ? {
              ...step,
              status: "ok" as const,
              result: response.deployedContract,
            }
          : step;
      }
      const result = results[callIndex++];
      if (!result) return step;
      if (result.ok) {
        return { ...step, status: "ok" as const, result: result.result };
      }
      const error = result.error ?? { kind: "contract" };
      const status: StepStatus =
        error.kind === "contract" ? "contract-error" : "runner-error";
      return { ...step, status, error };
    });
  }

  async function post(payload: Record<string, unknown>): Promise<ApiResponse> {
    const response = await fetch("/api/playground", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return (await response.json()) as ApiResponse;
  }

  async function initialize() {
    if (busy) return;
    setInitializing(true);
    const step: Step = {
      id: nextStepId++,
      fn: "__constructor",
      label: `initialize(${configValues.name}, ${configValues.symbol}, ${configValues.decimals})`,
      args: [],
      status: "pending",
    };
    setSteps([step]);
    setDeployedContract(null);
    try {
      const response = await post({
        constructor: buildConstructor(),
        calls: [],
      });
      setDeployedContract(response.deployedContract ?? null);
      setSteps(applyResponse(response, [step]));
    } catch {
      setSteps((previous) =>
        previous.map((s) =>
          s.status === "pending"
            ? {
                ...s,
                status: "api-error" as const,
                error: { kind: "api", message: "could not reach the playground API" },
              }
            : s,
        ),
      );
    } finally {
      setInitializing(false);
    }
  }

  async function execute() {
    if (busy || hasEmptyArgs || hasInvalidArgs) return;
    setRunning(true);
    const step: Step = {
      id: nextStepId++,
      fn: selectedOp.name,
      label: stepLabel(selectedOp, args),
      args,
      status: "pending",
    };
    const submitted = [...steps, step];
    setSteps(submitted);
    try {
      const response = await post({
        constructor: buildConstructor(),
        calls: callsPayload(submitted),
      });
      setDeployedContract(response.deployedContract ?? null);
      setSteps(applyResponse(response, submitted));
    } catch {
      setSteps((previous) =>
        previous.map((s) =>
          s.status === "pending"
            ? {
                ...s,
                status: "api-error" as const,
                error: { kind: "api", message: "could not reach the playground API" },
              }
            : s,
        ),
      );
    } finally {
      setRunning(false);
    }
  }

  function resetSandbox() {
    setSteps([]);
    setDeployedContract(null);
  }

  function renderParamInput(param: FunctionSpec["params"][number]) {
    const inputStyles =
      "mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar disabled:cursor-not-allowed disabled:opacity-50";

    if (ADDRESS_TYPES.has(param.type)) {
      return (
        <select
          value={argValues[param.name] ?? ""}
          onChange={(event) =>
            setArgValues({ ...argValues, [param.name]: event.target.value })
          }
          disabled={busy}
          className={inputStyles}
        >
          {IDENTITY_OPTIONS.map((identity) => (
            <option key={identity} value={identity}>
              {identity}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        inputMode={param.type === "i128" || param.type === "u32" ? "numeric" : "text"}
        value={argValues[param.name] ?? ""}
        onChange={(event) =>
          setArgValues({ ...argValues, [param.name]: event.target.value })
        }
        placeholder={param.type === "u32" ? "expiration ledger" : "amount"}
        disabled={busy}
        aria-invalid={argErrors[param.name] !== null}
        className={inputStyles}
      />
    );
  }

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
            Sandbox — local simulated ledger
          </p>

          <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-text-secondary">
            Executes {component.name} locally: the real contract wasm runs in an
            isolated Soroban host on this machine, replaying the full operation
            history in a fresh simulated ledger on every run. The selected
            network does not apply to local execution.
          </p>
        </div>

        <span className="rounded-default border border-border px-2 py-1 font-mono text-xs text-text-secondary">
          local
        </span>
      </div>

      <div className="mt-5 rounded-default border border-border bg-canvas/60 px-3 py-2 font-mono text-xs">
        {deployedContract ? (
          <>
            <span className="text-text-secondary">deployed contract </span>
            <span className="break-all text-text-primary">
              {deployedContract}
            </span>
          </>
        ) : (
          <span className="text-text-secondary">
            not initialized — initialize to deploy the token
          </span>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button variant="primary" onClick={initialize} disabled={busy}>
          {initializing ? "Initializing…" : `Initialize ${component.name}`}
        </Button>

        <Button
          variant="secondary"
          onClick={resetSandbox}
          disabled={busy || steps.length === 0}
        >
          Reset Sandbox
        </Button>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
          Execute operation
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="block min-w-40">
            <span className="font-sans text-sm text-text-primary">
              Operation
            </span>

            <select
              value={opName}
              onChange={(event) => changeOp(event.target.value)}
              disabled={busy}
              className="mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar disabled:cursor-not-allowed disabled:opacity-50"
            >
              {ops.map((op) => (
                <option key={op.name} value={op.name}>
                  {op.name}
                </option>
              ))}
            </select>
          </label>

          {selectedOp.params.map((param) => (
            <label key={param.name} className="block min-w-36">
              <span className="font-sans text-sm text-text-primary">
                {param.name}{" "}
                <span className="font-mono text-xs text-text-secondary">
                  {param.type}
                </span>
              </span>

              {renderParamInput(param)}

              {argErrors[param.name] && (
                <span className="mt-1 block font-mono text-xs text-accent-forge">
                  {argErrors[param.name]}
                </span>
              )}
            </label>
          ))}

          <Button
            variant="primary"
            onClick={execute}
            disabled={busy || hasEmptyArgs || hasInvalidArgs}
          >
            {running ? "Executing…" : "Execute"}
          </Button>
        </div>

        {selectedOp.description && (
          <p className="mt-2 max-w-2xl font-sans text-xs leading-relaxed text-text-secondary">
            {selectedOp.description}
          </p>
        )}

        <p className="mt-2 font-sans text-xs text-text-secondary">
          {signer
            ? `${selectedOp.name} is authorized by ${signer}.`
            : `${selectedOp.name} requires no authorization.`}
        </p>
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
          Execution history
        </p>

        {steps.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-text-secondary">
            No operations executed yet. Initialize the contract to begin.
          </p>
        ) : (
          <ul className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
            {steps.map((step, index) => {
              const isNewest = index === steps.length - 1;

              return (
                <li
                  key={step.id}
                  className={`rounded-default border px-3 py-2 ${
                    isNewest ? "border-accent-stellar/60" : "border-border"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs text-text-primary">
                      {step.label}
                    </span>

                    <span
                      className={`rounded-default border px-2 py-0.5 font-mono text-xs ${STATUS_STYLES[step.status]} ${
                        step.status === "pending" ? "animate-pulse" : ""
                      }`}
                    >
                      {STATUS_LABELS[step.status]}
                    </span>
                  </div>

                  {step.status === "ok" && step.result !== undefined && (
                    <p className="mt-1 font-mono text-xs text-text-secondary">
                      {step.fn === "__constructor" ? "deployed at" : "returned"}{" "}
                      <span className="text-text-primary">
                        {formatResult(step.result)}
                      </span>
                    </p>
                  )}

                  {step.error && (
                    <p className="mt-1 font-mono text-xs text-accent-forge">
                      {formatError(step.error)}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}