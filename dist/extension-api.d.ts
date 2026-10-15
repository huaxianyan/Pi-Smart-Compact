import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
export declare const SMART_COMPACT_MIN_CONTEXT_PERCENT: number;
/** Public in-process protocol. The pipeline remains owned by the loaded extension. */
export declare const SMART_COMPACT_REQUEST = "smart-compact:request:v1";
export type SmartCompactResult = {
    status: "applied";
    runId: string;
} | {
    status: "failed";
    errorMessage: string;
} | {
    status: "cancelled";
} | {
    status: "busy";
};
export interface SmartCompactRequest {
    ctx: ExtensionContext;
    signal: AbortSignal;
    timeoutMs: number;
    /** Exactly one loaded extension can accept this request. */
    accept(): boolean;
    respond(result: SmartCompactResult): void;
}
/** Fast recovery with automatic verified Apply; never falls back to native summarization. */
export declare function requestSmartCompaction(pi: Pick<ExtensionAPI, "events">, ctx: ExtensionContext, signal: AbortSignal, timeoutMs?: number): Promise<SmartCompactResult>;
//# sourceMappingURL=extension-api.d.ts.map