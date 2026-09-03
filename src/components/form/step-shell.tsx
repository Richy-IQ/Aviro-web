import type { ReactNode } from "react";
import { Icon } from "@/components/ui/icon";

/**
 * Shared chrome for the multi-step flows (new batch, record sale, onboarding):
 * progress bar, heading, scrolling body, and a footer that sticks above the
 * keyboard on mobile.
 */
export function StepShell({
  step, total, title, subtitle, children, onBack, onNext, nextLabel = "Next", onSkip, nextDisabled,
}: {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  onSkip?: () => void;
  nextDisabled?: boolean;
}) {
  const isLast = step === total - 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="px-4 pt-3">
        <div className="av-progress">
          <i style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="px-4 pt-5 pb-4">
        <h1 className="h1 mb-1.5 text-2xl">{title}</h1>
        {subtitle && <p className="caption mb-4">{subtitle}</p>}
        {children}
      </div>

      <div className="sticky bottom-0 flex gap-2 border-t border-border bg-surface px-4 py-3">
        {onBack && (
          <button type="button" onClick={onBack} className="av-btn ghost flex-1">
            Back
          </button>
        )}
        {onSkip && (
          <button type="button" onClick={onSkip} className="av-btn ghost flex-1">
            Skip
          </button>
        )}
        <button type="button" onClick={onNext} disabled={nextDisabled} className="av-btn primary flex-[2]">
          {nextLabel} {!isLast && <Icon name="arrow" size={16} />}
        </button>
      </div>
    </div>
  );
}
