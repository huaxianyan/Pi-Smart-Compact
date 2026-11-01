/**
 * Step 3: recover untruncated messages from the session log when needed.
 *
 * Stage: `WindowedRc` → `RecoveredRc`.
 *
 * pi-toolkit's context hook truncates tool results in-place on the branch.
 * Where possible we read the original messages from the session log instead.
 * If the log is unavailable we fall back to the (possibly truncated) branch
 * messages — the summary still beats no summary at all.
 */
import type { WindowedRc, RecoveredRc } from "../run-context.ts";
import type { LlmMessage } from "../../types.ts";
/** Read-only source recovery shared by preflight and execution. */
export declare function recoverSourceMessages(sessionId: string, entries: WindowedRc["toCompact"], cwd: string): Promise<{
    messages: Array<{
        entryId: string;
        message: LlmMessage;
    }>;
    fromLog: boolean;
}>;
export declare function recoverSessionLog(rc: WindowedRc): Promise<RecoveredRc>;
//# sourceMappingURL=recover.d.ts.map