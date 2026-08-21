import { Account, Address, MuxedAccount, nativeToScVal, xdr } from "@stellar/stellar-sdk";
import type { ParameterSpec } from "@/data/components";
import { isSupportedParameterType } from "@/lib/transactions/parameter-types";
import type { TransactionPreparationError } from "@/lib/transactions/types";

export type InvocationArgsResult =
  | { ok: true; scVals: xdr.ScVal[] }
  | { ok: false; error: TransactionPreparationError };

export function buildInvocationArgs(
  params: ParameterSpec[],
  values: Record<string, string>,
): InvocationArgsResult {
  const scVals: xdr.ScVal[] = [];

  for (const param of params) {
    const converted = toScVal(param.type, values[param.name] ?? "");
    if (!converted.ok) return { ok: false, error: converted.error };
    scVals.push(converted.scVal);
  }

  return { ok: true, scVals };
}

function toScVal(
  type: string,
  raw: string,
): { ok: true; scVal: xdr.ScVal } | { ok: false; error: TransactionPreparationError } {
  if (!isSupportedParameterType(type)) {
    return {
      ok: false,
      error: {
        code: "parameter-unsupported-type",
        message: `Unsupported Soroban parameter type: ${type}.`,
      },
    };
  }

  switch (type) {
    case "Address": {
      try {
        return { ok: true, scVal: new Address(raw).toScVal() };
      } catch {
        return {
          ok: false,
          error: {
            code: "parameter-invalid-value",
            message: `"${raw}" is not a valid Stellar address.`,
          },
        };
      }
    }
    case "MuxedAddress": {
      try {
        // A MuxedAddress wraps an account (or contract) address with a 64-bit
        // id. Ordinary users supply a normal G-address, so wrap it into a
        // muxed strkey (id 0) before building the ScVal. An M-strkey is used
        // as-is.
        const muxedStrkey = raw.startsWith("M")
          ? raw
          : new MuxedAccount(new Account(raw, "0"), "0").accountId();
        return { ok: true, scVal: new Address(muxedStrkey).toScVal() };
      } catch {
        return {
          ok: false,
          error: {
            code: "parameter-invalid-value",
            message: `"${raw}" is not a valid Stellar address.`,
          },
        };
      }
    }
    case "i128":
      try {
        return { ok: true, scVal: nativeToScVal(BigInt(raw), { type: "i128" }) };
      } catch {
        return {
          ok: false,
          error: {
            code: "parameter-invalid-value",
            message: `"${raw}" is not a valid i128 integer.`,
          },
        };
      }
    case "u32":
      return { ok: true, scVal: nativeToScVal(Number(raw), { type: "u32" }) };
    case "String":
      return { ok: true, scVal: nativeToScVal(raw) };
    case "Symbol":
      return { ok: true, scVal: xdr.ScVal.scvSymbol(raw) };
  }
}