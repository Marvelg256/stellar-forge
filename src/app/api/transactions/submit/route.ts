import { submitTransaction } from "@/lib/transactions/submit";
import { isTransactionNetwork } from "@/lib/transactions/networks";
import type { TransactionNetwork } from "@/lib/transactions/networks";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 64 * 1024;
const MAX_SIGNED_XDR_LENGTH = 32 * 1024;
const SECRET_KEY_FIELDS = [
  "secretKey",
  "secret",
  "seed",
  "privateKey",
  "private_key",
  "secret_key",
  "secretSeed",
];

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
      "request must include only a supported network and a signed transaction XDR",
      400,
    );
  }

  const result = await submitTransaction(requestBody);

  if (!result.ok) {
    return jsonError(result.error.message, 400, result.error.code, result.error.detail);
  }

  return Response.json({ ok: true, submission: result.submission });
}

function validateRequest(
  body: unknown,
): { network: TransactionNetwork; signedXdr: string } | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }

  const candidate = body as Record<string, unknown>;

  if (!isTransactionNetwork(candidate.network)) return null;

  for (const field of SECRET_KEY_FIELDS) {
    if (field in candidate) return null;
  }

  const allowedFields = new Set(["network", "signedXdr"]);
  if (Object.keys(candidate).some((key) => !allowedFields.has(key))) {
    return null;
  }

  if (
    typeof candidate.signedXdr !== "string" ||
    candidate.signedXdr.length === 0 ||
    candidate.signedXdr.length > MAX_SIGNED_XDR_LENGTH
  ) {
    return null;
  }

  return {
    network: candidate.network,
    signedXdr: candidate.signedXdr,
  };
}

function jsonError(
  message: string,
  status: number,
  code = "input.invalid",
  detail?: string,
): Response {
  return Response.json(
    {
      ok: false,
      error: {
        code,
        message,
        ...(detail ? { detail } : {}),
      },
    },
    { status },
  );
}