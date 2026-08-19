import type {
  BlockedTransaction,
  FailedTransaction,
  PreparedTransaction,
  TransactionPreparationResult,
  TransactionRequest,
} from "@/lib/transactions/types";

export async function prepareTransactionRequest(
  request: TransactionRequest,
): Promise<TransactionPreparationResult> {
  try {
    const response = await fetch("/api/transactions/prepare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    const payload: unknown = await response.json();

    if (!response.ok) {
      return {
        status: "failed",
        request,
        errors: [],
        preparationError: {
          code: "rpc-unavailable",
          message: "The preparation service could not be reached.",
        },
      };
    }

    if (isPreparedResult(payload)) {
      return payload;
    }
    if (isFailedResult(payload)) {
      return payload;
    }
    if (isBlockedResult(payload)) {
      return payload as BlockedTransaction;
    }

    return {
      status: "failed",
      request,
      errors: [],
      preparationError: {
        code: "rpc-unavailable",
        message: "The preparation service returned an unexpected response.",
      },
    };
  } catch {
    return {
      status: "failed",
      request,
      errors: [],
      preparationError: {
        code: "rpc-unavailable",
        message: "Could not reach the preparation service.",
      },
    };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isPreparedResult(value: unknown): value is PreparedTransaction {
  return (
    isRecord(value) &&
    value.status === "prepared" &&
    isRecord(value.simulation) &&
    value.simulation.success === true
  );
}

function isFailedResult(value: unknown): value is FailedTransaction {
  return isRecord(value) && value.status === "failed";
}

function isBlockedResult(value: unknown): value is { status: "blocked" } {
  return isRecord(value) && value.status === "blocked";
}