// The Web OTP API is not in TypeScript's DOM library yet.
// https://developer.mozilla.org/en-US/docs/Web/API/WebOTP_API

interface OTPCredential extends Credential {
  readonly code: string;
}

interface CredentialRequestOptions {
  otp?: { transport: string[] };
}
