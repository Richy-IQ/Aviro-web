import { type NextRequest } from "next/server";

import { apiUrl } from "@/lib/env";
import { getAccessToken } from "@/lib/api/session";
import { getCurrentFarm } from "@/lib/api/current-farm";

const DATASETS = new Set(["logs", "sales"]);
const PERIODS = new Set(["this-month", "last-month", "this-year", "12-mo"]);

/**
 * Hand the farmer their own records as a CSV file.
 *
 * A route handler rather than a Server Action because the browser needs a real
 * response with a filename on it, which is what makes the phone save a file
 * instead of rendering text. The session cookie never leaves this server: the
 * CSV is fetched from Django here and streamed on.
 */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const dataset = params.get("dataset") ?? "logs";
  const period = params.get("period") ?? "12-mo";

  if (!DATASETS.has(dataset) || !PERIODS.has(period)) {
    return new Response("Unknown dataset or period.", { status: 400 });
  }

  const farm = await getCurrentFarm();
  if (!farm) return new Response("Not signed in.", { status: 401 });

  const token = await getAccessToken();
  if (!token) return new Response("Not signed in.", { status: 401 });

  const upstream = await fetch(
    `${apiUrl()}/v1/farms/${farm.id}/records/?dataset=${dataset}&period=${period}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  );

  if (upstream.status === 402) {
    return new Response("Downloads are part of the money tools.", { status: 402 });
  }
  if (!upstream.ok) {
    return new Response("Could not build that file just now.", { status: 502 });
  }

  return new Response(await upstream.text(), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      // Carried straight through, so the saved file keeps the farm and dates
      // in its name and a folder of them stays readable.
      "Content-Disposition":
        upstream.headers.get("Content-Disposition") ?? `attachment; filename="${dataset}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
