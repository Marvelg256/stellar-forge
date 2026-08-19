import type { StellarComponent } from "@/data/components";
import { networkConfig } from "@/lib/transactions/networks";
import type {
  PreparedTransaction,
  TransactionPreparationResult,
  TransactionRequest,
} from "@/lib/transactions/types";
import { validateTransactionRequest } from "@/lib/transactions/validate";

export async function prepareTransaction(
  request: TransactionRequest,
  components: StellarComponent[],
): Promise<TransactionPreparationResult> {
  const validation = validateTransactionRequest(request, components);

  if (!validation.ok) {
    return { status: "failed", request, errors: validation.errors };
  }

  const component = components.find(
    (candidate) => candidate.slug === request.component,
  ) as StellarComponent;
  const method = component.interface?.find(
    (fn) => fn.name === request.method,
  ) as NonNullable<StellarComponent["interface"]>[number];

  const prepared: PreparedTransaction = {
    status: "prepared",
    request,
    component: {
      slug: component.slug,
      name: component.name,
    },
    method: {
      name: method.name,
      arguments: method.params.map((param) => ({
        name: param.name,
        type: param.type,
        value: request.parameters[param.name] ?? "",
      })),
    },
    network: networkConfig(request.network),
    sourceAccount: request.sourceAccount,
    metadata: {
      preparedAt: new Date().toISOString(),
      networkConnected: false,
    },
  };

  return prepared;
}