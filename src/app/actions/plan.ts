"use server";

import { ApiError, ApiUnreachable } from "@/lib/api/errors";
import { api } from "@/lib/api/resources";
import type { ApiCyclePlan } from "@/lib/api/types";

import type { ActionResult } from "./auth";

/**
 * Fetch a projected cycle while the farmer is still deciding.
 *
 * A Server Action rather than a direct call, because the API address and the
 * session both live on this server.
 */
export async function previewPlan(input: {
  birdType: string;
  stocked: number;
  start: string;
  costPerBird?: string;
}): Promise<ActionResult<ApiCyclePlan>> {
  try {
    const plan = await api.planPreview(input.birdType, {
      stocked: input.stocked,
      start: input.start,
      costPerBird: input.costPerBird,
    });
    return { ok: true, data: plan };
  } catch (error) {
    if (error instanceof ApiError) return { ok: false, message: error.message };
    if (error instanceof ApiUnreachable) return { ok: false, message: error.message };
    return { ok: false, message: "Could not work out the plan. Please try again." };
  }
}
