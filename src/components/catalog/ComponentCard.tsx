import Link from "next/link";
import { Card } from "@/components/ui/Card";

export interface ComponentCardProps {
  name: string;
  description: string;
  category: string;
  status?: string;
  href: string;
  cta?: string;
}

export function ComponentCard({
  name,
  description,
  category,
  status = "Concept",
  href,
  cta = "View component",
}: ComponentCardProps) {
  return (
    <Link href={href} className="group block h-full focus-visible:outline-none">
      <Card className="flex h-full flex-col justify-between transition-colors duration-200 ease-out hover:border-accent-stellar/60 motion-reduce:transition-none group-focus-visible:border-accent-stellar group-focus-visible:ring-2 group-focus-visible:ring-accent-stellar">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
              {category}
            </span>
            <span className="rounded-default border border-border px-2 py-0.5 font-mono text-[11px] text-accent-stellar">
              {status}
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg font-medium text-text-primary">
            {name}
          </h3>

          <p className="mt-2 font-sans text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        </div>

        <span className="mt-6 inline-flex items-center gap-1 font-mono text-xs text-text-secondary group-hover:text-accent-stellar">
          {cta}
          <span aria-hidden="true">→</span>
        </span>
      </Card>
    </Link>
  );
}