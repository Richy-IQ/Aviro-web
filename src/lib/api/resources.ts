import "server-only";

import { apiFetch } from "./client";
import type {
  ApiAlert,
  ApiBenchmark,
  ApiBatch,
  ApiBirdType,
  ApiCyclePlan,
  ApiDailyLog,
  ApiFarm,
  ApiMetrics,
  ApiReports,
  ApiUser,
  ApiVaccination,
} from "./types";

/**
 * Every call the app makes, named for what it fetches.
 *
 * Keeping the paths in one file means a change to the API's URL shape is a
 * change here, not a search through every screen.
 */

// Reference data changes rarely and is the same for everyone, so it may be
// cached. Everything below it is a specific farmer's data and never is.
const REFERENCE_TTL = 60 * 60;

export const api = {
  me: () => apiFetch<ApiUser>("/v1/auth/me/"),

  updateMe: (patch: Partial<Pick<ApiUser, "first_name" | "last_name" | "state" | "lga">>) =>
    apiFetch<ApiUser>("/v1/auth/me/", { method: "PATCH", body: patch }),

  farms: () => apiFetch<ApiFarm[]>("/v1/farms/"),

  createFarm: (body: { name: string; state?: string; lga?: string }) =>
    apiFetch<ApiFarm>("/v1/farms/", { method: "POST", body }),

  birdTypes: () => apiFetch<ApiBirdType[]>("/v1/bird-types/", { revalidate: REFERENCE_TTL }),

  /** The whole cycle projected before a batch exists, so it can inform the decision. */
  planPreview: (birdType: string, params: { stocked: number; start: string; costPerBird?: string }) => {
    const query = new URLSearchParams({
      stocked: String(params.stocked),
      start: params.start,
      ...(params.costPerBird ? { cost_per_bird: params.costPerBird } : {}),
    });
    return apiFetch<ApiCyclePlan>(`/v1/bird-types/${birdType}/plan/?${query}`);
  },

  batchPlan: (farmId: string, batchId: string) =>
    apiFetch<ApiCyclePlan>(`/v1/farms/${farmId}/batches/${batchId}/plan/`),

  vaccinations: (birdType: string) =>
    apiFetch<ApiVaccination[]>(`/v1/bird-types/${birdType}/vaccinations/`, {
      revalidate: REFERENCE_TTL,
    }),

  /** Batches with their metrics, so one call fills the whole home screen. */
  batches: (farmId: string) =>
    apiFetch<{ batch: ApiBatch; metrics: ApiMetrics }[]>(`/v1/farms/${farmId}/batches/`),

  batch: (farmId: string, batchId: string) =>
    apiFetch<{ batch: ApiBatch; metrics: ApiMetrics }>(
      `/v1/farms/${farmId}/batches/${batchId}/`,
    ),

  createBatch: (farmId: string, body: Record<string, unknown>) =>
    apiFetch<ApiBatch>(`/v1/farms/${farmId}/batches/`, { method: "POST", body }),

  logs: (farmId: string, batchId: string) =>
    apiFetch<ApiDailyLog[]>(`/v1/farms/${farmId}/batches/${batchId}/logs/`),

  createLog: (farmId: string, batchId: string, body: Record<string, unknown>) =>
    apiFetch<ApiDailyLog>(`/v1/farms/${farmId}/batches/${batchId}/logs/`, {
      method: "POST",
      body,
    }),

  createSale: (farmId: string, batchId: string, body: Record<string, unknown>) =>
    apiFetch<unknown>(`/v1/farms/${farmId}/batches/${batchId}/sales/`, {
      method: "POST",
      body,
    }),

  alerts: (farmId: string) => apiFetch<ApiAlert[]>(`/v1/farms/${farmId}/alerts/`),

  reports: (farmId: string, period = "12-mo") =>
    apiFetch<ApiReports>(`/v1/farms/${farmId}/reports/?period=${period}`),

  benchmark: (farmId: string, batchId: string) =>
    apiFetch<ApiBenchmark>(`/v1/farms/${farmId}/batches/${batchId}/benchmark/`),
};
