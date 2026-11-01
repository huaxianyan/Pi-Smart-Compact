/**
 * Step 5: deterministic extraction with incremental cache.
 *
 * Stage: `TieredRc` → `ExtractedRc`.
 *
 * Pruning + extraction are paired here because:
 *
 *  1. The extraction indexes (topic ranges, error message offsets, decisions)
 *     live in the pruned message domain. Caching the extraction is only safe
 *     when the pruned *prefix* of the next run matches the previous one.
 *  2. Without the prefix guard, an incremental delta could be merged on top
 *     of a base whose pruning result drifted (e.g. a new duplicate read
 *     evicted an old cached read), producing index offsets that point at the
 *     wrong messages.
 *
 * `extractionCacheMissReason` captures *why* the cache could not be used so
 * the metrics dashboard can show the hit-rate alongside the failure mode.
 */
import type { TieredRc, ExtractedRc, WindowedRc } from "../run-context.ts";
import type { PreparedConversationBackup, StructuredExtraction, CachedExtraction, LlmMessage, ProfileConfig } from "../../types.ts";
/** Shared continuity input; previews must request a read-only state load. */
export declare function loadExtractionContinuity(rc: {
    cwd: string;
    branch: unknown[];
    sessionId: string;
    llmMessages: LlmMessage[];
}, extraction: StructuredExtraction, options?: {
    readOnly?: boolean;
}): {
    projectId: string;
    fingerprint: import("../../utils/fingerprint.ts").ProjectFingerprint | null;
    projectCtx: string;
    continuityScope: {
        schemaVersion: 2;
        projectId: string;
        sessionId: string;
        branchHeadId?: string | undefined;
        branchAncestryIds?: string[] | undefined;
    };
    previousState: import("../../types.ts").CompactionState | null;
    factOverrides: import("../../types.ts").ContinuityOverride[];
    verificationContinuity: import("../../types.ts").CompactionState;
    continuity: string;
};
/** Pure cache selection, including branch/content validation and delta extraction. */
export declare function selectCachedExtraction(input: {
    llmMessages: LlmMessage[];
    profileCfg: ProfileConfig;
    currentEntryIds: string[];
    currentKeptEntryIds: string[];
    cachedExt: CachedExtraction | null;
}): {
    extraction: StructuredExtraction;
    cache: "exact" | "incremental" | "miss";
    missReason?: string;
};
/**
 * Deferred conversation backup of the compacted messages, shared by the EESV
 * and native engines. Nothing is serialized until Pi confirms compaction;
 * structured redaction and the text scrubber run before serialization, and
 * redactions are surfaced because a restore brings back the redacted text.
 * `scrubbedText` reuses an already scrubbed serialization of `messages`.
 */
export declare function prepareScrubbedBackup(rc: Pick<WindowedRc, "config" | "services" | "notify" | "sessionId" | "branch" | "totalTokens">, messages: LlmMessage[], scrubbedText?: string): PreparedConversationBackup | undefined;
export declare function extractWithCache(rc: TieredRc): ExtractedRc;
//# sourceMappingURL=extract.d.ts.map