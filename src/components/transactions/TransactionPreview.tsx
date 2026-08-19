import type {
  TransactionPreparationPhase,
  TransactionPreviewData,
} from "@/lib/transactions/types";
import { Card } from "@/components/ui/Card";

const statusClasses: Record<TransactionPreparationPhase, string> = {
  draft: "text-accent-stellar",
  built: "text-accent-stellar",
  preparing: "text-accent-forge",
  prepared: "text-accent-stellar",
  failed: "text-accent-forge",
  blocked: "text-accent-forge",
};

export interface TransactionPreviewProps {
  preview: TransactionPreviewData;
}

export function TransactionPreview({ preview }: TransactionPreviewProps) {
  return (
    <Card className="h-fit">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
          Transaction Preview
        </h2>

        <span
          className={`rounded-default border border-border px-2 py-0.5 font-mono text-[11px] ${statusClasses[preview.phase]}`}
        >
          {preview.statusLabel}
        </span>
      </div>

      <dl className="mt-5 space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-sans text-sm text-text-secondary">Network</dt>
          <dd className="font-mono text-xs text-text-primary">
            {preview.networkLabel}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-sans text-sm text-text-secondary">Source</dt>
          <dd className="font-mono text-xs text-text-primary">
            {preview.sourceAccount}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-sans text-sm text-text-secondary">Contract</dt>
          <dd className="font-mono text-xs text-text-primary">
            {preview.componentName}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-4">
          <dt className="font-sans text-sm text-text-secondary">Method</dt>
          <dd className="font-mono text-xs text-text-primary">
            {preview.methodName}
          </dd>
        </div>
      </dl>

      {preview.arguments.length > 0 && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-sans text-sm text-text-secondary">Arguments</p>

          <ul className="mt-3 space-y-2">
            {preview.arguments.map((argument) => (
              <li
                key={argument.name}
                className="flex items-baseline justify-between gap-4"
              >
                <span className="font-mono text-xs text-text-secondary">
                  {argument.name}
                  <span className="text-text-secondary/70"> ({argument.type})</span>
                </span>

                <span className="max-w-[55%] truncate font-mono text-xs text-text-primary">
                  {argument.value || "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {preview.errors.length > 0 && preview.phase !== "draft" && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-sans text-sm text-text-secondary">
            Validation errors
          </p>

          <ul className="mt-3 space-y-2">
            {preview.errors.map((error) => (
              <li
                key={error.field}
                className="flex flex-col gap-1 rounded-default border border-border bg-canvas/60 p-2"
              >
                <span className="font-mono text-[11px] text-accent-forge">
                  {error.code}
                </span>
                <span className="font-sans text-xs text-text-primary">
                  {error.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {preview.deploymentStatus === "missing" && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-sans text-sm text-text-secondary">
            Contract deployment
          </p>

          <p className="mt-2 font-sans text-xs leading-relaxed text-text-secondary">
            This contract has source code, but no deployed contract address is
            configured for {preview.networkLabel}. Soroban simulation cannot run
            until a deployment is registered.
          </p>
        </div>
      )}

      {preview.contractAddress && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-sans text-sm text-text-secondary">
            Contract address
          </p>

          <p className="mt-2 break-all font-mono text-xs text-text-primary">
            {preview.contractAddress}
          </p>
        </div>
      )}

      {preview.preparationError && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-sans text-sm text-text-secondary">
            Preparation error
          </p>

          <p className="mt-2 flex flex-col gap-1 rounded-default border border-border bg-canvas/60 p-2">
            <span className="font-mono text-[11px] text-accent-forge">
              {preview.preparationError.code}
            </span>
            <span className="font-sans text-xs text-text-primary">
              {preview.preparationError.message}
            </span>
            {preview.preparationError.detail && (
              <span className="font-mono text-[11px] text-text-secondary">
                {preview.preparationError.detail}
              </span>
            )}
          </p>
        </div>
      )}

      {preview.simulation && (
        <div className="mt-5 border-t border-border pt-4">
          <p className="font-sans text-sm text-text-secondary">
            Simulation result
          </p>

          <dl className="mt-3 space-y-2">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-sans text-xs text-text-secondary">
                Latest ledger
              </dt>
              <dd className="font-mono text-xs text-text-primary">
                {preview.simulation.latestLedger}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-sans text-xs text-text-secondary">
                Min resource fee
              </dt>
              <dd className="font-mono text-xs text-text-primary">
                {preview.simulation.minResourceFee}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-sans text-xs text-text-secondary">Cost</dt>
              <dd className="font-mono text-xs text-text-primary">
                {preview.simulation.cost.cpuInstructions} CPU,{" "}
                {preview.simulation.cost.memoryBytes} memory
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-sans text-xs text-text-secondary">
                Return value
              </dt>
              <dd className="max-w-[55%] truncate font-mono text-xs text-text-primary">
                {preview.simulation.result
                  ? `${preview.simulation.result.type}: ${preview.simulation.result.value}`
                  : "None"}
              </dd>
            </div>

            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-sans text-xs text-text-secondary">
                Read call
              </dt>
              <dd className="font-mono text-xs text-text-primary">
                {preview.simulation.isReadCall ? "Yes" : "No"}
              </dd>
            </div>
          </dl>

          {preview.simulation.transactionData && (
            <div className="mt-3">
              <p className="font-sans text-xs text-text-secondary">
                Prepared transaction XDR
              </p>

              <pre className="mt-2 overflow-x-auto rounded-default border border-border bg-canvas/60 p-3 font-mono text-[11px] leading-relaxed text-text-secondary">
                <code>{preview.simulation.transactionData}</code>
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <p className="font-sans text-sm text-text-secondary">Status</p>

        <p
          aria-live="polite"
          className={`mt-1 font-mono text-xs ${statusClasses[preview.phase]}`}
        >
          {preview.statusLabel}
        </p>

        {preview.phase === "prepared" && (
          <>
            <p className="mt-2 font-sans text-xs leading-relaxed text-text-secondary">
              Simulation succeeded against the live{" "}
              {preview.networkLabel} RPC. Nothing has been signed or submitted
              on-chain.
            </p>
            {preview.preparedAt && (
              <p className="mt-1 font-mono text-[11px] text-text-secondary">
                Prepared at {preview.preparedAt}
              </p>
            )}
          </>
        )}

        {preview.phase === "blocked" && (
          <p className="mt-2 font-sans text-xs leading-relaxed text-text-secondary">
            No contract deployment is configured for {preview.networkLabel}.
          </p>
        )}
      </div>

      {preview.request && (
        <div className="mt-5">
          <p className="font-sans text-sm text-text-primary">
            Transaction request
          </p>

          <pre className="mt-2 overflow-x-auto rounded-default border border-border bg-canvas/60 p-3 font-mono text-xs leading-relaxed text-text-secondary">
            <code>{JSON.stringify(preview.request, null, 2)}</code>
          </pre>
        </div>
      )}
    </Card>
  );
}