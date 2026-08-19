import { getConfigDefaults, type StellarComponent } from "@/data/components";

export function buildConfigSnippet(component: StellarComponent): string {
  const fields = component.config ?? [];
  const values = getConfigDefaults(component);
  const keyWidth = Math.max(0, ...fields.map((field) => field.key.length));

  return [
    `// ${component.slug} configuration`,
    ...fields.map((field) => {
      const value = values[field.key];
      const shown =
        field.type === "text" || field.type === "select"
          ? `"${value}"`
          : value;
      return `// ${field.key.padEnd(keyWidth)} = ${shown}    // ${field.label}`;
    }),
  ].join("\n");
}