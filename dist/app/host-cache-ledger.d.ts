/** Session-local ledger of the host's own provider prompt-cache usage, built only from reported usage. */
import type { ModelPromptCache, Usage } from "@earendil-works/pi-ai";
export type ContextEditKind = "trim" | "rewind" | "navigation" | "compaction";
export type RebuildCause = "continuity" | "idle-expiry" | "foreign";
/** Foreign rebuilds needed before the ledger asks the integrator to warn once. */
export declare const FOREIGN_REBUILD_WARN_COUNT = 3;
export interface LedgerEntry {
    at: number;
    provider?: string;
    model?: string;
    /** input + cacheRead + cacheWrite */
    prompt: number;
    /** input + cacheWrite */
    uncached: number;
    cacheRead: number;
    /** Milliseconds since the previous observed request; absent for the first. */
    gapMs?: number;
    rebuild: boolean;
    cause?: RebuildCause;
    /** Most recent Smart Compact edit before a `continuity` rebuild. */
    editKind?: ContextEditKind;
    /** Set only on the rebuild that makes the foreign count reach FOREIGN_REBUILD_WARN_COUNT. */
    warn?: true;
    /** Set once, on the request that completes an all-miss streak on a documented-caching route. */
    inactive?: true;
}
export interface TokenTally {
    count: number;
    uncached: number;
}
export interface LedgerSummary {
    sessionId: string | null;
    requests: number;
    input: number;
    cacheRead: number;
    cacheWrite: number;
    rebuilds: Record<RebuildCause, TokenTally>;
    continuity: Record<ContextEditKind, TokenTally>;
    /** Routes that finished an all-miss streak despite documented caching; one row per route. */
    inactiveRoutes: Array<{
        provider: string;
        model: string;
        requests: number;
        uncached: number;
    }>;
    /** Sums of `usage.cost` (Pi prices reported tokens with the model price table); `requests` counts entries that carried a cost. */
    cost: {
        requests: number;
        total: number;
        rebuildUncached: number;
    };
}
export interface ObservedMessage {
    usage?: Partial<Usage>;
    provider?: string;
    model?: string;
    timestamp?: number;
}
export interface HostCacheLedger {
    /** New or switched session: forget all state. */
    reset(sessionId: string): void;
    /** Session the ledger currently tracks; null before the first reset. */
    sessionId(): string | null;
    /** A Smart Compact edit reached the branch; attributes the next observed rebuild. */
    noteContextEdit(kind: ContextEditKind): void;
    /** Pi sent a `cache_warm` refresh at `at`; it keeps the live prefix alive like a request. */
    noteCacheWarm(at: number): void;
    /** Assistant message at message_end; null when it carries no usable usage. */
    observe(message: ObservedMessage, at?: number, promptCache?: ModelPromptCache): LedgerEntry | null;
    summary(): LedgerSummary;
}
/**
 * Best-effort lifetime from Pi's model metadata (seconds). The request's chosen
 * retention is not recorded, so use the longest advertised tier. A reported
 * 1h write can lengthen this estimate, never shorten it. Unknown is not expired.
 */
export declare function cacheLifetimeMs(usage: Partial<Usage> | undefined, promptCache?: ModelPromptCache): number | null;
export declare function createHostCacheLedger(): HostCacheLedger;
/** 1–3 short Home lines; empty until the host reported usage for a request. */
export declare function formatCacheLedgerSummary(summary: LedgerSummary): string[];
//# sourceMappingURL=host-cache-ledger.d.ts.map