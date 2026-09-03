"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FieldLabel, Select } from "@/components/form/fields";
import { Icon, type IconName } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { BIRD_TYPES, LGAS, STATES } from "@/lib/farm-data";

type Step = "splash" | "welcome" | "phone" | "otp" | "profile" | "farmsetup" | "complete";
const ORDER: Step[] = ["welcome", "phone", "otp", "profile", "farmsetup", "complete"];

const SPLASH_MS = 1600;
const RESEND_SECONDS = 28;
const OTP_LENGTH = 6;
const DEMO_CODE = "260411";

const SLIDES: { eyebrow: string; title: string; body: string; glyph: IconName }[] = [
  {
    eyebrow: "01 · Cost",
    title: "Know your true cost per bird.",
    body: "Log feed, mortality, and meds in two minutes a day. Aviro calculates the rest.",
    glyph: "naira",
  },
  {
    eyebrow: "02 · Prevention",
    title: "Catch problems before they cost you money.",
    body: "Smart alerts spot disease spikes and vaccination gaps before they wipe out your flock.",
    glyph: "shield",
  },
  {
    eyebrow: "03 · Timing",
    title: "Sell at the right time, every time.",
    body: "We tell you exactly when to sell, based on bird weight, feed price and market rates today.",
    glyph: "trend",
  },
];

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("splash");
  const [slide, setSlide] = useState(0);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const [profile, setProfile] = useState({ first: "", last: "", state: "Oyo", lga: "Ibadan North" });
  const [farm, setFarm] = useState({ name: "", location: "Ibadan, Oyo", types: ["broiler"] as string[] });
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== "splash") return;
    const t = setTimeout(() => setStep("welcome"), SPLASH_MS);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (step !== "otp" || resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [step, resendIn]);

  const finish = () => router.push("/batches/new");
  const progressIdx = ORDER.indexOf(step);

  if (step === "splash") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-7 bg-teal">
        <div className="av-pulse flex flex-col items-center gap-3.5">
          <Logo size={64} withWordmark={false} reverse />
          <div className="text-[48px] leading-none font-medium tracking-[-0.025em] text-white">aviro</div>
        </div>
        <p className="mt-3 text-[15px]" style={{ color: "rgba(255,255,255,.78)" }}>
          Run your farm by the numbers.
        </p>
      </div>
    );
  }

  const fillOtp = (i: number, v: string) => {
    const next = [...otp];
    next[i] = v.slice(-1);
    setOtp(next);
    if (v && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
    if (next.every(Boolean)) {
      if (next.join("") === DEMO_CODE) {
        setOtpError(false);
        setStep("profile");
      } else {
        setOtpError(true);
      }
    }
  };

  const phoneValid = /^[789]\d{9}$/.test(phone.replace(/\s/g, ""));

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {progressIdx > 0 && progressIdx < ORDER.length - 1 && (
        <div className="av-stepper">
          {ORDER.slice(0, -1).map((s, i) => (
            <i key={s} className={i === progressIdx ? "active" : i < progressIdx ? "done" : ""} />
          ))}
        </div>
      )}

      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col px-6 pt-2 pb-7">
        {step === "welcome" && (
          <>
            <div className="flex justify-end">
              <button type="button" className="av-link" onClick={() => setStep("phone")}>
                Skip
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center pt-6">
              <div className="mb-7 grid h-22 w-22 place-items-center rounded-3xl bg-teal-tint text-teal">
                <Icon name={SLIDES[slide].glyph} size={42} stroke={1.5} />
              </div>
              <div className="label mb-3">{SLIDES[slide].eyebrow}</div>
              <h1 className="display mb-3.5 text-[32px] text-teal">{SLIDES[slide].title}</h1>
              <p className="max-w-[320px] text-base leading-[1.55] text-slate-2">{SLIDES[slide].body}</p>
            </div>
            <div className="mb-5 flex justify-center gap-1.5">
              {SLIDES.map((s, i) => (
                <button
                  key={s.eyebrow}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className="h-[7px] rounded-full border-0 p-0 transition-all"
                  style={{
                    width: i === slide ? 22 : 7,
                    background: i === slide ? "var(--av-teal)" : "var(--border-strong)",
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              className="av-btn primary block"
              onClick={() => (slide === SLIDES.length - 1 ? setStep("phone") : setSlide(slide + 1))}
            >
              {slide === SLIDES.length - 1 ? "Get started" : "Next"}
            </button>
          </>
        )}

        {step === "phone" && (
          <>
            <BackButton onClick={() => setStep("welcome")} />
            <div className="flex-1">
              <h1 className="display mt-4 mb-2 text-[28px] text-slate-ink">What&rsquo;s your phone number?</h1>
              <p className="caption mb-6 text-sm">We&rsquo;ll send you a code to verify.</p>
              <div className="flex gap-2">
                <div className="av-input lg flex w-[110px] items-center gap-1.5 px-3">
                  <span className="text-lg">🇳🇬</span>
                  <span className="num">+234</span>
                </div>
                <input
                  className="av-input lg num flex-1 tracking-[.02em]"
                  inputMode="numeric"
                  value={phone}
                  aria-label="Phone number"
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, "").slice(0, 11))}
                  placeholder="803 412 9087"
                />
              </div>
              <div className="av-help">10 digits, no leading zero</div>
            </div>
            <button
              type="button"
              className="av-btn primary block"
              disabled={!phoneValid}
              onClick={() => setStep("otp")}
            >
              Send code
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <BackButton onClick={() => setStep("phone")} />
            <div className="flex-1">
              <h1 className="display mt-4 mb-2 text-[28px] text-slate-ink">Enter the 6-digit code</h1>
              <p className="caption mb-7 text-sm">
                Sent to +234 ··· ··· {phone.replace(/\s/g, "").slice(-4) || "9087"}
              </p>

              <div className="mb-1.5 flex gap-2">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpRefs.current[i] = el;
                    }}
                    value={v}
                    maxLength={1}
                    inputMode="numeric"
                    aria-label={`Digit ${i + 1}`}
                    aria-invalid={otpError}
                    onChange={(e) => fillOtp(i, e.target.value.replace(/\D/g, ""))}
                    className="num h-15 flex-1 rounded-card bg-surface text-center text-[26px] font-medium text-slate-ink outline-none"
                    style={{
                      border: `${otpError ? 2 : 1}px solid ${otpError ? "var(--error)" : "var(--border)"}`,
                    }}
                  />
                ))}
              </div>
              {otpError && <div className="av-err">That code didn&rsquo;t match. Try again.</div>}

              <div className="mt-6 flex gap-4">
                {resendIn > 0 ? (
                  <span className="caption">Resend in 0:{String(resendIn).padStart(2, "0")}</span>
                ) : (
                  <button type="button" className="av-link" onClick={() => setResendIn(RESEND_SECONDS)}>
                    Resend code
                  </button>
                )}
                <button type="button" className="av-link" onClick={() => setStep("phone")}>
                  Change number
                </button>
              </div>

              <button
                type="button"
                className="av-btn tertiary sm mt-4.5"
                onClick={() => {
                  setOtp(DEMO_CODE.split(""));
                  setStep("profile");
                }}
              >
                Demo: autofill code
              </button>
            </div>
          </>
        )}

        {step === "profile" && (
          <>
            <div className="flex-1">
              <h1 className="display mt-6 mb-2 text-[28px] text-slate-ink">What should we call you?</h1>
              <p className="caption mb-6 text-sm">This is how we&rsquo;ll greet you in the app.</p>

              <FieldLabel htmlFor="first">First name</FieldLabel>
              <input
                id="first"
                className="av-input lg"
                value={profile.first}
                onChange={(e) => setProfile({ ...profile, first: e.target.value })}
              />

              <div className="h-3.5" />
              <FieldLabel htmlFor="last" optional>
                Last name
              </FieldLabel>
              <input
                id="last"
                className="av-input lg"
                value={profile.last}
                onChange={(e) => setProfile({ ...profile, last: e.target.value })}
                placeholder="Optional"
              />

              <div className="h-5.5" />
              <FieldLabel htmlFor="state">State</FieldLabel>
              <Select
                id="state"
                value={profile.state}
                options={STATES.map((s) => ({ value: s, label: s }))}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    state: e.target.value,
                    lga: (LGAS[e.target.value] ?? ["—"])[0],
                  })
                }
              />

              <div className="h-3.5" />
              <FieldLabel htmlFor="lga">LGA</FieldLabel>
              <Select
                id="lga"
                value={profile.lga}
                options={(LGAS[profile.state] ?? ["—"]).map((l) => ({ value: l, label: l }))}
                onChange={(e) => setProfile({ ...profile, lga: e.target.value })}
              />
            </div>
            <button
              type="button"
              className="av-btn primary block"
              disabled={profile.first.trim().length < 2}
              onClick={() => setStep("farmsetup")}
            >
              Continue
            </button>
          </>
        )}

        {step === "farmsetup" && (
          <>
            <div className="flex-1">
              <h1 className="display mt-6 mb-2 text-[28px] text-slate-ink">Tell us about your farm</h1>
              <p className="caption mb-6 text-sm">You can add more farms or change this later.</p>

              <FieldLabel htmlFor="farm-name">Farm name</FieldLabel>
              <input
                id="farm-name"
                className="av-input lg"
                value={farm.name}
                onChange={(e) => setFarm({ ...farm, name: e.target.value })}
                placeholder={profile.first ? `${profile.first}'s Poultry` : "Your farm"}
              />

              <div className="h-3.5" />
              <FieldLabel htmlFor="farm-location">Farm location</FieldLabel>
              <input
                id="farm-location"
                className="av-input lg"
                value={farm.location}
                onChange={(e) => setFarm({ ...farm, location: e.target.value })}
              />
              <div className="av-help">Auto-filled from your profile. Edit if your farm is elsewhere.</div>

              <div className="h-5.5" />
              <FieldLabel>What do you raise?</FieldLabel>
              <div className="grid grid-cols-2 gap-2">
                {BIRD_TYPES.map((t) => {
                  const on = farm.types.includes(t.v);
                  return (
                    <button
                      key={t.v}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setFarm({
                          ...farm,
                          types: on ? farm.types.filter((x) => x !== t.v) : [...farm.types, t.v],
                        })
                      }
                      className="rounded-card p-3.5 text-left text-slate-ink"
                      style={{
                        border: on ? "2px solid var(--av-teal)" : "1px solid var(--border)",
                        background: on ? "var(--av-teal-haze)" : "var(--surface)",
                      }}
                    >
                      <div className="text-sm font-medium">{t.label}</div>
                      <div className="caption mt-0.5">{t.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            <button
              type="button"
              className="av-btn primary block mt-4"
              disabled={!farm.name.trim() || farm.types.length === 0}
              onClick={() => setStep("complete")}
            >
              Create farm
            </button>
          </>
        )}

        {step === "complete" && (
          <>
            <div className="flex flex-1 flex-col justify-center text-center">
              <div className="mx-auto mb-7 grid h-20 w-20 place-items-center rounded-[26px] bg-soft-mint text-teal">
                <Icon name="check" size={40} stroke={2.4} />
              </div>
              <h1 className="display mb-3 text-[32px] text-teal">You&rsquo;re set up.</h1>
              <p className="mx-auto max-w-[320px] text-[15px] leading-[1.6] text-slate-2">
                <b className="text-slate-ink">{farm.name}</b> is ready. Create your first batch now to start
                tracking — it takes about 60 seconds.
              </p>
            </div>
            <button type="button" className="av-btn primary block" onClick={finish}>
              Create your first batch
            </button>
            <button type="button" className="av-btn ghost block mt-2" onClick={() => router.push("/")}>
              I&rsquo;ll do this later
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="Go back" className="av-btn ghost -ml-2 h-10 w-10 border-transparent p-0">
      <Icon name="back" size={20} />
    </button>
  );
}
