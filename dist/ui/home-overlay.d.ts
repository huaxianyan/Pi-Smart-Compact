import type { ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { type Component } from "@earendil-works/pi-tui";
import type { CompactConfig } from "../types.ts";
import type { SmartCompactPolicy } from "../app/smart-compact-policy.ts";
import { SmartSettingsList } from "./settings-list.ts";
import type { EffectiveReadiness } from "../app/effective-state.ts";
import { type GlobalSettingApplied, GlobalSettingsCoordinator } from "./settings-overlay.ts";
import { type ConfigPatch } from "./profiles.ts";
import type { ModelFeasibility } from "../app/model-feasibility.ts";
import type { NavigationPanelActions } from "../app/navigation-types.ts";
import { type DeferredTrim } from "../app/register-smart-context-tool.ts";
export type HomeAction = "compact" | "trim" | "metrics" | "dashboard" | "restore" | "loops" | "forget" | "storage" | "navigation" | "handoff";
export interface HomeOptions {
    ctx: ExtensionCommandContext;
    policy: SmartCompactPolicy;
    coordinator: GlobalSettingsCoordinator;
    onApplied: GlobalSettingApplied;
    /** Writes a whole patch atomically and applies runtime state once. */
    applyPatch: (patch: ConfigPatch) => Promise<CompactConfig>;
    /** Value for the primary row, or the reason it cannot run. */
    compactNow: () => {
        value: string;
        blocked?: string;
    };
    /** Local, read-only readiness (no provider, server, auth or DB contact). */
    readiness: () => Promise<EffectiveReadiness>;
    /** Full effective-state text shown below the readiness summary. */
    effectiveState: () => Promise<string>;
    feasibility?: ModelFeasibility;
    /** Session navigation; absent hides the row. The panel itself opens after Home closes. */
    navigation?: NavigationPanelActions;
    /** One line describing which Smart Compact tools the agent currently sees. */
    toolSummary?: () => string;
    /** Automatic trim held for a cold prompt cache; shown on the cleanup row. */
    deferredTrim?: () => DeferredTrim | null;
}
/** Why local project-memory operations are off for this configuration. */
export declare function localGraphOffReason(config: Pick<CompactConfig, "memoryBackend" | "contextGraphEnabled">): string;
/** Scrollable read-only text; SettingsList renders submenus without a height. */
export declare class TextPanel implements Component {
    private readonly lines;
    private readonly close;
    private top;
    private page;
    private maxTop;
    constructor(lines: () => string[], close: () => void);
    render(width: number): string[];
    handleInput(data: string): void;
    invalidate(): void;
}
export declare function createHomeList(options: HomeOptions, finish: (action?: HomeAction) => void, requestRender: () => void): SmartSettingsList;
/** Open the home screen; resolves with the chosen action, or undefined on Esc. */
export declare function showSmartCompactHome(options: HomeOptions): Promise<HomeAction | undefined>;
//# sourceMappingURL=home-overlay.d.ts.map