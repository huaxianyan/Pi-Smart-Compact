import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig, MetricsSnapshot, PendingCompaction, PreparationDiscardReason } from "../types.ts";
/**
 * Default discard recorder: one bounded local metrics entry per discarded
 * preparation, so its provider cost is counted exactly once and never lands
 * in the applied cohort. Injectable for tests.
 */
export declare function recordPreparationDiscard(sessionId: string, snapshot: MetricsSnapshot, reason: PreparationDiscardReason): Promise<boolean>;
export declare function preparationStartTokens(applyTokens: number): number;
/**
 * Token window for speculative preparation. minContextPercent is always the
 * apply gate. An explicit prepareContextPercent below it sets the start;
 * null (or an unvalidated value at/above the gate) uses the adaptive lead.
 * MIN_TOKEN_THRESHOLD is a floor in both cases.
 */
export declare function preparationWindow(config: Pick<CompactConfig, "minContextPercent" | "prepareContextPercent">, window: number): {
    startTokens: number;
    applyTokens: number;
};
/** Shared execution/status gates; unknown usage fails closed, never means zero pressure. */
export declare function contextPressure(ctx: Pick<ExtensionContext, "model" | "getContextUsage">, config: Pick<CompactConfig, "minContextPercent" | "prepareContextPercent" | "maxContextTokens">): {
    tokens: number | null;
    modelWindow: number | null;
    policyWindow: number | null;
    percent: number | null;
    cleanupTokens: number | null;
    compactionTokens: number | null;
    cleanup: boolean;
    compaction: boolean;
    longContextPricing: {
        thresholdTokens: number;
        thresholdPercent: number;
    } | undefined;
};
export declare function createBackgroundPreparation(options: {
    prepare(ctx: ExtensionContext, config: CompactConfig, signal: AbortSignal): Promise<PendingCompaction | null>;
    now?: () => number;
    ttlMs?: number;
    /** Effective active-tool definitions, not just names. Never inject this into the model context. */
    toolSignature?: () => string;
    cooldownMs?: number;
    /** Test seam for the bounded local discard metrics entry. */
    discardRecorder?: (sessionId: string, snapshot: MetricsSnapshot, reason: PreparationDiscardReason) => void | Promise<boolean>;
}): {
    observe: (ctx: ExtensionContext, config: CompactConfig) => void;
    take: (ctx: ExtensionContext, config: CompactConfig) => PendingCompaction | null;
    cancel: (reason?: PreparationDiscardReason) => void;
    noteHandoffUnused: (runId: string, reason: "superseded" | "stale") => void;
    shutdown(): Promise<void>;
    hasWork: () => boolean;
    /** Read-only preparation state for the host; no TTL or metrics effects. */
    status(sessionId: string): "idle" | "preparing" | "ready";
    noteCompaction(sessionId: string): void;
};
//# sourceMappingURL=background-preparation.d.ts.map