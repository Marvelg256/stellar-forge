import type { TransactionNetwork } from "@/lib/transactions/networks";

export interface ContractDeployment {
  network: TransactionNetwork;
  componentSlug: string;
  address: string;
}

const DEPLOYMENTS: ContractDeployment[] = [];

export function getDeployment(
  network: TransactionNetwork,
  componentSlug: string,
): string | null {
  const deployment = DEPLOYMENTS.find(
    (candidate) =>
      candidate.network === network && candidate.componentSlug === componentSlug,
  );

  return deployment?.address ?? null;
}