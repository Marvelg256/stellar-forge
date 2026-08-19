import type { StellarComponent } from "@/data/components";

export type IntegrationLanguage = "rust";

export interface IntegrationLanguageOption {
  value: IntegrationLanguage;
  label: string;
}

export const INTEGRATION_LANGUAGES: IntegrationLanguageOption[] = [
  { value: "rust", label: "Rust" },
];

export interface IntegrationContext {
  component: StellarComponent;
  configValues: Record<string, string>;
}