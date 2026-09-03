import { TopBar } from "@/components/ui/top-bar";
import { BIRD_TYPES, BREEDS } from "@/lib/farm-data";

export const metadata = { title: "New batch · Aviro" };

export default function NewBatchPage() {
  return (
    <div className="mx-auto w-full max-w-2xl pb-7">
      <TopBar title="Start a new batch" backHref="/batches" subtitle="Step 1 of 4" />
      <div className="p-4">
        <h2 className="h1 mb-1.5 text-2xl">What are you raising?</h2>
        <p className="caption mb-5">You can change this later.</p>

        <div className="mb-6 flex flex-col gap-2">
          {BIRD_TYPES.map((t) => (
            <button
              key={t.v}
              type="button"
              className="flex items-center gap-3 rounded-card border border-border bg-surface p-3.5 text-left"
            >
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-medium">{t.label}</div>
                <div className="caption text-xs">{t.sub}</div>
              </div>
            </button>
          ))}
        </div>

        <label className="label mb-2 block" htmlFor="breed">
          Breed
        </label>
        <select id="breed" className="av-input" defaultValue="">
          <option value="" disabled>
            Choose a breed
          </option>
          {BREEDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <button type="button" className="av-btn primary block mt-6">
          Next
        </button>
      </div>
    </div>
  );
}
