import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { PendingSlot } from "./pending-slot.ts";
import type { SessionRunLock } from "./session-run-lock.ts";
import type { SmartCompactPolicy } from "./smart-compact-policy.ts";
export interface ExtensionApiDependencies {
    pendingRef: PendingSlot;
    runLock: SessionRunLock;
    onNativeApplyError: (runId: string) => boolean;
    policy: SmartCompactPolicy;
    /** While applying a requested run, the native hook must accept exactly this summary. */
    nativeApplyRuns: Map<string, string>;
}
export declare function registerExtensionApi(pi: ExtensionAPI, dependencies: ExtensionApiDependencies): void;
//# sourceMappingURL=register-extension-api.d.ts.map