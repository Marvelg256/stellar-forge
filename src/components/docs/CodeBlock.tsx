"use client";

import { useState } from "react";

export function CodeBlock({
  code,
  label,
  className = "",
}: {
  code: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div
      className={`mt-4 overflow-hidden rounded-default border border-border bg-canvas/60 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        {label && (
          <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
            {label}
          </span>
        )}

        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto rounded-default px-2 py-0.5 font-mono text-[11px] text-text-secondary transition-colors hover:text-accent-stellar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-text-primary">
        <code>{code}</code>
      </pre>

      <span className="sr-only" aria-live="polite">
        {copied ? "Code copied" : ""}
      </span>
    </div>
  );
}