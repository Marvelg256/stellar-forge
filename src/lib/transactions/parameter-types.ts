export const SUPPORTED_PARAMETER_TYPES = [
  "Address",
  "MuxedAddress",
  "i128",
  "u32",
  "String",
  "Symbol",
] as const;

export type SupportedParameterType = (typeof SUPPORTED_PARAMETER_TYPES)[number];

export function isSupportedParameterType(
  type: string,
): type is SupportedParameterType {
  return (SUPPORTED_PARAMETER_TYPES as readonly string[]).includes(type);
}