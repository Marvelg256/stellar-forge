import type {
  TransactionPreviewData,
  TransactionRequest,
} from "@/lib/transactions/types";
import { Card } from "@/components/ui/Card";

const statusLabels: Record<TransactionPreviewData["status"], string> = {
  ready: "Ready to build",
  incomplete: "Waiting for required parameters",
  built: "Built — local transaction request",
};

const statusClasses: Record<TransactionPreviewData["status"], string> = {
  ready: "text-accent-stellar",
  incomplete: "text-accent-forge",
  built: "text-accent-stellar",
};

export interface TransactionPreviewProps {
  preview: TransactionPreviewData;
  request: TransactionRequest | null;
  attempted: boolean;
}

export function TransactionPreview({
  preview,
  request,
  attempted,
}: TransactionPreviewProps) {
  const statusLabel =
    preview.status === "incomplete" && attempted
      ? "Cannot build — fill the highlighted required fields"
      : statusLabels[preview.status];

  return (
    <Card className="h-fit">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs uppercase tracking-wide text-accent-stellar">
          Transaction Preview
        </h2>

        <span
          className={`rounded-default border border-border px-2 py-0.5 font-mono text-[11px] ${statusClasses[preview.status]}`}
        >
          {statusLabel}
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
                </span>

                <span className="max-w-[55%] truncate font-mono text-xs text-text-primary">
                  {argument.value || "—"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 border-t border-border pt-4">
        <p className="font-sans text-sm text-text-secondary">Status</p>

        <p
          aria-live="polite"
          className={`mt-1 font-mono text-xs ${statusClasses[preview.status]}`}
        >
          {statusLabel}
        </p>
      </div>

      {request && (
        <div className="mt-5">
          <p className="font-sans text-sm text-text-primary">Built request</p>

          <pre className="mt-2 overflow-x-auto rounded-default border border-border bg-canvas/60 p-3 font-mono text-xs leading-relaxed text-text-secondary">
            <code>{JSON.stringify(request, null, 2)}</code>
          </pre>
        </div>
      )}
    </Card>
  );
}