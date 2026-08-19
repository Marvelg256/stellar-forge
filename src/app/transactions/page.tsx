import { TransactionBuilder } from "@/components/transactions/TransactionBuilder";

export default function TransactionsPage() {
  return (
    <main className="flex-1">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-xs tracking-[0.18em] text-accent-stellar">
            STELLAR-FORGE / TRANSACTIONS
          </p>

          <h1 className="font-display text-4xl font-medium leading-tight text-text-primary sm:text-5xl">
            Transaction Builder
          </h1>

          <p className="mt-5 font-sans text-base leading-7 text-text-secondary sm:text-lg">
            Construct a transaction, simulate it against a live Soroban RPC,
            and sign the prepared envelope with your Freighter wallet. Select an
            implemented component, choose a contract method, fill its
            parameters, and build a typed transaction request.
          </p>
        </div>

        <TransactionBuilder />
      </section>
    </main>
  );
}