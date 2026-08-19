import type {
  FunctionSpec,
  ParameterSpec,
  StellarComponent,
} from "@/data/components";
import { getDeployment } from "@/lib/transactions/deployments";
import { networkLabel } from "@/lib/transactions/networks";
import type {
  TransactionBuilderState,
  TransactionPreparation,
  TransactionPreparationPhase,
  TransactionPreviewData,
  TransactionRequest,
  TransactionValidation,
} from "@/lib/transactions/types";
import { validateTransactionRequest } from "@/lib/transactions/validate";

export function callableMethods(
  component: StellarComponent,
): FunctionSpec[] {
  return (component.interface ?? []).filter(
    (fn) => fn.name !== "__constructor",
  );
}

export function implementedComponents(
  components: StellarComponent[],
): StellarComponent[] {
  return components.filter(
    (component) =>
      component.status === "Implemented" && callableMethods(component).length > 0,
  );
}

export function emptyParameters(
  params: FunctionSpec["params"],
): Record<string, string> {
  return Object.fromEntries(params.map((param) => [param.name, ""]));
}

export function parameterPlaceholder(param: ParameterSpec): string {
  switch (param.type) {
    case "Address":
    case "MuxedAddress":
      return "G...";
    case "i128":
      return "1000000";
    case "u32":
      return "200";
    case "String":
      return "Forge Token";
    case "Symbol":
      return "FORGE";
    default:
      return "";
  }
}

export function initialBuilderState(
  components: StellarComponent[],
): TransactionBuilderState {
  const component = implementedComponents(components)[0];

  if (!component) {
    return {
      componentSlug: "",
      methodName: "",
      network: "testnet",
      sourceAccount: "",
      parameters: {},
    };
  }

  const method = callableMethods(component)[0];

  return {
    componentSlug: component.slug,
    methodName: method?.name ?? "",
    network: "testnet",
    sourceAccount: "",
    parameters: method ? emptyParameters(method.params) : {},
  };
}

export function buildTransactionRequest(
  state: TransactionBuilderState,
): TransactionRequest {
  return {
    network: state.network,
    component: state.componentSlug,
    method: state.methodName,
    sourceAccount: state.sourceAccount,
    parameters: { ...state.parameters },
  };
}

export function validateBuilderState(
  state: TransactionBuilderState,
  components: StellarComponent[],
): TransactionValidation {
  const validation = validateTransactionRequest(
    buildTransactionRequest(state),
    components,
  );

  return {
    errors: Object.fromEntries(
      validation.errors.map((error) => [error.field, error.message]),
    ),
    canBuild: validation.ok,
  };
}

function previewStatusLabel(
  phase: TransactionPreparationPhase,
  validationOk: boolean,
): string {
  switch (phase) {
    case "draft":
      return validationOk ? "Ready to build" : "Waiting for required parameters";
    case "built":
      return "Ready for simulation";
    case "preparing":
      return "Simulating...";
    case "prepared":
      return "Simulation successful";
    case "failed":
      return "Simulation failed";
    case "blocked":
      return "Contract deployment required";
  }
}

export function buildPreview(
  state: TransactionBuilderState,
  components: StellarComponent[],
  preparation: TransactionPreparation,
): TransactionPreviewData {
  const component = components.find(
    (candidate) => candidate.slug === state.componentSlug,
  );
  const method = component
    ? callableMethods(component).find((fn) => fn.name === state.methodName)
    : undefined;
  const request = buildTransactionRequest(state);
  const validation = validateTransactionRequest(request, components);
  const deployment = getDeployment(state.network, state.componentSlug);

  const requestToShow =
    preparation.phase === "draft"
      ? null
      : preparation.phase === "built" || preparation.phase === "preparing"
        ? preparation.request
        : preparation.result.request;

  const preparationError =
    preparation.phase === "failed"
      ? preparation.result.preparationError
      : preparation.phase === "blocked"
        ? preparation.result.error
        : undefined;

  return {
    networkLabel: networkLabel(state.network),
    sourceAccount: state.sourceAccount || "Not connected",
    componentName: component?.name ?? "—",
    methodName: method?.name ?? "—",
    arguments: (method?.params ?? []).map((param) => ({
      name: param.name,
      type: param.type,
      value: state.parameters[param.name] ?? "",
    })),
    phase: preparation.phase,
    statusLabel: previewStatusLabel(preparation.phase, validation.ok),
    errors: validation.errors,
    request: requestToShow,
    deploymentStatus: deployment ? "configured" : "missing",
    contractAddress: deployment ?? undefined,
    preparationError,
    simulation:
      preparation.phase === "prepared" ? preparation.result.simulation : undefined,
    preparedAt:
      preparation.phase === "prepared"
        ? preparation.result.metadata.preparedAt
        : undefined,
  };
}