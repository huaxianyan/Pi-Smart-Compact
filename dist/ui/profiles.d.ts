/**
 * Task-level profiles derived from existing global settings. Nothing new is
 * stored: a profile is recognised from its flags and applied as one atomic
 * patch of those flags. `undefined` in a patch means "reset to the built-in
 * default". Any other flag combination is "custom" and is never overwritten
 * implicitly.
 */
import type { Api, Model } from "@earendil-works/pi-ai";
import type { CompactConfig } from "../types.ts";
import type { GlobalConfigPath, GlobalConfigValue } from "../utils/config.ts";
export type ConfigPatch = Partial<Record<GlobalConfigPath, GlobalConfigValue>>;
export interface ProfileOption<Id extends string> {
    id: Id;
    label: string;
    /** What the user gets and what it costs, without promising more than the code does. */
    summary: string;
    patch: ConfigPatch;
}
export interface DerivedProfile<Id extends string> {
    /** The matching profile, or "custom" when the flags match none. */
    id: Id | "custom";
    /** Short name that fits a narrow value column. */
    label: string;
    /** One plain sentence on what the current flags do; set for defaults and custom states. */
    detail?: string;
}
export type BehaviorProfileId = "manual" | "agent" | "cleanup" | "automatic";
export declare const BEHAVIOR_PROFILES: readonly ProfileOption<BehaviorProfileId>[];
type BehaviorFlags = Pick<CompactConfig, "autoTrigger" | "autoTriggerStrategy" | "contextHygieneEnabled" | "contextPressureOnly" | "agentToolAccess">;
export declare function deriveBehaviorProfile(config: BehaviorFlags): DerivedProfile<BehaviorProfileId>;
export type OutputProfileId = "verified" | "visual" | "native";
export declare const OUTPUT_PROFILES: readonly ProfileOption<OutputProfileId>[];
type OutputFlags = Pick<CompactConfig, "compactionEngines" | "visualArchiveEnabled">;
export declare function deriveOutputProfile(config: OutputFlags): DerivedProfile<OutputProfileId>;
/**
 * Why an output profile has no effect for the current chat model, or undefined
 * when it can apply. Visual and native depend on the model that reads the
 * compacted context, not on the summary route.
 */
export declare function outputProfileLimit(id: OutputProfileId, chatModel: Pick<Model<Api>, "provider" | "id" | "api" | "input"> | undefined): string | undefined;
export type ModelProfileId = "chat" | "summary";
type ModelFlags = Pick<CompactConfig, "summaryModel" | "segmentationModel" | "verificationModel">;
/**
 * chat: every stage uses the chat model. summary: one chosen model for the
 * summary; segmentation and verification inherit it. Anything else is a
 * per-stage override.
 */
export declare function deriveModelProfile(config: ModelFlags): DerivedProfile<ModelProfileId>;
export declare function modelProfilePatch(id: ModelProfileId, summaryModel?: string): ConfigPatch;
export {};
//# sourceMappingURL=profiles.d.ts.map