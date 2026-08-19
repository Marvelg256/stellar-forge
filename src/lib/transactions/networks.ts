export type TransactionNetwork = "testnet" | "futurenet";

export interface NetworkConfig {
  id: TransactionNetwork;
  label: string;
  rpcUrl: string;
  passphrase: string;
}

export const NETWORK_CONFIGS: Record<TransactionNetwork, NetworkConfig> = {
  testnet: {
    id: "testnet",
    label: "Stellar Testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
  },
  futurenet: {
    id: "futurenet",
    label: "Stellar Futurenet",
    rpcUrl: "https://rpc-futurenet.stellar.org",
    passphrase: "Test SDF Future Network ; October 2022",
  },
};

export const TRANSACTION_NETWORKS: NetworkConfig[] = Object.values(
  NETWORK_CONFIGS,
);

export function isTransactionNetwork(value: unknown): value is TransactionNetwork {
  return typeof value === "string" && value in NETWORK_CONFIGS;
}

export function networkConfig(network: TransactionNetwork): NetworkConfig {
  return NETWORK_CONFIGS[network];
}

export function networkLabel(network: unknown): string {
  return isTransactionNetwork(network)
    ? NETWORK_CONFIGS[network].label
    : String(network ?? "");
}