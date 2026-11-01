import type { ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { type SettingItem } from "@earendil-works/pi-tui";
import type { CompactConfig, CompressionProfile } from "../types.ts";
import { type GlobalConfigPath, type GlobalConfigValue } from "../utils/config.ts";
import { SmartSettingsList } from "./settings-list.ts";
import type { ModelFeasibility } from "../app/model-feasibility.ts";
export type GlobalConfigWriter = (path: GlobalConfigPath, value: GlobalConfigValue) => Promise<CompactConfig>;
export interface InputSetting {
    id: GlobalConfigPath;
    label: string;
    description: string;
    placeholder: string;
    parse(input: string): GlobalConfigValue;
    format(value: GlobalConfigValue): string;
}
export declare const MODEL_SETTINGS: readonly [{
    readonly id: "summaryModel";
    readonly label: "Summary model";
    readonly description: "Writes the summary. Default: the chat model.";
}, {
    readonly id: "segmentationModel";
    readonly label: "Topic split model";
    readonly description: "Splits long conversations into topics before summarizing. Default: the summary model.";
}, {
    readonly id: "verificationModel";
    readonly label: "Check & repair model";
    readonly description: "Fixes gaps the checker finds in a summary. Default: the summary model.";
}];
export declare const MIN_CONTEXT_SETTING: InputSetting;
export declare const MAX_CONTEXT_SETTING: InputSetting;
export declare const PREPARE_CONTEXT_SETTING: InputSetting;
export declare const LIMIT_SETTINGS: readonly InputSetting[];
export declare const HINDSIGHT_SETTINGS: readonly InputSetting[];
export declare const MNEMOPI_DATA_DIR_SETTING: InputSetting;
export declare const BACKUP_DIR_SETTING: InputSetting;
export declare const PIN_PATHS_SETTING: InputSetting;
export declare function profileSettings(profile: CompressionProfile): InputSetting[];
/** Row label with the "changed from default" bullet, matching category rows. */
export declare function inputLabel(setting: InputSetting): string;
/** Format the stored override the way the input row displays it. */
export declare function inputDisplay(setting: InputSetting): string;
export declare function inputEffectiveDescription(setting: InputSetting, config: CompactConfig): string;
/** One row that opens an inline editor for a validated text/number setting. */
export declare function inputSettingItem(setting: InputSetting, requestRender: () => void, writeConfig: GlobalConfigWriter, onWritten?: (config: CompactConfig) => void): SettingItem;
export declare function inputSettingsList(settings: readonly InputSetting[], requestRender: () => void, done: () => void, writeConfig: GlobalConfigWriter, onError: (message: string) => void): SmartSettingsList;
/** Rows for the three run modes, each opening the six budgets its profile stores. */
export declare function profileBudgetsList(requestRender: () => void, done: () => void, writeConfig: GlobalConfigWriter, onError: (message: string) => void): SmartSettingsList;
/** "N changed" or "defaults" for a set of stored paths. */
export declare function countChangedPaths(ids: readonly GlobalConfigPath[]): string;
export declare function profileConfigPaths(): GlobalConfigPath[];
export declare function modelSettingsItems(ctx: ExtensionCommandContext, requestRender: () => void, writeConfig?: GlobalConfigWriter, feasibility?: ModelFeasibility): SettingItem[];
/** Row that opens the model picker for one model setting. */
export declare function modelSettingItem(id: (typeof MODEL_SETTINGS)[number]["id"], ctx: ExtensionCommandContext, requestRender: () => void, writeConfig: GlobalConfigWriter, feasibility?: ModelFeasibility): SettingItem;
export declare function complexConfigPaths(): GlobalConfigPath[];
//# sourceMappingURL=settings-complex.d.ts.map