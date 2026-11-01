/**
 * Context attention: one short note to the model when context pressure enters
 * a band, naming only the actions that are available right now.
 *
 * Pressure used to reach the model only through the human status line and
 * `smart_context status` results, so the navigation, history and compaction
 * tools sat idle until a person asked for them. The note rides along with the
 * next tool batch (steer) during a turn. Prompt-start notes are computed then,
 * never parked in nextTurn where compaction or permissions can make them stale.
 * One note per band per session, re-armed once pressure clears or the session
 * changes. Notes append to history; they never rewrite the prompt prefix.
 */
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
export { ATTENTION_CUSTOM_TYPE } from "./context-operations.ts";
type AttentionConfig = Pick<CompactConfig, "contextNavigationEnabled" | "contextGuidanceEnabled" | "toolLoading" | "autoTrigger" | "autoTriggerStrategy" | "minContextPercent" | "prepareContextPercent" | "maxContextTokens" | "autoTrimMinSavingChars" | "autoTrimBreakEvenRequests">;
export interface ContextAttentionDeps {
    config: () => AttentionConfig;
    /** Agent-driven context changes are permitted and nothing (pivot, running compaction) takes priority. */
    canAgentAct: (ctx: ExtensionContext) => boolean;
    /** The same maintenance gate used by history cleanup; prepared work takes priority. */
    canCleanup: (ctx: ExtensionContext) => boolean;
    /** A lazy group can still be loaded through `smart_tools`. */
    reachable: (group: "navigation" | "history" | "compaction") => boolean;
}
export declare function registerContextAttention(pi: Pick<ExtensionAPI, "on" | "sendMessage" | "getActiveTools">, deps: ContextAttentionDeps): void;
//# sourceMappingURL=context-attention.d.ts.map