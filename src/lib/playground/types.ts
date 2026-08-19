export type PlaygroundErrorKind = "input" | "runner" | "api";

export interface PlaygroundError {
  kind: PlaygroundErrorKind;
  message: string;
}

export interface PlaygroundApiError extends PlaygroundError {
  status: number;
}

export type ExecutionErrorKind =
  | "contract"
  | "runner"
  | "api"
  | "input"
  | "invoke";

export interface ExecutionError {
  kind: ExecutionErrorKind;
  type?: string;
  code?: string;
  message?: string;
}

export type ExecutionStatus =
  | "pending"
  | "ok"
  | "contract-error"
  | "runner-error"
  | "api-error";

export interface ExecutionStep {
  id: number;
  fn: string;
  label: string;
  args: string[];
  status: ExecutionStatus;
  result?: unknown;
  error?: ExecutionError;
}

export interface ConstructorRequest {
  admin: string;
  decimal: string;
  name: string;
  symbol: string;
}

export interface CallRequest {
  fn: string;
  args: string[];
  signer?: string;
}

export interface PlaygroundRequest {
  constructor: ConstructorRequest;
  calls: CallRequest[];
  identities?: Record<string, string>;
}

export interface CallOutcome {
  fn: string;
  ok: boolean;
  result?: unknown;
  error?: ExecutionError;
}

export interface PlaygroundResponse {
  ok: boolean;
  deployedContract?: string;
  calls?: CallOutcome[];
  error?: PlaygroundError;
}

export type PlaygroundResult =
  | { ok: true; response: PlaygroundResponse }
  | { ok: false; error: PlaygroundApiError };