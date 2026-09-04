"use server";

import { redirect } from "next/navigation";

import { apiFetch } from "@/lib/api/client";
import { ApiError, ApiUnreachable } from "@/lib/api/errors";
import { clearSession, setSession } from "@/lib/api/session";
import type { ApiUser } from "@/lib/api/types";

/**
 * Signing in.
 *
 * These run on the server, so the tokens the API returns go straight into
 * httpOnly cookies and never pass through the browser's JavaScript.
 */

export interface ActionResult<T = void> {
  ok: boolean;
  message?: string;
  data?: T;
}

/**
 * Turn any failure into something a farmer can act on.
 *
 * Generic in the success type because a failed result carries no data — this
 * lets one helper serve every action without casting at each call site.
 */
function toFailure<T>(error: unknown): ActionResult<T> {
  if (error instanceof ApiError) return { ok: false, message: error.message };
  if (error instanceof ApiUnreachable) return { ok: false, message: error.message };
  return { ok: false, message: "Something went wrong. Please try again." };
}

export async function requestCode(
  phone: string,
): Promise<ActionResult<{ sentTo: string; demoCode?: string; demoNotice?: string }>> {
  try {
    const data = await apiFetch<{
      sent_to: string;
      expires_in_seconds: number;
      // Present only when the API is running in demo mode, which it says so
      // in the response itself.
      demo_code?: string;
      demo_notice?: string;
    }>("/v1/auth/request-code/", { method: "POST", body: { phone }, anonymous: true });

    return {
      ok: true,
      data: { sentTo: data.sent_to, demoCode: data.demo_code, demoNotice: data.demo_notice },
    };
  } catch (error) {
    return toFailure(error);
  }
}

export async function verifyCode(
  phone: string,
  code: string,
): Promise<ActionResult<{ isNewAccount: boolean }>> {
  try {
    const data = await apiFetch<{
      access: string;
      refresh: string;
      is_new_account: boolean;
      user: ApiUser;
    }>("/v1/auth/verify-code/", {
      method: "POST",
      body: { phone, code },
      anonymous: true,
    });

    await setSession(data.access, data.refresh);
    return { ok: true, data: { isNewAccount: data.is_new_account } };
  } catch (error) {
    return toFailure(error);
  }
}

export async function signOut(): Promise<never> {
  await clearSession();
  redirect("/welcome");
}
