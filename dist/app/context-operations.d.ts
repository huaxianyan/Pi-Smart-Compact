/** Session-local, append-only context edits. Original evidence stays in Pi's JSONL. */
import { type SessionBoundaryDraft, type SessionEntry } from "@earendil-works/pi-coding-agent";
import type { ModelCostRates } from "@earendil-works/pi-ai";
import { fingerprintContext } from "./pending-slot.ts";
export declare const CONTEXT_CONTROL_TYPE = "smart-compact-context";
export declare const CONTEXT_REPORT_TYPE = "smart-compact-rewind";
export declare const ATTENTION_CUSTOM_TYPE = "smart-compact-attention";
export declare const MAX_CONTEXT_EDITS = 512;
export declare const MAX_TRIM_EDITS = 32;
export declare const MIN_TRIM_CHARS = 2048;
export declare const KEEP_RECENT_TURNS = 4;
export declare const MIN_AUTO_TRIM_SAVING_CHARS = 16384;
export declare const AUTO_TRIM_COOLDOWN_TURNS = 8;
/** Pin the latest owned or historically recorded anchor prefix during cleanup. */
export declare function lastAnchorBoundary(branch: SessionEntry[]): string | undefined;
export interface ContextCheckpoint {
    id: string;
    label: string;
    sessionId: string;
    originId: string;
    snapshot: ReturnType<typeof fingerprintContext>;
}
/** Why a trim was committed: context pressure, warm-cache break-even, cold-cache apply, or an explicit request. */
export type TrimCause = "pressure" | "break-even" | "cold" | "manual" | "agent";
/** Content evidence for an archived output at commit time; `references` stays the authorization list. */
export interface ArchiveRecord {
    id: string;
    sha256: string;
    chars: number;
}
type ControlData = {
    version: 1;
    action: "checkpoint";
    checkpoint: ContextCheckpoint;
} | {
    version: 1;
    action: "trim";
    references: string[];
    archives?: ArchiveRecord[];
    cause?: TrimCause;
} | {
    version: 1;
    action: "rewind";
    references: string[];
    archives?: ArchiveRecord[];
};
export declare function contextControlEntry(data: ControlData): SessionBoundaryDraft;
/** Test hook: number of sessions currently memoized. */
export declare function _inspectContextMemoSizeForTests(): number;
/** Test hook: drop all memoized inspection results. */
export declare function clearInspectContextMemo(): void;
export declare function inspectContext(branch: SessionEntry[], sessionId: string): {
    checkpoint: ContextCheckpoint | null;
    checkpointIndex: number;
    invalidReason: string | undefined;
    references: Set<string>;
    archives: Map<string, Omit<ArchiveRecord, "id">>;
};
/** Keep complete call/result groups, including all siblings if any tool may have side effects. */
export declare function removableResearch(branch: SessionEntry[]): Set<string>;
/**
 * Deterministic trim marker: a retrieval line, then the call's subject (with an optional note),
 * the first output line and up to three risk lines, bounded by TRIM_MARKER_MAX_LINES / TRIM_MARKER_MAX_CHARS.
 */
export declare function buildTrimMarker(input: {
    toolName: string;
    entryId: string;
    text: string;
    call?: {
        name: string;
        arguments: unknown;
    };
    note?: string;
}): string;
/** Signed Anthropic thinking may bind the entire preceding history, not only its own bytes. */
export declare function thinkingEditReason(branch: SessionEntry[], entries: SessionBoundaryDraft[], readerApi?: string): string | undefined;
/** Warm-cache inputs for frontier scoring; absent cost keeps the full plan. */
export interface TrimEconomy {
    provider?: string;
    model?: string;
    cost?: Partial<ModelCostRates>;
    breakEvenLimit?: number;
}
export declare function planContextTrim(branch: SessionEntry[], afterId?: string, options?: {
    anchorBoundary?: string | null;
    readerApi?: string; /** Overrides MIN_AUTO_TRIM_SAVING_CHARS for this plan; callers pass the configured floor. */
    minSavingChars?: number; /** Warm-cache inputs for frontier scoring; absent cost keeps the full plan. */
    economy?: TrimEconomy;
}): {
    entries: SessionBoundaryDraft[];
    references: string[];
    archives: ArchiveRecord[];
    savedChars: number;
    automatic: string;
    cooldownTurns: number;
    superseded: number;
    blockedReason: string | undefined;
};
/** Why a trim plan queues nothing, with its numbers, so a skipped cleanup is diagnosable without debug mode. */
export declare function describeTrimSkip(plan: {
    entries: unknown[];
    savedChars: number;
    automatic: string;
    cooldownTurns: number;
}, floorChars: number): string;
/** The plan's context edits followed by a trim control entry recording `cause`. */
export declare function trimEntries(plan: {
    entries: SessionBoundaryDraft[];
    references: string[];
    archives: ArchiveRecord[];
}, cause: TrimCause): SessionBoundaryDraft[];
/**
 * Estimated tokens a trim removes (net of markers) and tokens of the rebuilt tail:
 * every projected message from the first edited target on, with markers in place.
 */
export declare function trimTokens(branch: SessionEntry[], entries: SessionBoundaryDraft[], provider?: string, model?: string): {
    savedTokens: number;
    tailTokens: number;
};
/**
 * Requests, counting the trimmed one, after which a warm-cache trim pays back its
 * prefix rewrite: N* = ((w - r) * T) / (r * X), r = cacheRead/input, w = cacheWrite/input
 * (1 when the catalog lists no write surcharge). 0 when cache reads are free; null when
 * the price is unknown.
 */
export declare function trimBreakEvenRequests(cost: Partial<ModelCostRates> | undefined, savedTokens: number, tailTokens: number): number | null;
export declare function planContextRewind(branch: SessionEntry[], sessionId: string, checkpointId: string, report: string, readerApi?: string): {
    entries: SessionBoundaryDraft[];
    removed: number;
};
/**
 * What recoverable cleanup saved on the live branch, derived from the same
 * control records the trims wrote. `savedCharsEstimate` counts archived bytes
 * minus the markers that remain in context; it matches planContextTrim's
 * savedChars for a freshly committed plan. Spill artifacts are not included —
 * the storage report owns those.
 */
export declare function trimRoi(branch: SessionEntry[], sessionId: string): {
    archivedOutputs: number;
    archivedChars: number;
    savedCharsEstimate: number;
};
/** Explicit, branch-local recovery only; never reveal assistant reasoning or arbitrary session entries. */
export declare function readContextReference(branch: SessionEntry[], sessionId: string, id: string): string;
export {};
//# sourceMappingURL=context-operations.d.ts.map