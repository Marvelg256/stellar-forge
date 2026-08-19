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
  | "parameter.unsupported-type"
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

export type TransactionPreparationErrorCode =
  | "network.unsupported"
  | "contract-not-deployed"
  | "contract-address-invalid"
  | "source-account-invalid"
  | "source-account-not-found"
  | "parameter-unsupported-type"
  | "parameter-invalid-value"
  | "rpc-unavailable"
  | "simulation-failed";

export interface TransactionPreparationError {
  code: TransactionPreparationErrorCode;
  message: string;
  detail?: string;
}

export type TransactionPreparationPhase =
  | "draft"
  | "built"
  | "preparing"
  | "prepared"
  | "failed"
  | "blocked";

export interface PreparedArgument {
  name: string;
  type: string;
  value: string;
}

export interface SimulationInfo {
  success: true;
  latestLedger: number;
  minResourceFee: string;
  cost: {
    cpuInstructions: string;
    memoryBytes: string;
  };
  result: {
    type: string;
    value: string;
  } | null;
  isReadCall: boolean;
  transactionData: string;
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
  contract: {
    address: string;
  };
  simulation: SimulationInfo;
  metadata: TransactionPreparationMetadata;
}

export interface FailedTransaction {
  status: "failed";
  request: TransactionRequest;
  errors: TransactionValidationError[];
  preparationError?: TransactionPreparationError;
}

export interface BlockedTransaction {
  status: "blocked";
  request: TransactionRequest;
  error: TransactionPreparationError;
}

export type TransactionPreparationResult =
  | PreparedTransaction
  | FailedTransaction
  | BlockedTransaction;

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

export interface BlockedPreparation {
  phase: "blocked";
  result: BlockedTransaction;
}

export type TransactionPreparation =
  | DraftPreparation
  | BuiltPreparation
  | PreparingPreparation
  | PreparedPreparation
  | FailedPreparation
  | BlockedPreparation;

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
  deploymentStatus: "configured" | "missing";
  contractAddress?: string;
  preparationError?: TransactionPreparationError;
  simulation?: SimulationInfo;
  preparedAt?: string;
}