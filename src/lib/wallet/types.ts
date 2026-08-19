export type WalletErrorCode =
  | "wallet-unavailable"
  | "wallet-rejected"
  | "wallet-network-mismatch"
  | "signer-mismatch"
  | "unknown";

export type WalletStatus =
  | "checking"
  | "unavailable"
  | "disconnected"
  | "connecting"
  | "connected";

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  networkName: string | null;
  networkPassphrase: string | null;
  error: WalletError | null;
}

export interface WalletError {
  code: WalletErrorCode;
  message: string;
  detail?: string;
}

export interface WalletNetworkInfo {
  name: string;
  passphrase: string;
}

export interface WalletConnection {
  address: string;
  network: WalletNetworkInfo;
}

export type WalletChange =
  | { type: "connected"; connection: WalletConnection }
  | { type: "disconnected" };

export interface SignTransactionOptions {
  networkPassphrase: string;
  address?: string;
}

export interface SignedTransaction {
  signedXdr: string;
  signerAddress: string;
}

export type WalletConnectResult =
  | { ok: true; connection: WalletConnection }
  | { ok: false; error: WalletError };

export type WalletSignResult =
  | { ok: true; signed: SignedTransaction }
  | { ok: false; error: WalletError };

export interface WalletAdapter {
  readonly id: string;
  readonly name: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<WalletConnectResult>;
  disconnect(): Promise<void>;
  getConnection(): Promise<WalletConnectResult>;
  signTransaction(
    xdr: string,
    options: SignTransactionOptions,
  ): Promise<WalletSignResult>;
  subscribe(onChange: (change: WalletChange) => void): () => void;
}