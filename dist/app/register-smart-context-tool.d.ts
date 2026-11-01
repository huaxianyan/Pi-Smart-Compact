import type { ExtensionAPI, ExtensionContext, SessionEntry } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
import { type ContextEditKind } from "./host-cache-ledger.ts";
/** Explicit result of a user-requested manual trim; no immediate-apply claim. */
export type ManualTrimRequest = {
    state: "queued";
    notice: string;
} | {
    state: "no-eligible";
    notice: string;
} | {
    state: "paused";
    notice: string;
} | {
    state: "busy";
    notice: string;
} | {
    state: "unavailable";
    notice: string;
};
/** Economics of an automatic trim deferred until the prompt cache is cold. */
export interface DeferredTrim {
    savedTokens: number;
    tailTokens: number;
    /** Null when the model's catalog price is unknown. */
    breakEvenRequests: number | null;
    /** Set once this held trim stopped Pi's prompt-cache warming. */
    warmingStopped?: true;
}
/** Why an automatic trim is being held, for Home/status text; token counts are estimates. */
export declare function formatDeferredTrim(deferred: DeferredTrim, breakEvenLimit?: number): string;
/**
 * Best-effort cache horizon for this route and context epoch; unknown never permits a cold trim.
 *
 * `since` approximates the request START, not the response end: Anthropic measures
 * the cache TTL from the start of the request that wrote the entry, and generation
 * time counts against it. The predecessor entry's timestamp (the user message or
 * tool-result batch that triggered the request) is the closest proxy recorded on
 * the branch; without one the assistant timestamp is the conservative fallback.
 * Test hook: exported for cache-economics coverage.
 */
export declare function cachedPrefix(branch: SessionEntry[], model: ExtensionContext["model"]): {
    since: number;
    lifetimeMs: number;
} | null;
/** True when `leafId` is still on the branch with no newer context rewrite after it. */
export declare function unchangedSince(branch: SessionEntry[], leafId: string): boolean;
export type SmartContextController = {
    /** Queue a user-requested trim; it applies at the next natural turn boundary. */
    requestManualTrim(ctx: ExtensionContext): ManualTrimRequest;
    requestAnchorTrim(ctx: ExtensionContext, originId: string, callId?: string, signal?: AbortSignal, userConfirmed?: boolean): ManualTrimRequest;
    /** Automatic trim waiting for a cold prompt cache in this session, if any. */
    deferredTrim(sessionId: string): DeferredTrim | null;
};
/** One small stable schema; branch-local status changes without changing the tool loadout. */
export declare function registerSmartContextTool(pi: ExtensionAPI, options?: {
    config?: () => CompactConfig;
    canAutoTrim?: (ctx: ExtensionContext) => boolean;
    canAgentMutate?: (ctx: ExtensionContext) => boolean;
    isPaused?: (ctx: ExtensionContext) => boolean;
    /** Staging-time signal: fires when turn_end returns context_edit drafts, before the host commits them. */
    onContextChange?: (ctx: ExtensionContext) => void;
    /** Commit-time signal: fires once the staged context_edit entries are confirmed on the branch. */
    onContextEdit?: (ctx: ExtensionContext, kind: ContextEditKind) => void;
    /** Pi is about to send a `cache_warm` refresh (final action `warm`) at `at`. */
    onCacheWarm?: (ctx: ExtensionContext, at: number) => void;
    /** Clock for prompt-cache lifetime checks. */
    now?: () => number;
}): SmartContextController;
//# sourceMappingURL=register-smart-context-tool.d.ts.map