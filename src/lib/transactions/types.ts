export type TransactionNetwork = "testnet" | "futurenet";

export interface TransactionNetworkOption {
  value: TransactionNetwork;
  label: string;
}

export const TRANSACTION_NETWORKS: TransactionNetworkOption[] = [
  { value: "testnet", label: "Stellar Testnet" },
  { value: "futurenet", label: "Stellar Futurenet" },
];

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

export type TransactionPreviewStatus = "ready" | "incomplete" | "built";

export interface TransactionPreviewArgument {
  name: string;
  value: string;
}

export interface TransactionPreviewData {
  networkLabel: string;
  sourceAccount: string;
  componentName: string;
  methodName: string;
  arguments: TransactionPreviewArgument[];
  status: TransactionPreviewStatus;
}

export interface TransactionValidation {
  errors: Record<string, string>;
  canBuild: boolean;
}