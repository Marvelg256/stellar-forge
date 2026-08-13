import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/components", label: "Components" },
  { href: "/playground", label: "Playground" },
  { href: "/docs", label: "Docs" },
];

export function Navbar() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="rounded-default font-display text-base font-medium text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar"
        >
          Stellar-Forge
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-default font-sans text-sm text-text-secondary transition-colors duration-150 ease-out hover:text-accent-stellar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar motion-reduce:transition-none"
            >
              {link.label}
            </Link>
          ))}

          <a
            href="https://github.com/Marvelg256/stellar-forge"
            target="_blank"
            rel="noreferrer"
            className="rounded-default font-sans text-sm text-text-secondary transition-colors duration-150 ease-out hover:text-accent-stellar focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar motion-reduce:transition-none"
          >
            GitHub
          </a>
        </nav>

        <Button variant="primary" className="text-sm">
          Get Started
        </Button>
      </div>
    </header>
  );
}