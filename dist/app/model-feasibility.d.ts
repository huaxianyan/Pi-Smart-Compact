import type { Api, Model } from "@earendil-works/pi-ai";
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig, CompactionMode } from "../types.ts";
export interface ModelEligibility {
    selectable: boolean;
    reason?: string;
}
export type ModelFeasibility = (model: Model<Api>, stage: "summary" | "segmentation" | "verification", mode?: CompactionMode) => ModelEligibility;
/**
 * Read the branch/source log once, then lazily inspect the real planned requests.
 * This is not a whole-conversation window test: hierarchical EESV sends batches.
 * No auth resolution, metrics, cache writes, migrations, or memory-backend calls.
 * Recreate after a branch/config/mode change. Generated follow-ups are unknowable
 * here; trackedComplete revalidates every concrete request before dispatch.
 */
export declare function createModelFeasibilityResolver(ctx: ExtensionContext, config: CompactConfig, requestedMode?: CompactionMode, steering?: {
    focus?: string;
    userNote?: string;
}): Promise<ModelFeasibility>;
//# sourceMappingURL=model-feasibility.d.ts.map