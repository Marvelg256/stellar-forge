import { Button } from "@/components/ui/Button";
import type { WalletState } from "@/lib/wallet/types";

export interface WalletConnectionProps {
  wallet: WalletState;
  networkLabel: string;
  networkMismatch: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

export function WalletConnection({
  wallet,
  networkLabel,
  networkMismatch,
  onConnect,
  onDisconnect,
}: WalletConnectionProps) {
  return (
    <div className="mt-5 rounded-default border border-border bg-canvas/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wide text-text-secondary">
            Wallet
          </p>

          {wallet.status === "checking" && (
            <p className="mt-1 font-sans text-sm text-text-secondary">
              Checking for Freighter…
            </p>
          )}

          {wallet.status === "unavailable" && (
            <p className="mt-1 font-sans text-sm leading-relaxed text-text-secondary">
              Freighter is not installed. Install the Freighter browser
              extension to connect a wallet.
            </p>
          )}

          {wallet.status === "disconnected" && (
            <p className="mt-1 font-sans text-sm text-text-secondary">
              No wallet connected.
            </p>
          )}

          {wallet.status === "connecting" && (
            <p className="mt-1 font-sans text-sm text-text-secondary">
              Waiting for wallet approval…
            </p>
          )}

          {wallet.status === "connected" && wallet.address && (
            <p className="mt-1 break-all font-mono text-sm text-text-primary">
              {shortenAddress(wallet.address)}
              <span className="ml-2 font-sans text-xs text-text-secondary">
                {wallet.networkName ?? "Unknown network"}
              </span>
            </p>
          )}
        </div>

        {wallet.status === "connected" ? (
          <Button variant="secondary" onClick={onDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={onConnect}
            disabled={wallet.status === "checking" || wallet.status === "unavailable"}
          >
            Connect Freighter
          </Button>
        )}
      </div>

      {wallet.status === "connected" && networkMismatch && (
        <p className="mt-3 rounded-default border border-accent-forge/40 bg-accent-forge/10 p-2 font-sans text-xs leading-relaxed text-text-primary">
          Your wallet is on a different network than the selected {networkLabel}.
          Switch the wallet network or change the builder network before
          signing.
        </p>
      )}

      {wallet.error && (
        <p className="mt-3 font-sans text-xs leading-relaxed text-accent-forge">
          {wallet.error.message}
        </p>
      )}
    </div>
  );
}