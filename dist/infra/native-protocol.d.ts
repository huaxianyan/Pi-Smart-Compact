export declare const NATIVE_APIS: readonly ["anthropic-messages", "openai-responses", "openai-codex-responses"];
export type NativeApi = (typeof NATIVE_APIS)[number];
/** A JSON object as it appears in provider payloads. */
export type JsonObject = Record<string, unknown>;
/** Stored in the compaction entry's `details.native`. */
export interface NativeState {
    version: 1;
    api: NativeApi;
    provider: string;
    model: string;
    /** Provider items in replay order: one Anthropic compaction block, or an OpenAI window. */
    items: JsonObject[];
}
export interface NativeUsage {
    input: number;
    output: number;
    cacheRead: number;
    cacheWrite: number;
}
export interface NativeCompactionResult {
    state: NativeState;
    /** What other models read: Anthropic's summary, or for OpenAI routes a notice plus the retained user messages. */
    summary: string;
    usage: NativeUsage;
}
export interface CompactionFetchOptions {
    api: NativeApi;
    provider: string;
    model: string;
    /** Summarization guidance; only Anthropic accepts it. */
    instructions?: string;
    /** Transport for the one real request. Defaults to the global fetch. */
    fetch?: typeof fetch;
}
/** Required on Anthropic's compaction request and on every request that replays its block. */
export declare const ANTHROPIC_COMPACTION_BETA = "compact-2026-09-04";
export declare function isNativeApi(api: string): api is NativeApi;
export declare function isNativeState(value: unknown): value is NativeState;
/**
 * A fetch for one nested Pi request. The first call becomes the compaction request; every
 * call answers Pi with a 400, so the nested stream ends as an error that callers ignore
 * once `result()` is defined. `result()` stays undefined when Pi never sent a request.
 */
export declare function createCompactionFetch(options: CompactionFetchOptions): {
    fetch: typeof fetch;
    result(): NativeCompactionResult | Error | undefined;
};
/**
 * Returns a copy of an ordinary provider payload whose compaction-summary message is replaced
 * by the stored state. Undefined when the summary is not the first conversation message, the
 * only place replay is valid; Pi's text summary then goes out unchanged.
 */
export declare function replayNativeState(api: NativeApi, payload: unknown, state: NativeState, summary: string): JsonObject | undefined;
//# sourceMappingURL=native-protocol.d.ts.map