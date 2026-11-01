import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
import type { SmartCompactPolicySnapshot } from "./smart-compact-policy.ts";
import { type MemoryBackendReadiness } from "./memory-backend.ts";
import type { ModelFeasibility } from "./model-feasibility.ts";
export interface EffectiveRuntimeState {
    running: boolean;
    preparation: "idle" | "preparing" | "ready";
    paused: boolean;
    /** Host prompt-cache ledger lines for the current session, when attached. */
    cacheLedger?: string[];
}
export interface EffectiveReadiness {
    canCompact: boolean;
    blockers: string[];
    warnings: string[];
    memory: MemoryBackendReadiness;
}
/** Read-only local checks. Memory is optional and never blocks compaction. */
export declare function describeReadiness(ctx: ExtensionContext, config: CompactConfig, runtime?: EffectiveRuntimeState, feasibility?: ModelFeasibility): Promise<EffectiveReadiness>;
/** Local evidence, not a connectivity/authentication probe; never acquire a lease or create a store. */
export declare function describeEffectiveState(ctx: ExtensionContext, config: CompactConfig, policy: SmartCompactPolicySnapshot, runtime?: EffectiveRuntimeState): Promise<string>;
//# sourceMappingURL=effective-state.d.ts.map