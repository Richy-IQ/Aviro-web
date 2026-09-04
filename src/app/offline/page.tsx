import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";

export const metadata = { title: "No connection · Aviro" };

/**
 * Shown when a screen has never been opened on this phone and there is no
 * connection to fetch it. Deliberately reassuring about what is not lost.
 */
export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-cream px-6 text-center">
      <Logo size={28} />
      <div className="mt-4 grid h-16 w-16 place-items-center rounded-[18px] bg-warning-soft text-warning-ink">
        <Icon name="wifi-off" size={28} />
      </div>
      <h1 className="h2">No connection</h1>
      <p className="caption max-w-[300px] leading-[1.6]">
        This screen has not been opened on this phone yet, so there is nothing saved to show.
        Anything you have already logged is safe and will send when you have signal again.
      </p>
    </div>
  );
}
