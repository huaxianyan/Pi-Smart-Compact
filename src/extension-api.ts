import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { DEFAULT_CONFIG } from "./constants.ts";

export const SMART_COMPACT_MIN_CONTEXT_PERCENT = DEFAULT_CONFIG.minContextPercent;

/** Public in-process protocol. The pipeline remains owned by the loaded extension. */
export const SMART_COMPACT_REQUEST = "smart-compact:request:v1";

export type SmartCompactResult =
  | { status: "applied"; runId: string }
  | { status: "failed"; errorMessage: string }
  | { status: "cancelled" }
  | { status: "busy" };

export interface SmartCompactRequest {
  ctx: ExtensionContext;
  signal: AbortSignal;
  timeoutMs: number;
  /** Exactly one loaded extension can accept this request. */
  accept(): boolean;
  respond(result: SmartCompactResult): void;
}

/** Fast recovery with automatic verified Apply; never falls back to native summarization. */
export function requestSmartCompaction(
  pi: Pick<ExtensionAPI, "events">,
  ctx: ExtensionContext,
  signal: AbortSignal,
  timeoutMs = 300_000,
): Promise<SmartCompactResult> {
  if (signal.aborted) return Promise.resolve({ status: "cancelled" });
  return new Promise((resolve) => {
    let accepted = false;
    let done = false;
    const controller = new AbortController();
    let deadline: ReturnType<typeof setTimeout> | undefined;
    const finish = (result: SmartCompactResult) => {
      if (done) return;
      done = true;
      signal.removeEventListener("abort", abort);
      if (deadline) clearTimeout(deadline);
      resolve(result);
    };
    const abort = () => { controller.abort(); finish({ status: "cancelled" }); };
    signal.addEventListener("abort", abort, { once: true });
    const request: SmartCompactRequest = {
      ctx, signal: controller.signal, timeoutMs,
      accept: () => {
        if (accepted || done) return false;
        accepted = true;
        return true;
      },
      respond: finish,
    };
    try {
      pi.events.emit(SMART_COMPACT_REQUEST, request);
      if (!accepted) finish({ status: "failed", errorMessage: "Smart Compact recovery interface is unavailable; load the recovery-enabled package." });
      if (!done) deadline = setTimeout(() => {
        finish({ status: "failed", errorMessage: "Smart compaction timed out." });
        controller.abort();
      }, timeoutMs);
    } catch (error) {
      finish({ status: "failed", errorMessage: error instanceof Error ? error.message : String(error) });
    }
  });
}
