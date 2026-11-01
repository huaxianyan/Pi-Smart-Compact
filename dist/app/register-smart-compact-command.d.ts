import type { ExtensionAPI, ExtensionCommandContext, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { DeferredTrim, ManualTrimRequest } from "./register-smart-context-tool.ts";
import type { PendingSlot } from "./pending-slot.ts";
import { runSmartCompact } from "./run-smart-compact.ts";
import type { SessionRunLock } from "./session-run-lock.ts";
import type { SmartCompactPolicy } from "./smart-compact-policy.ts";
import { type EffectiveRuntimeState } from "./effective-state.ts";
import type { GlobalConfigPath } from "../utils/config.ts";
import type { NavigationController } from "./register-navigation.ts";
interface SmartCompactCommandDependencies {
    runManualCompaction?: typeof runSmartCompact;
    pendingRef: PendingSlot;
    runLock: SessionRunLock;
    onNativeApplyError: (runId: string) => boolean;
    policy: SmartCompactPolicy;
    /** Live run/preparation/pause state; absent means "not attached", never assumed idle. */
    getRuntimeState?: (ctx: ExtensionContext) => EffectiveRuntimeState;
    /** Queue a zero-LLM local cleanup at the next natural turn boundary (smart_context controller). */
    requestManualTrim?: (ctx: ExtensionContext) => ManualTrimRequest;
    /** Automatic trim held for a cold prompt cache in this session, if any. */
    deferredTrim?: (ctx: ExtensionContext) => DeferredTrim | null;
    navigation?: NavigationController;
    toolSummary?: () => string;
    /**
     * Runtime refresh after any global settings write, applied once for all
     * written paths (a one-key edit passes [path]).
     */
    onGlobalSettingsApplied?: (paths: GlobalConfigPath[], ctx: ExtensionCommandContext) => void | Promise<void>;
}
export declare function registerSmartCompactCommand(pi: ExtensionAPI, dependencies: SmartCompactCommandDependencies): void;
export {};
//# sourceMappingURL=register-smart-compact-command.d.ts.map