"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MethodSelector } from "@/components/transactions/MethodSelector";
import { ParameterForm } from "@/components/transactions/ParameterForm";
import { TransactionPreview } from "@/components/transactions/TransactionPreview";
import { WalletConnection } from "@/components/transactions/WalletConnection";
import { stellarComponents } from "@/data/components";
import {
  buildPreview,
  buildTransactionRequest,
  callableMethods,
  emptyParameters,
  implementedComponents,
  initialBuilderState,
  validateBuilderState,
} from "@/lib/transactions/builder";
import { prepareTransactionRequest } from "@/lib/transactions/client";
import {
  TRANSACTION_NETWORKS,
  networkConfig,
  type TransactionNetwork,
} from "@/lib/transactions/networks";
import type {
  TransactionBuilderState,
  TransactionPreparation,
  TransactionSigningState,
} from "@/lib/transactions/types";
import { useWallet } from "@/lib/wallet/useWallet";
import type { WalletError } from "@/lib/wallet/types";

const selectClass =
  "mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-sans text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar disabled:opacity-60";

const inputClass =
  "mt-2 w-full rounded-default border border-border bg-surface px-3 py-2 font-mono text-sm text-text-primary placeholder:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-stellar disabled:opacity-60";

const implemented = implementedComponents(stellarComponents);

function signingError(message: string): WalletError {
  return { code: "unknown", message };
}

