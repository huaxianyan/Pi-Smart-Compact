import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { ContextToolExposure } from "./lazy-tools.ts";
import type { SmartCompactPolicy } from "./smart-compact-policy.ts";
import type { GlobalConfigPath } from "../utils/config.ts";
/** Refresh each owner at most once after one atomic global-settings patch. */
export declare function applyGlobalSettingsRuntime(paths: readonly GlobalConfigPath[], ctx: ExtensionContext, policy: SmartCompactPolicy, contextTools: Pick<ContextToolExposure, "apply">): void;
//# sourceMappingURL=global-settings-runtime.d.ts.map