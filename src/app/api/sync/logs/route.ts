import { NextResponse, type NextRequest } from "next/server";

import { ApiError, ApiUnreachable } from "@/lib/api/errors";
import { getCurrentFarm } from "@/lib/api/current-farm";
import { api } from "@/lib/api/resources";

/**
 * Replay one queued log.
 *
 * A plain route handler rather than a Server Action, because the queue drains
 * from a background task where a fetch is simpler and the failure modes are
 * clearer. The session cookie travels with the request, so this is authorised
 * exactly like any other call.
 */
export async function POST(request: NextRequest) {
  let body: { batchId?: string; payload?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  if (!body.batchId || !body.payload) {
    return NextResponse.json({ error: "batchId and payload are required." }, { status: 400 });
  }

  const farm = await getCurrentFarm();
  if (!farm) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  try {
    await api.createLog(farm.id, body.batchId, body.payload);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiUnreachable) {
      // Still offline. The caller keeps the entry and tries again later.
      return NextResponse.json({ error: error.message, retryable: true }, { status: 503 });
    }
    if (error instanceof ApiError) {
      // The API rejected it on its merits — retrying will not help, so the
      // caller should stop and show the farmer what is wrong.
      return NextResponse.json(
        { error: error.message, retryable: false },
        { status: error.status },
      );
    }
    return NextResponse.json({ error: "Could not sync.", retryable: true }, { status: 503 });
  }
}
