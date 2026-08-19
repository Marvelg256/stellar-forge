import type {
  NetworkConfig,
  TransactionNetwork,
} from "@/lib/transactions/networks";

export interface TransactionBuilderState {
  componentSlug: string;
  methodName: string;
  network: TransactionNetwork;
  sourceAccount: string;
  parameters: Record<string, string>;
}

export interface TransactionRequest {
  network: TransactionNetwork;
  component: string;
  method: string;
  sourceAccount: string;
  parameters: Record<string, string>;
}

export type TransactionValidationCode =
  | "network.unsupported"
  | "component.missing"
  | "component.not-implemented"
  | "component.no-interface"
  | "method.missing"
  | "method.constructor"
  | "parameter.missing"
  | "parameter.invalid-type"
  | "source-account.missing";

export interface TransactionValidationError {
  code: TransactionValidationCode;
  field: string;
  message: string;
}

export interface TransactionValidationResult {
  ok: boolean;
  errors: TransactionValidationError[];
}

export interface TransactionValidation {
  errors: Record<string, string>;
  canBuild: boolean;
}

export type TransactionPreparationPhase =
  | "draft"
  | "built"
  | "preparing"
  | "prepared"
  | "failed";

export interface PreparedArgument {
  name: string;
  type: string;
  value: string;
}

export interface TransactionPreparationMetadata {
  preparedAt: string;
  networkConnected: boolean;
}

export interface PreparedTransaction {
  status: "prepared";
  request: TransactionRequest;
  component: {
    slug: string;
    name: string;
  };
  method: {
    name: string;
    arguments: PreparedArgument[];
  };
  network: NetworkConfig;
  sourceAccount: string;
  metadata: TransactionPreparationMetadata;
}

export interface FailedTransaction {
  status: "failed";
  request: TransactionRequest;
  errors: TransactionValidationError[];
}

export type TransactionPreparationResult = PreparedTransaction | FailedTransaction;

export interface DraftPreparation {
  phase: "draft";
}

export interface BuiltPreparation {
  phase: "built";
  request: TransactionRequest;
}

export interface PreparingPreparation {
  phase: "preparing";
  request: TransactionRequest;
}

export interface PreparedPreparation {
  phase: "prepared";
  result: PreparedTransaction;
}

export interface FailedPreparation {
  phase: "failed";
  result: FailedTransaction;
}

export type TransactionPreparation =
  | DraftPreparation
  | BuiltPreparation
  | PreparingPreparation
  | PreparedPreparation
  | FailedPreparation;

export interface TransactionPreviewArgument {
  name: string;
  type: string;
  value: string;
}

export interface TransactionPreviewData {
  networkLabel: string;
  sourceAccount: string;
  componentName: string;
  methodName: string;
  arguments: TransactionPreviewArgument[];
  phase: TransactionPreparationPhase;
  statusLabel: string;
  errors: TransactionValidationError[];
  request: TransactionRequest | null;
  preparedAt?: string;
  networkConnected?: boolean;
}