export function TransactionBuilder() {
  const [state, setState] = useState<TransactionBuilderState>(() =>
    initialBuilderState(stellarComponents),
  );
  const [preparation, setPreparation] = useState<TransactionPreparation>({
    phase: "draft",
  });
  const [signing, setSigning] = useState<TransactionSigningState>({
    phase: "idle",
  });
  const [previousWalletAddress, setPreviousWalletAddress] = useState<
    string | null
  >(null);
  const wallet = useWallet();

  const selectedComponent =
    implemented.find((component) => component.slug === state.componentSlug) ??
    implemented[0];
  const selectedMethod = callableMethods(selectedComponent).find(
    (fn) => fn.name === state.methodName,
  );
  const effectiveState: TransactionBuilderState = {
    ...state,
    sourceAccount:
      wallet.state.status === "connected"
        ? (wallet.state.address ?? "")
        : state.sourceAccount,
  };
  const validation = validateBuilderState(effectiveState, stellarComponents);
  const walletNetworkMismatch =
    wallet.state.status === "connected" &&
    wallet.state.networkPassphrase !== networkConfig(state.network).passphrase;
  const preview = buildPreview(
    effectiveState,
    stellarComponents,
    preparation,
    wallet.state,
    signing,
  );

  if (wallet.state.address !== previousWalletAddress) {
    setPreviousWalletAddress(wallet.state.address);
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  function selectComponent(slug: string) {
    const component = implemented.find(
      (candidate) => candidate.slug === slug,
    );
    if (!component) return;

    const method = callableMethods(component)[0];

    setState((previous) => ({
      ...previous,
      componentSlug: component.slug,
      methodName: method?.name ?? "",
      parameters: method ? emptyParameters(method.params) : {},
    }));
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  function selectMethod(methodName: string) {
    const component = implemented.find(
      (candidate) => candidate.slug === state.componentSlug,
    );
    if (!component) return;

    const method = callableMethods(component).find(
      (fn) => fn.name === methodName,
    );
    if (!method) return;

    setState((previous) => ({
      ...previous,
      methodName: method.name,
      parameters: emptyParameters(method.params),
    }));
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  function updateParameter(name: string, value: string) {
    setState((previous) => ({
      ...previous,
      parameters: { ...previous.parameters, [name]: value },
    }));
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  function updateNetwork(network: TransactionNetwork) {
    setState((previous) => ({ ...previous, network }));
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  function updateSourceAccount(sourceAccount: string) {
    setState((previous) => ({ ...previous, sourceAccount }));
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  async function build() {
    const request = buildTransactionRequest(effectiveState);
    setPreparation({ phase: "built", request });
    setSigning({ phase: "idle" });

    setPreparation({ phase: "preparing", request });

    const result = await prepareTransactionRequest(request);
    setPreparation(
      result.status === "prepared"
        ? { phase: "prepared", result }
        : result.status === "blocked"
          ? { phase: "blocked", result }
          : { phase: "failed", result },
    );
  }

  async function sign() {
    if (preparation.phase !== "prepared") return;

    if (wallet.state.status !== "connected" || !wallet.state.address) {
      setSigning({
        phase: "sign-failed",
        error: {
          code: "wallet-unavailable",
          message: "Connect a wallet before signing.",
        },
      });
      return;
    }

    if (walletNetworkMismatch) {
      setSigning({
        phase: "sign-failed",
        error: {
          code: "wallet-network-mismatch",
          message: `Your wallet is on ${
            wallet.state.networkName ?? "another network"
          }, but the builder is using ${
            networkConfig(state.network).label
          }. Switch the wallet network or change the builder network before signing.`,
        },
      });
      return;
    }

    let envelope = preparation.result.simulation.transactionData;
    const expiresAt = preparation.result.simulation.expiresAt;

    if (!envelope) {
      setSigning({
        phase: "sign-failed",
        error: signingError("The prepared transaction has no envelope XDR."),
      });
      return;
    }

    setSigning({ phase: "signing" });

    if (expiresAt > 0 && Date.now() >= expiresAt) {
      const request = preparation.result.request;
      setPreparation({ phase: "preparing", request });
      const fresh = await prepareTransactionRequest(request);
      if (fresh.status === "prepared") {
        setPreparation({ phase: "prepared", result: fresh });
        envelope = fresh.simulation.transactionData;
      } else {
        setPreparation(
          fresh.status === "blocked"
            ? { phase: "blocked", result: fresh }
            : { phase: "failed", result: fresh },
        );
        setSigning({
          phase: "sign-failed",
          error: signingError(
            "The prepared transaction expired and could not be re-prepared. Please try again.",
          ),
        });
        return;
      }
    }

    const result = await wallet.signTransaction(
      envelope,
      preparation.result.request.sourceAccount,
    );

    if (result.ok) {
      setPreparation({
        phase: "signed",
        request: preparation.result.request,
      });
      setSigning({
        phase: "signed",
        signedXdr: result.signed.signedXdr,
        signerAddress: result.signed.signerAddress,
        signedAt: new Date().toISOString(),
      });
    } else {
      setSigning({ phase: "sign-failed", error: result.error });
    }
  }

  function reset() {
    setState(initialBuilderState(stellarComponents));
    setPreparation({ phase: "draft" });
    setSigning({ phase: "idle" });
  }

  const sourceAccountLocked = wallet.state.status === "connected";

  return (
    <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
            Builder
          </p>

          <WalletConnection
            wallet={wallet.state}
            networkLabel={networkConfig(state.network).label}
            networkMismatch={walletNetworkMismatch}
            onConnect={() => void wallet.connect()}
            onDisconnect={wallet.disconnect}
          />

          <div className="mt-5 space-y-5">
            <MethodSelector
              components={implemented}
              selectedComponent={selectedComponent}
              selectedMethodName={state.methodName}
              onComponentChange={selectComponent}
              onMethodChange={selectMethod}
            />

            <div>
              <label htmlFor="tx-network" className="block">
                <span className="font-sans text-sm text-text-primary">
                  Network
                </span>
              </label>

              <select
                id="tx-network"
                value={state.network}
                onChange={(event) =>
                  updateNetwork(event.target.value as TransactionNetwork)
                }
                className={selectClass}
              >
                {TRANSACTION_NETWORKS.map((network) => (
                  <option key={network.id} value={network.id}>
                    {network.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tx-source-account" className="block">
                <span className="font-sans text-sm text-text-primary">
                  Source account
                </span>
              </label>

              <input
                id="tx-source-account"
                type="text"
                value={effectiveState.sourceAccount}
                onChange={(event) => updateSourceAccount(event.target.value)}
                placeholder={sourceAccountLocked ? undefined : "G..."}
                readOnly={sourceAccountLocked}
                disabled={sourceAccountLocked}
                className={inputClass}
              />

              <p className="mt-2 font-sans text-xs leading-relaxed text-text-secondary">
                {sourceAccountLocked
                  ? "Locked to the connected wallet address."
                  : "Connect a wallet to use its address as the source account."}
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="font-mono text-xs uppercase tracking-wide text-text-secondary">
            Arguments
          </p>

          <div className="mt-5">
            <ParameterForm
              params={selectedMethod?.params ?? []}
              values={state.parameters}
              errors={validation.errors}
              onChange={updateParameter}
            />
          </div>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={() => void build()}>
            Build Transaction
          </Button>

          <Button
            variant="secondary"
            onClick={() => void sign()}
            disabled={
              preparation.phase !== "prepared" ||
              wallet.state.status !== "connected" ||
              walletNetworkMismatch ||
              signing.phase === "signing" ||
              signing.phase === "signed"
            }
          >
            {signing.phase === "signing"
              ? "Waiting for wallet…"
              : signing.phase === "signed"
                ? "Signed"
                : "Sign Transaction"}
          </Button>

          <Button variant="ghost" onClick={reset}>
            Reset
          </Button>
        </div>

        {preparation.phase === "prepared" &&
          wallet.state.status === "connected" &&
          walletNetworkMismatch && (
            <p className="font-sans text-xs leading-relaxed text-accent-forge">
              The wallet network does not match the selected network. Signing is
              disabled until they match.
            </p>
          )}

        {preparation.phase === "prepared" &&
          wallet.state.status !== "connected" && (
            <p className="font-sans text-xs leading-relaxed text-text-secondary">
              Connect a wallet to sign the prepared transaction.
            </p>
          )}
      </div>

      <TransactionPreview preview={preview} />
    </div>
  );
}