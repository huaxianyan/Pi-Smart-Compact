import type { Api, Model, Tool } from "@earendil-works/pi-ai";
import type { EngineAttempt, PendingCompaction, SessionMessageEntry } from "../types.ts";
import type { WindowedRc } from "./run-context.ts";
import { type JsonObject, type NativeState, type NativeUsage } from "../infra/native-protocol.ts";
/** Appended to an Anthropic OAuth "extra usage" rejection of the compaction request. */
export declare const CLAUDE_OAUTH_ADAPTER_HINT = "Anthropic billed this Claude subscription request as extra usage. Native compaction on Claude subscriptions is experimental; use an Anthropic API key, or put the smart summary engine first.";
/** Active tool definitions for the nested request (Anthropic rejects tool_use history without tools). */
export type NativeToolSource = () => Tool[];
/** Wired once from the extension entry (`pi.getAllTools()` filtered by `pi.getActiveTools()`). */
export declare function setNativeToolSource(source: NativeToolSource): void;
/** Test seam: the network behind the one real compaction request. Undefined = global fetch. */
export declare function setNativeTransportForTests(fetchImpl: typeof fetch | undefined): void;
type RouteModel = Pick<Model<Api>, "api" | "provider" | "id">;
/** Native state of a compaction entry, only when valid and for this exact route. */
export declare function nativeStateOf(entry: unknown, model: RouteModel | undefined): NativeState | undefined;
/**
 * Find a clean turn boundary at or before `keepFrom`: the kept tail starts at a
 * user message on an entry boundary, and the prefix ends with a completed
 * assistant reply (no pending tool call). Returns null when none exists.
 */
export declare function nativeCompactionCut(msgs: readonly SessionMessageEntry[], keepFrom: number): number | null;
export declare function nativeRouteLabel(model: Pick<Model<Api>, "provider" | "id">): string;
export type NativeAttemptResult = {
    outcome: "staged";
    pending: PendingCompaction;
    usage: NativeUsage;
} | {
    outcome: "skipped";
    reason: string;
} | {
    outcome: "failed";
    reason: string;
};
/** Literal, single-line, bounded error text for engine outcome reports. */
export declare function engineErrorText(error: unknown): string;
/**
 * Run one native compaction attempt and build a pending candidate. Never
 * retries; applies nothing. Budget: consumes one provider call.
 */
export declare function attemptNativeCompaction(rc: WindowedRc, priorAttempts: readonly EngineAttempt[]): Promise<NativeAttemptResult>;
export declare function describeEngineAttempts(attempts: readonly EngineAttempt[]): string;
export declare function nativeRouteLabelOf(ctx: {
    model?: Pick<Model<Api>, "provider" | "id">;
}): string;
/** Every engine was skipped or failed; the conversation is unchanged. */
export declare class EngineChainError extends Error {
    readonly attempts: readonly EngineAttempt[];
    constructor(attempts: readonly EngineAttempt[]);
}
/** Ask Pi to apply the staged native candidate; mirrors the EESV apply path. */
export declare function applyNativeCompaction(rc: WindowedRc, pending: PendingCompaction): void;
/**
 * Whether a native skip should be shown: at most once per session and route
 * (e.g. a kimi model with ["native","eesv"] would otherwise warn every run).
 * Failures are always shown by the caller.
 */
export declare function shouldWarnNativeSkip(sessionId: string, route: string): boolean;
export declare function resetNativeSkipWarningsForTests(): void;
/** Structural slice of the extension context the replay hook reads. */
export interface NativeReplayContext {
    model?: RouteModel;
    sessionManager: {
        getBranch(): unknown[];
        getEntries(): unknown[];
        getSessionId?(): string | undefined;
    };
    modelRegistry?: unknown;
    hasUI?: boolean;
    ui?: {
        notify(message: string, type?: "info" | "warning" | "error"): void;
    };
}
/**
 * `before_provider_request` replay of stored native state. Swaps Pi's text
 * summary for the provider state only when the latest compaction on the
 * branch carries valid state for the current route. Costs nothing (not even a
 * branch walk) until the session has native state; `refresh` recomputes that
 * flag at session boundaries from in-memory entries, never from disk.
 */
export declare function createNativeReplayHook(): {
    refresh(ctx: {
        sessionManager?: Partial<NativeReplayContext["sessionManager"]>;
    }): void;
    /** Replayed payload copy, or undefined to send Pi's payload unchanged. */
    handle(payload: unknown, ctx: NativeReplayContext): JsonObject | undefined;
};
export {};
//# sourceMappingURL=native-compaction.d.ts.map