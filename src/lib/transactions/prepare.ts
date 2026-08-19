import type { StellarComponent } from "@/data/components";
import { buildInvocationArgs } from "@/lib/transactions/args";
import { getDeployment } from "@/lib/transactions/deployments";
import { networkConfig, networkLabel } from "@/lib/transactions/networks";
import { simulateSorobanInvocation } from "@/lib/transactions/rpc";
import type {
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

  const deployment = getDeployment(request.network, request.component);

  if (!deployment) {
    return {
      status: "blocked",
      request,
      error: {
        code: "contract-not-deployed",
        message: `${component.name} has source code, but no deployed contract address is configured for ${networkLabel(request.network)}, so Soroban simulation cannot run yet.`,
      },
    };
  }

  const argsResult = buildInvocationArgs(method.params, request.parameters);

  if (!argsResult.ok) {
    return {
      status: "failed",
      request,
      errors: [],
      preparationError: argsResult.error,
    };
  }

  const invocation = await simulateSorobanInvocation({
    network: request.network,
    contractAddress: deployment,
    method: method.name,
    args: argsResult.scVals,
    sourceAccount: request.sourceAccount,
  });

  if (!invocation.ok) {
    return {
      status: "failed",
      request,
      errors: [],
      preparationError: invocation.error,
    };
  }

  return {
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
    contract: { address: deployment },
    simulation: invocation.simulation,
    metadata: {
      preparedAt: new Date().toISOString(),
      networkConnected: true,
    },
  };
}