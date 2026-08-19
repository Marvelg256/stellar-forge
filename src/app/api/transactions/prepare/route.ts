import { stellarComponents as STELLAR_COMPONENTS } from "@/data/components";
import { prepareTransaction } from "@/lib/transactions/prepare";
import { isTransactionNetwork } from "@/lib/transactions/networks";
import type {
  TransactionPreparationResult,
  TransactionRequest,
} from "@/lib/transactions/types";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_PARAMETERS = 64;
const MAX_FIELD_LENGTH = 4096;

export async function POST(request: Request): Promise<Response> {
  const raw = await request.text();
  if (raw.length === 0) {
    return jsonError("request body must be a JSON object", 400);
  }
  if (raw.length > MAX_BODY_BYTES) {
    return jsonError(`request body exceeds ${MAX_BODY_BYTES} bytes`, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return jsonError("request body is not valid JSON", 400);
  }

  const requestBody = validateRequest(body);
  if (requestBody === null) {
    return jsonError(
      "request must include network, component, method, sourceAccount and parameters",
      400,
    );
  }

  const result = await prepareTransaction(requestBody, STELLAR_COMPONENTS);

  return Response.json(result as TransactionPreparationResult, {
    status: 200,
  });
}

function validateRequest(body: unknown): TransactionRequest | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const candidate = body as Record<string, unknown>;

  if (!isTransactionNetwork(candidate.network)) return null;
  if (typeof candidate.component !== "string" || !isBounded(candidate.component)) {
    return null;
  }
  if (typeof candidate.method !== "string" || !isBounded(candidate.method)) {
    return null;
  }
  if (
    typeof candidate.sourceAccount !== "string" ||
    !isBounded(candidate.sourceAccount)
  ) {
    return null;
  }
  if (
    typeof candidate.parameters !== "object" ||
    candidate.parameters === null ||
    Array.isArray(candidate.parameters)
  ) {
    return null;
  }

  const parameters: Record<string, string> = {};
  const entries = Object.entries(candidate.parameters as Record<string, unknown>);
  if (entries.length > MAX_PARAMETERS) return null;

  for (const [name, value] of entries) {
    if (typeof value !== "string" || !isBounded(value)) return null;
    parameters[name] = value;
  }

  return {
    network: candidate.network,
    component: candidate.component,
    method: candidate.method,
    sourceAccount: candidate.sourceAccount,
    parameters,
  };
}

function isBounded(value: string): boolean {
  return value.length > 0 && value.length <= MAX_FIELD_LENGTH;
}

function jsonError(message: string, status: number): Response {
  return Response.json(
    { ok: false, error: { kind: "input", message } },
    { status },
  );
}