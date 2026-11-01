/**
 * Phase 2: Targeted LLM Exploration.
 */
import type { Model, Api, Context, ProviderHeaders } from "@earendil-works/pi-ai";
import type { LlmMessage, StructuredExtraction, ExplorationReport } from "../types.ts";
import type { SmartCompactServices } from "../infra/services.ts";
import { SecretScrubber } from "../domain/scrub.ts";
/**
 * Determine whether exploration is worthwhile based on session complexity.
 * Simple sessions (few topics, few errors, few decisions) skip exploration
 * and rely on heuristic boundaries instead — saving 3-8 LLM calls.
 */
export declare function shouldExplore(extraction: StructuredExtraction): boolean;
export declare function executeExplorationTool(call: {
    name: string;
    arguments: Record<string, unknown>;
}, llmMessages: LlmMessage[], scrubber?: SecretScrubber): string;
export declare function parseExplorationReport(text: string, llmMessages: LlmMessage[]): ExplorationReport;
export declare function buildExplorationReportFromParsed(parsed: unknown, llmMessages: LlmMessage[]): ExplorationReport;
export declare function fallbackExplorationReport(llmMessages: LlmMessage[]): ExplorationReport;
/** Build the known first explorer request; tool-feedback rounds are checked at dispatch. */
export declare function buildExplorerRequest(extraction: StructuredExtraction, model: Model<Api>, prevSummary?: string, userNote?: string): {
    context: Context;
    maxTokens: number;
    userContent: string;
};
export declare function explorationToolSupportKey(model: Model<Api>): string;
export declare function exploreConversation(llmMessages: LlmMessage[], extraction: StructuredExtraction, model: Model<Api>, auth: {
    apiKey: string;
    headers?: ProviderHeaders;
}, prevSummary: string | undefined, userNote: string | undefined, signal?: AbortSignal, maxRounds?: number, notify?: (msg: string, type?: "info" | "success" | "warning" | "error") => void, services?: SmartCompactServices): Promise<{
    report: ExplorationReport;
    rounds: number;
    toolSupported: boolean;
}>;
export declare function buildDirectExplorationRequest(llmMessages: LlmMessage[], extraction: StructuredExtraction, model: Model<Api>, prevSummary?: string, userNote?: string): {
    context: Context;
    maxTokens: number;
};
//# sourceMappingURL=explore.d.ts.map