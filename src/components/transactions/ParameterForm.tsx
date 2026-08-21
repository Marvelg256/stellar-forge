import type { FunctionSpec } from "@/data/components";
import { parameterPlaceholder } from "@/lib/transactions/builder";

export interface ParameterFormProps {
  params: FunctionSpec["params"];
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
  walletAddress?: string;
}

export function ParameterForm({
  params,
  values,
  errors,
  onChange,
  walletAddress,
}: ParameterFormProps) {
  if (params.length === 0) {
    return (
      <p className="font-sans text-sm leading-relaxed text-text-secondary">
        This method takes no arguments.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {params.map((param) => {
        const error = errors[param.name];

        return (
          <div key={param.name}>
            <label htmlFor={`tx-param-${param.name}`} className="block">
              <span className="font-sans text-sm text-text-primary">
                {param.name}
              </span>
            </label>

            <p className="mt-0.5 font-mono text-xs text-text-secondary">
              {param.type}
            </p>

            <input
              id={`tx-param-${param.name}`}
              type="text"
              value={values[param.name] ?? ""}
              onChange={(event) => onChange(param.name, event.target.value)}
              placeholder={parameterPlaceholder(param)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `tx-param-${param.name}-error` : undefined}
              className={`mt-2 w-full rounded-default border bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar ${
                error ? "border-accent-forge/60" : "border-border"
              }`}
            />

            {error && (
              <p
                id={`tx-param-${param.name}-error`}
                className="mt-1 font-sans text-xs text-accent-forge"
              >
                {error}
              </p>
            )}

            {(param.type === "Address" || param.type === "MuxedAddress") &&
              walletAddress && (
                <button
                  type="button"
                  onClick={() => onChange(param.name, walletAddress)}
                  className="mt-1.5 inline-flex items-center gap-1 font-mono text-[11px] text-accent-stellar transition-colors hover:text-accent-stellar/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
                >
                  Use connected wallet
                </button>
              )}
          </div>
        );
      })}
    </div>
  );
}