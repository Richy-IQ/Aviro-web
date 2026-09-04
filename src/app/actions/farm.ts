"use server";

import { revalidatePath } from "next/cache";

import { ApiError, ApiUnreachable } from "@/lib/api/errors";
import { api } from "@/lib/api/resources";
import { getCurrentFarm } from "@/lib/api/current-farm";

import type { ActionResult } from "./auth";

function toFailure<T>(error: unknown): ActionResult<T> {
  if (error instanceof ApiError) return { ok: false, message: error.message };
  if (error instanceof ApiUnreachable) return { ok: false, message: error.message };
  return { ok: false, message: "Something went wrong. Please try again." };
}

/**
 * Every mutation revalidates the paths that show the result. Metrics are
 * derived server-side, so a new log changes the home screen, the batch screen
 * and the money screen at once — none of them can be left stale.
 */
function revalidateFarmViews(): void {
  revalidatePath("/", "layout");
}

export async function createFarm(input: {
  name: string;
  state?: string;
  lga?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const farm = await api.createFarm(input);
    revalidateFarmViews();
    return { ok: true, data: { id: farm.id } };
  } catch (error) {
    return toFailure(error);
  }
}

export async function createBatch(input: {
  name: string;
  bird_type: string;
  started_on: string;
  stocked: number;
  cost_per_bird: string;
  transport_cost?: string;
  supplier?: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const farm = await getCurrentFarm();
    if (!farm) return { ok: false, message: "Create your farm first." };

    const batch = await api.createBatch(farm.id, input);
    revalidateFarmViews();
    return { ok: true, data: { id: batch.id } };
  } catch (error) {
    return toFailure(error);
  }
}

export async function saveDailyLog(
  batchId: string,
  input: {
    logged_on: string;
    feed_kg: string;
    deaths: number;
    death_cause?: string;
    health_activity?: string;
    feed_cost?: string;
    meds_cost?: string;
    other_cost?: string;
    note?: string;
  },
): Promise<ActionResult> {
  try {
    const farm = await getCurrentFarm();
    if (!farm) return { ok: false, message: "Create your farm first." };

    await api.createLog(farm.id, batchId, input);
    revalidateFarmViews();
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}

export async function recordSale(
  batchId: string,
  input: {
    sold_on: string;
    kind: "partial" | "full";
    birds: number;
    average_weight_kg: string;
    revenue: string;
    buyer_type?: string;
    buyer_name?: string;
    note?: string;
  },
): Promise<ActionResult> {
  try {
    const farm = await getCurrentFarm();
    if (!farm) return { ok: false, message: "Create your farm first." };

    await api.createSale(farm.id, batchId, input);
    revalidateFarmViews();
    return { ok: true };
  } catch (error) {
    return toFailure(error);
  }
}
