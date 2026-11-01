/** Proactive auto-compaction request that delegates all EESV work to Pi's host lifecycle. */
import type { CompactOptions, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
export interface SettledAutoTrigger {
    request(ctx: ExtensionContext, config: CompactConfig): Promise<void>;
    noteCompaction(sessionId: string): void;
    clear(sessionId: string): void;
}
export interface SettledAutoTriggerOptions {
    /** A guarded request may return an idle-checked delivery recovery action for its watchdog. */
    compact?: (ctx: ExtensionContext, options: CompactOptions) => (() => void) | void;
    now?: () => number;
    cooldownMs?: number;
    /** Test seam; defaults to the hook budget cap plus the configured run limit. */
    watchdogMs?: number;
}
/**
 * Keep proactive triggering deliberately thin: it requests a normal host
 * compaction and never runs EESV, consumes a pending summary, or stages a
 * commit itself. The existing session_before_compact/session_compact pair
 * therefore remains the only correlated apply path.
 */
export declare function createSettledAutoTrigger(options?: SettledAutoTriggerOptions): SettledAutoTrigger;
//# sourceMappingURL=settled-auto-trigger.d.ts.map