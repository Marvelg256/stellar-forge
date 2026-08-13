import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * When true, the border subtly shifts toward accent-forge on hover —
   * a restrained "ignite" cue. Never a permanent fill or a glow/shadow effect.
   */
  glow?: boolean;
  children: ReactNode;
}

export function Card({ glow = false, className = "", children, ...props }: CardProps) {
  return (
    <div
      className={[
        "rounded-default border border-border bg-surface p-6",
        "transition-colors duration-200 ease-out motion-reduce:transition-none",
        glow ? "hover:border-accent-forge/60" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
