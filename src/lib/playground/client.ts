import type {
  CallOutcome,
  PlaygroundRequest,
  PlaygroundResponse,
  PlaygroundResult,
} from "@/lib/playground/types";

const ERROR_KINDS = new Set(["input", "runner", "api"]);

export async function postPlaygroundRequest(
  request: PlaygroundRequest,
): Promise<PlaygroundResult> {
  let response: Response;
  try {
    response = await fetch("/api/playground", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    return {
      ok: false,
      error: {
        kind: "api",
        message: "could not reach the playground API",
        status: 0,
      },
    };
  }

  const body = await response.json().catch(() => null);
  const parsed = parsePlaygroundResponse(body);
  if (parsed === null) {
    return {
      ok: false,
      error: {
        kind: "api",
        message: "playground API returned an invalid response",
        status: response.status,
      },
    };
  }
  if (response.ok && parsed.ok) return { ok: true, response: parsed };
  return {
    ok: false,
    error: {
      kind: parsed.error?.kind ?? "api",
      message: parsed.error?.message ?? "playground API request failed",
      status: response.status,
    },
  };
}

function parsePlaygroundResponse(body: unknown): PlaygroundResponse | null {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return null;
  }
  const record = body as Record<string, unknown>;
  if (typeof record.ok !== "boolean") return null;

  if (record.ok) {
    if (typeof record.deployedContract !== "string") return null;
    if (!Array.isArray(record.calls)) return null;
    if (!record.calls.every(isCallOutcome)) return null;
    return record as unknown as PlaygroundResponse;
  }

  if (!isPlaygroundError(record.error)) return null;
  return record as unknown as PlaygroundResponse;
}

function isCallOutcome(value: unknown): value is CallOutcome {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const call = value as Record<string, unknown>;
  return typeof call.fn === "string" && typeof call.ok === "boolean";
}

function isPlaygroundError(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const error = value as Record<string, unknown>;
  return (
    typeof error.kind === "string" &&
    ERROR_KINDS.has(error.kind) &&
    typeof error.message === "string"
  );
}