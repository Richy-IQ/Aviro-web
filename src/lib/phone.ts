// Nigerian mobile numbers.
//
// People write their own number several ways — 08034129087, 8034129087,
// +2348034129087, with spaces or dashes. Rejecting any of those is the app's
// problem, not the farmer's, so we accept all of them and normalise.

/** The 10 significant digits, without country code or trunk zero. */
export type NationalNumber = string;

const MOBILE_PREFIX = /^[789]/;

/**
 * Reduce any input to its 10 national digits, or null if it cannot be one.
 * Nigerian mobile numbers are 10 digits after the trunk zero, starting 7, 8
 * or 9.
 */
export function normalisePhone(input: string): NationalNumber | null {
  const digits = input.replace(/\D/g, "");

  let national: string;
  if (digits.startsWith("234")) national = digits.slice(3);
  else if (digits.startsWith("0")) national = digits.slice(1);
  else national = digits;

  if (national.length !== 10) return null;
  if (!MOBILE_PREFIX.test(national)) return null;
  return national;
}

export function isValidPhone(input: string): boolean {
  return normalisePhone(input) !== null;
}

/** E.164, which is what the API and any SMS or WhatsApp provider expects. */
export function toE164(national: NationalNumber): string {
  return `+234${national}`;
}

/** Grouped for display: 803 412 9087. */
export function formatNational(national: NationalNumber): string {
  return national.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}

/** Masked for the "we sent a code to…" line. */
export function maskPhone(national: NationalNumber): string {
  return `+234 ••• ••• ${national.slice(-4)}`;
}
