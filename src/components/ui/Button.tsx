import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const baseStyles = [
  "inline-flex items-center justify-center gap-2",
  "rounded-default px-4 py-2",
  "font-sans text-sm font-medium",
  "transition-colors duration-150 ease-out motion-reduce:transition-none",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
  "disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
  // accent-forge = active/primary action. High-contrast dark foreground
  // on the warm accent, per the locked semantic color rule.
  primary:
    "bg-accent-forge text-canvas hover:bg-accent-forge/90 active:bg-accent-forge/80",

  // accent-stellar = passive/structural. Outline only, never a solid fill,
  // so it reads as secondary next to a primary forge button.
  secondary:
    "bg-transparent border border-accent-stellar text-accent-stellar hover:bg-accent-stellar/10 active:bg-accent-stellar/15",

  // No accent color at all — lowest-emphasis action.
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface active:bg-surface/80",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[baseStyles, variantStyles[variant], className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
