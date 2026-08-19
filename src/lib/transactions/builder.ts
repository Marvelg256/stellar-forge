import type {
  FunctionSpec,
  ParameterSpec,
  StellarComponent,
} from "@/data/components";
import type {
  TransactionBuilderState,
  TransactionPreviewData,
  TransactionPreviewStatus,
  TransactionRequest,
  TransactionValidation,
} from "@/lib/transactions/types";
import { TRANSACTION_NETWORKS } from "@/lib/transactions/types";

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

export function validateBuilderState(
  state: TransactionBuilderState,
  components: StellarComponent[],
): TransactionValidation {
  const component = components.find(
    (candidate) => candidate.slug === state.componentSlug,
  );

  if (!component) {
    return {
      errors: { component: "Select a component." },
      canBuild: false,
    };
  }

  const method = callableMethods(component).find(
    (fn) => fn.name === state.methodName,
  );

  if (!method) {
    return {
      errors: { method: "Select a method." },
      canBuild: false,
    };
  }

  const errors: Record<string, string> = {};
  for (const param of method.params) {
    if (!state.parameters[param.name]?.trim()) {
      errors[param.name] = "This field is required.";
    }
  }

  return {
    errors,
    canBuild: Object.keys(errors).length === 0,
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

function previewStatus(
  state: TransactionBuilderState,
  components: StellarComponent[],
  built: boolean,
): TransactionPreviewStatus {
  const validation = validateBuilderState(state, components);
  if (built && validation.canBuild) return "built";
  return validation.canBuild ? "ready" : "incomplete";
}

export function buildPreview(
  state: TransactionBuilderState,
  components: StellarComponent[],
  built: boolean,
): TransactionPreviewData {
  const component = components.find(
    (candidate) => candidate.slug === state.componentSlug,
  );
  const method = component
    ? callableMethods(component).find((fn) => fn.name === state.methodName)
    : undefined;

  return {
    networkLabel:
      TRANSACTION_NETWORKS.find((network) => network.value === state.network)
        ?.label ?? state.network,
    sourceAccount: state.sourceAccount || "Not connected",
    componentName: component?.name ?? "—",
    methodName: method?.name ?? "—",
    arguments: (method?.params ?? []).map((param) => ({
      name: param.name,
      value: state.parameters[param.name] ?? "",
    })),
    status: previewStatus(state, components, built),
  };
}