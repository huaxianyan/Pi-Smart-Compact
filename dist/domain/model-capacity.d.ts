import type { Api, Model } from "@earendil-works/pi-ai";
import type { LLMCallMetric } from "../types.ts";
type CapacityModel = Pick<Model<Api>, "provider" | "id" | "contextWindow" | "maxTokens">;
export declare function clampCompletionMaxTokens(model: CapacityModel, requested: number | undefined): number | undefined;
/** Local estimate, not a provider tokenizer guarantee. Applied again to each built request. */
export declare function modelRequestCapacityReason(model: CapacityModel, estimatedInputTokens: number, requestedOutputTokens: number | undefined): string | undefined;
export declare class ModelCapacityError extends Error {
    readonly phase: LLMCallMetric["phase"];
    constructor(phase: LLMCallMetric["phase"], reason: string);
}
export {};
//# sourceMappingURL=model-capacity.d.ts.map