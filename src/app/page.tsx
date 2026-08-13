import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Home() {
  return (
    <main className="min-h-full bg-canvas px-6 py-12">
      <section className="mx-auto max-w-3xl space-y-10">
        <div>
          <p className="mb-2 font-mono text-xs text-text-secondary">
            TEMP PREVIEW — remove before Step 4
          </p>

          <h1 className="font-display text-3xl font-medium text-text-primary">
            UI Primitive Preview
          </h1>

          <p className="mt-2 font-sans text-sm text-text-secondary">
            Body copy in Inter. Verifying contrast, hierarchy, and spacing.
          </p>

          <code className="mt-2 block font-mono text-xs text-accent-stellar">
            const preview = &quot;IBM Plex Mono for code&quot;;
          </code>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Run</Button>

          <Button variant="secondary">Connect Wallet</Button>

          <Button variant="ghost">Cancel</Button>

          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h2 className="font-display text-lg text-text-primary">
              Normal card
            </h2>

            <p className="mt-1 font-sans text-sm text-text-secondary">
              Static border-default, no hover shift.
            </p>
          </Card>

          <Card glow>
            <h2 className="font-display text-lg text-text-primary">
              Glow card
            </h2>

            <p className="mt-1 font-sans text-sm text-text-secondary">
              Hover this — border should shift toward accent-forge, restrained.
            </p>
          </Card>
        </div>
      </section>
    </main>
  );
}