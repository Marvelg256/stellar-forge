import type { FunctionAuthorization, StellarComponent } from "@/data/components";
import { callableMethods } from "@/lib/transactions/builder";

const selectClass =
  "mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar";

function authLabel(authorization: FunctionAuthorization | undefined): string {
  switch (authorization) {
    case "admin":
      return "admin only";
    case "first-address":
      return "needs signer";
    default:
      return "public";
  }
}

export interface MethodSelectorProps {
  components: StellarComponent[];
  selectedComponent: StellarComponent;
  selectedMethodName: string;
  onComponentChange: (slug: string) => void;
  onMethodChange: (name: string) => void;
}

export function MethodSelector({
  components,
  selectedComponent,
  selectedMethodName,
  onComponentChange,
  onMethodChange,
}: MethodSelectorProps) {
  const methods = callableMethods(selectedComponent);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="tx-component" className="block">
          <span className="font-sans text-sm text-text-primary">
            Component
          </span>
        </label>

        <select
          id="tx-component"
          value={selectedComponent.slug}
          onChange={(event) => onComponentChange(event.target.value)}
          className={selectClass}
        >
          {components.map((component) => (
            <option key={component.slug} value={component.slug}>
              {component.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tx-method" className="block">
          <span className="font-sans text-sm text-text-primary">Method</span>
        </label>

        <select
          id="tx-method"
          value={selectedMethodName}
          onChange={(event) => onMethodChange(event.target.value)}
          className={selectClass}
        >
          {methods.map((method) => (
            <option key={method.name} value={method.name}>
              {`${method.name} (${authLabel(method.authorization)})`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}