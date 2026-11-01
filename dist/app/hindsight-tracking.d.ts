import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { type RemoteSaveOutcome } from "./hindsight-memory.ts";
/** Status reads only: never submits, retries or resolves a remote memory. */
export declare function registerHindsightTracking(pi: ExtensionAPI, options?: {
    pollIntervalMs?: number;
    maxTrackingMs?: number;
}): {
    observe: (outcome: RemoteSaveOutcome, ctx: ExtensionContext) => boolean;
};
//# sourceMappingURL=hindsight-tracking.d.ts.map