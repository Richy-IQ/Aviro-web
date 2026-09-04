import type { ApiErrorBody } from "./types";

/**
 * A failure the API described. Carries the message the API wrote, which is
 * already phrased for a farmer — "You have 460 birds alive in Batch B, so you
 * cannot sell 9999" reads better than anything the client could invent.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string[]>;

  constructor(status: number, body: ApiErrorBody["error"]) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.fields = body.fields;
  }

  /** The session is gone or was never established. */
  get isUnauthenticated(): boolean {
    return this.status === 401;
  }
}

/** Network failure, timeout, or the API being unreachable. */
export class ApiUnreachable extends Error {
  constructor(cause?: unknown) {
    super("Could not reach Aviro. Check your connection and try again.");
    this.name = "ApiUnreachable";
    this.cause = cause;
  }
}
