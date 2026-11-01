/**
 * Phase 3: Hierarchical Synthesis.
 */
import type { Model, Api, Context, ProviderHeaders } from "@earendil-works/pi-ai";
import type { LlmMessage, LlmChunk, ChunkSummary, StructuredExtraction, ExplorationReport, ProfileConfig, CompactionState, ContinuityOverride } from "../types.ts";
import { type TokenEstimator } from "../utils/tokens.ts";
import { type SmartCompactServices } from "../infra/services.ts";
/** A provider response completed, but did not satisfy the batch-output contract. */
export declare class BatchSummaryFormatError extends Error {
    readonly name = "BatchSummaryFormatError";
    constructor(reason: string);
}
export declare function chunkLlmMessages(msgs: LlmMessage[], boundaries: import("../types.ts").TopicBoundary[], pc: ProfileConfig, estimator?: TokenEstimator, focus?: string): LlmChunk[];
export declare function heuristicTopicBoundaries(extraction: StructuredExtraction): {
    afterIndex: number;
    topic: string;
    priority: "high" | "normal";
    confidence: number;
}[];
export interface SynthesisRequest {
    context: Context;
    maxTokens: number;
}
/** The same concrete request is inspected by model selection and sent at runtime. */
export declare function buildSinglePassRequest(convText: string, extraction: StructuredExtraction, report: ExplorationReport | null, prevContext: string, model: Model<Api>, budgetTokens: number, focus?: string): SynthesisRequest;
export declare function singlePassCompact(request: SynthesisRequest, model: Model<Api>, auth: {
    apiKey: string;
    headers?: ProviderHeaders;
}, signal?: AbortSignal, services?: SmartCompactServices): Promise<{
    summary: string;
    llmCalls: 1;
}>;
/**
 * Coerce a model response into the canonical section layout. Output that answers
 * in prose keeps every word; only the missing headings are added around it, so a
 * formatting quirk never costs the summary itself.
 */
export declare function normalizeSummaryHeadings(raw: string): string;
export declare function buildBatchRequest(batch: LlmChunk[], extraction: StructuredExtraction, model: Model<Api>, maxOutputTokens?: number): SynthesisRequest & {
    dynamicSuffix: string;
};
export declare function summarizeBatch(batch: LlmChunk[], extraction: StructuredExtraction, model: Model<Api>, auth: {
    apiKey: string;
    headers?: ProviderHeaders;
}, signal?: AbortSignal, services?: SmartCompactServices, maxOutputTokens?: number, cacheScope?: string): Promise<ChunkSummary[]>;
export declare function assembleLLM(summaries: ChunkSummary[], extraction: StructuredExtraction, report: ExplorationReport | null, model: Model<Api>, auth: {
    apiKey: string;
    headers?: ProviderHeaders;
}, budget: number, prevContext: string, signal?: AbortSignal, services?: SmartCompactServices, focus?: string, continuity?: CompactionState | null): Promise<string>;
/**
 * Deterministic quality floor. Its Goal, Constraints, Key Decisions, Blocked
 * and Critical Context sections render exactly the evidence the verifier
 * requires ({@link collectVerificationEvidence}: live, high-confidence,
 * non-retired constraints; explicit decisions collapsed to one active answer;
 * continuity-merged errors and goal). A line the verifier does not require
 * is a line it may score as a contradiction, which is not deterministically
 * repairable; the floor therefore adds nothing of its own to those sections.
 */
export declare function assembleFallback(summaries: ChunkSummary[], extraction: StructuredExtraction, steering?: {
    focus?: string;
    note?: string;
}, budgetTokens?: number, continuity?: CompactionState | null, factOverrides?: readonly ContinuityOverride[]): string;
/**
 * Build a placeholder {@link ChunkSummary} when a batch's LLM call failed, so the
 * assembly step still has something deterministic to merge rather than
 * dropping the segment silently. Co-located with `assembleFallback` so both
 * fallback contracts live in the algorithm layer (no I/O, trivially testable).
 */
export declare function failedChunkSummary(ch: LlmChunk): ChunkSummary;
//# sourceMappingURL=synthesize.d.ts.map