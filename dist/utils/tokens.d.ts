/**
 * Token estimation with provider-specific ratios and EMA calibration.
 */
import type { LlmMessage, ProviderCacheCaps, ProviderCapabilities } from "../types.ts";
export declare function getProviderCaps(provider: string): ProviderCapabilities;
/** Documented prompt-cache control surface for a provider; conservative defaults for unknowns. */
export declare function getProviderCacheCaps(provider: string | undefined): ProviderCacheCaps;
/** Finite context usage percentage; invalid/unknown window metadata is 0%. */
export declare function safeContextPercent(totalTokens: number | null | undefined, contextWindow: number | null | undefined): number;
/**
 * Window for automatic trigger/preparation percentages: maxContextTokens when
 * set (>0) and below a valid model window, else the model window unchanged.
 * Hard headroom checks must keep using model.contextWindow.
 */
export declare function effectiveContextWindow(model: {
    contextWindow: number;
} | undefined, config: {
    maxContextTokens?: number;
}): number | undefined;
/**
 * Bounded per-(provider,model) calibration factors smoothed by EMA.
 * Provider/model tokenization is process-wide knowledge rather than session
 * content, so production runs share one store while tests can inject isolated
 * stores. LRU bounding prevents dynamic route names from growing it forever.
 */
export declare class TokenCalibrationStore {
    private readonly maxEntries;
    private readonly factors;
    constructor(maxEntries?: number);
    clear(): void;
    get(provider?: string, model?: string): number;
    calibrate(estimated: number, actual: number, provider?: string, model?: string): void;
    size(): number;
}
export declare function estimateTokens(text: string, provider?: string, model?: string, calibration?: TokenCalibrationStore): number;
export declare function calibrateFromResponse(estimated: number, actual: number, provider?: string, model?: string, calibration?: TokenCalibrationStore): void;
export interface TokenEstimator {
    text(text: string): number;
    message(message: Pick<LlmMessage, "role" | "content" | "toolCallId" | "toolName" | "isError">): number;
    messages(messages: ReadonlyArray<Pick<LlmMessage, "role" | "content" | "toolCallId" | "toolName" | "isError">>): number;
}
/**
 * Bind provider/model calibration once per run. Message estimates use the
 * actual structured content, including tool-call arguments that text-only
 * extraction intentionally omits.
 */
export declare function makeTokenEstimator(provider?: string, model?: string, calibration?: TokenCalibrationStore): TokenEstimator;
//# sourceMappingURL=tokens.d.ts.map