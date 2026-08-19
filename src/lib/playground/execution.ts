import type { FunctionSpec } from "@/data/components";
import type {
  CallRequest,
  ConstructorRequest,
  ExecutionError,
  ExecutionStatus,
  ExecutionStep,
  PlaygroundResult,
} from "@/lib/playground/types";

export const ADMIN_IDENTITY = "admin";
export const IDENTITY_OPTIONS = ["admin", "user1", "user2"] as const;
export const ADDRESS_TYPES = new Set(["Address", "MuxedAddress"]);

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

export function defaultArgValue(
  param: FunctionSpec["params"][number],
  index: number,
): string {
  if (ADDRESS_TYPES.has(param.type)) {
    return index === 0 ? ADMIN_IDENTITY : "user1";
  }
  if (param.type === "i128") return "1000";
  return "";
}

export function signerFor(
  fn: FunctionSpec,
  args: string[],
): string | undefined {
  if (!SIGNER_REQUIRED_OPS.has(fn.name)) return undefined;
  if (ADMIN_ONLY_OPS.has(fn.name)) return ADMIN_IDENTITY;
  const index = fn.params.findIndex((param) => ADDRESS_TYPES.has(param.type));
  return index >= 0 ? args[index] : undefined;
}

export function callRequestFor(fn: FunctionSpec, args: string[]): CallRequest {
  const signer = signerFor(fn, args);
  return signer
    ? { fn: fn.name, args, signer }
    : { fn: fn.name, args };
}

export function buildConstructorRequest(
  configValues: Record<string, string>,
): ConstructorRequest {
  return {
    admin: ADMIN_IDENTITY,
    decimal: configValues.decimals,
    name: configValues.name,
    symbol: configValues.symbol,
  };
}

export function callsForSteps(
  steps: ExecutionStep[],
  ops: FunctionSpec[],
): CallRequest[] {
  return steps
    .filter((step) => step.fn !== "__constructor")
    .map((step) => {
      const fn = ops.find((op) => op.name === step.fn);
      return fn
        ? callRequestFor(fn, step.args)
        : { fn: step.fn, args: step.args };
    });
}

export function errorStatus(error: ExecutionError): ExecutionStatus {
  return error.kind === "contract" ? "contract-error" : "runner-error";
}

export function applyExecution(
  result: PlaygroundResult,
  submitted: ExecutionStep[],
): ExecutionStep[] {
  if (!result.ok) {
    return submitted.map((step) =>
      step.status === "pending"
        ? {
            ...step,
            status: "api-error",
            error: { kind: result.error.kind, message: result.error.message },
          }
        : step,
    );
  }

  const calls = result.response.calls ?? [];
  let callIndex = 0;
  return submitted.map((step) => {
    if (step.fn === "__constructor") {
      return result.response.deployedContract
        ? { ...step, status: "ok", result: result.response.deployedContract }
        : step;
    }
    const outcome = calls[callIndex++];
    if (!outcome) return step;
    if (outcome.ok) return { ...step, status: "ok", result: outcome.result };
    const error: ExecutionError = outcome.error ?? { kind: "contract" };
    return { ...step, status: errorStatus(error), error };
  });
}