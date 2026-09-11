"use server";

import { redirect } from "next/navigation";

import { ApiError, ApiUnreachable } from "@/lib/api/errors";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

import type { ActionResult } from "./auth";

/**
 * Send the farmer to pay for the money tools on one batch.
 *
 * The server builds the checkout and the return address; the browser only
 * ever learns where to go next. On success this never returns — it redirects
 * to the payment page — so the result type only describes failure.
 */
export async function startCheckout(batchId: string): Promise<ActionResult> {
  let destination: string;
  try {
    const farm = await getCurrentFarm();
    if (!farm) return { ok: false, message: "Create your farm first." };

    const started = await api.checkout(farm.id, batchId);
    destination = started.authorization_url;
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    if (error instanceof ApiUnreachable) return { ok: false, message: error.message };
    return { ok: false, message: "Could not start the payment. Please try again." };
  }

  // Outside the try: redirect works by throwing, and a catch would swallow it.
  redirect(destination);
}
