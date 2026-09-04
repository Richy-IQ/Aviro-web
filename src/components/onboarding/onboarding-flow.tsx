"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { requestCode, verifyCode } from "@/app/actions/auth";
import { DemoCode } from "@/components/onboarding/demo-code";
import { Icon, type IconName } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { isValidPhone, maskPhone, normalisePhone } from "@/lib/phone";

type Step = "splash" | "phone" | "code";

const SPLASH_MS = 1600;
const RESEND_SECONDS = 28;
const CODE_LENGTH = 6;

/** Three lines instead of three carousel screens — same promise, no extra taps. */
const VALUE: { icon: IconName; text: string }[] = [
  { icon: "naira", text: "Know your true cost per bird" },
  { icon: "shield", text: "Catch problems before they cost you money" },
  { icon: "trend", text: "Sell on the day the numbers peak" },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("splash");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState<{ code: string; notice?: string } | null>(null);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [pending, startTransition] = useTransition();
  const codeRef = useRef<HTMLInputElement>(null);

  const national = normalisePhone(phone);

  useEffect(() => {
    if (step !== "splash") return;
    const t = setTimeout(() => setStep("phone"), SPLASH_MS);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "code" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  function send() {
    if (!national) return;
    setError(null);
    startTransition(async () => {
      const result = await requestCode(national!);
      if (!result.ok) {
        setError(result.message ?? "Could not send the code.");
        return;
      }
      setDemo(
        result.data?.demoCode
          ? { code: result.data.demoCode, notice: result.data.demoNotice }
          : null,
      );
      setResendIn(RESEND_SECONDS);
      setStep("code");
    });
  }

  function submitCode(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, CODE_LENGTH);
    setCode(digits);
    setError(null);
    if (digits.length < CODE_LENGTH || !national) return;

    startTransition(async () => {
      const result = await verifyCode(national!, digits);
      if (!result.ok) {
        setError(result.message ?? "That code is not correct.");
        return;
      }
      // A first-time farmer goes straight to setting up their farm; a
      // returning one goes home.
      router.push(result.data?.isNewAccount ? "/setup" : "/");
      router.refresh();
    });
  }

  /**
   * Web OTP: on Android Chrome the browser reads the code straight out of the
   * incoming SMS, so the farmer never switches apps or copies anything. Needs
   * a single input with autocomplete="one-time-code", and the SMS to end with
   * "@<domain> #<code>". Silently unavailable elsewhere, which is fine.
   */
  useEffect(() => {
    if (step !== "code" || !("OTPCredential" in window)) return;
    const ac = new AbortController();
    navigator.credentials
      .get({ otp: { transport: ["sms"] }, signal: ac.signal })
      .then((cred) => {
        const otp = cred as OTPCredential | null;
        if (otp?.code) submitCode(otp.code);
      })
      .catch(() => {
        // Aborted, dismissed, or unsupported — the farmer can still type it.
      });
    return () => ac.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (step === "splash") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-7 bg-teal">
        <div className="av-pulse flex flex-col items-center gap-3.5">
          <Logo size={64} withWordmark={false} reverse />
          <div className="text-[48px] leading-none font-medium tracking-[-0.025em] text-white">
            aviro
          </div>
        </div>
        <p className="mt-3 text-[15px]" style={{ color: "rgba(255,255,255,.78)" }}>
          Run your farm by the numbers.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-4 pb-7">
        {step === "phone" ? (
          <>
            <Logo size={26} />

            <div className="flex-1">
              <h1 className="display mt-7 mb-2 text-[28px] text-slate-ink">
                What&rsquo;s your phone number?
              </h1>
              <p className="caption mb-6 text-sm">We&rsquo;ll send a code to confirm it&rsquo;s you.</p>

              <div className="flex gap-2">
                <div className="av-input lg flex w-[104px] items-center gap-1.5 px-3">
                  <span className="text-lg">🇳🇬</span>
                  <span className="num">+234</span>
                </div>
                <input
                  className="av-input lg num flex-1"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  aria-label="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d +]/g, "").slice(0, 17))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isValidPhone(phone)) send();
                  }}
                  placeholder="803 412 9087"
                />
              </div>
              <div className="av-help">
                {/* Any format is accepted; show what we understood. */}
                {phone && !national
                  ? "That doesn't look like a Nigerian mobile number yet."
                  : national
                    ? `We'll text ${maskPhone(national)}`
                    : "Type it however you normally write it."}
              </div>

              <ul className="mt-8 flex flex-col gap-3">
                {VALUE.map((v) => (
                  <li key={v.text} className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[10px] bg-teal-tint text-teal">
                      <Icon name={v.icon} size={17} />
                    </span>
                    <span className="text-sm text-slate-2">{v.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {error && <p className="av-err mb-2">{error}</p>}
            <button
              type="button"
              className="av-btn primary full"
              disabled={!national || pending}
              onClick={send}
            >
              {pending ? "Sending…" : "Send code"}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStep("phone")}
              aria-label="Go back"
              className="av-btn ghost -ml-2 h-10 w-10 border-transparent p-0"
            >
              <Icon name="back" size={20} />
            </button>

            <div className="flex-1">
              <h1 className="display mt-4 mb-2 text-[28px] text-slate-ink">Enter your code</h1>
              <p className="caption mb-6 text-sm">
                Sent to {national ? maskPhone(national) : "your phone"}.
              </p>

              {/* One input, not six boxes: six boxes break SMS autofill. */}
              <input
                ref={codeRef}
                className="av-input xl num text-center tracking-[0.4em]"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-label="6-digit code"
                aria-invalid={error !== null}
                maxLength={CODE_LENGTH}
                value={code}
                autoFocus
                onChange={(e) => submitCode(e.target.value)}
                disabled={pending}
                style={error ? { borderColor: "var(--error)", borderWidth: 2 } : undefined}
              />
              {error && <div className="av-err">{error}</div>}
              {pending && <div className="av-help">Checking…</div>}

              {demo && <DemoCode code={demo.code} notice={demo.notice} />}

              <div className="mt-6 flex gap-4">
                {resendIn > 0 ? (
                  <span className="caption">Resend in 0:{String(resendIn).padStart(2, "0")}</span>
                ) : (
                  <button type="button" className="av-link" onClick={send}>
                    Resend code
                  </button>
                )}
                <button type="button" className="av-link" onClick={() => setStep("phone")}>
                  Change number
                </button>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
}
