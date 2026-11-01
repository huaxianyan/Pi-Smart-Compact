import type { CompactConfig, CompressionProfile, ProfileConfig } from "../types.ts";
declare const PROFILE_NUMERIC_KEYS: readonly ["summaryBudgetTokens", "keepRecentTokens", "minChunkTokens", "maxChunkTokens", "singlePassMaxTokens", "batchMaxTokens"];
type TopLevelConfigKey = Exclude<keyof CompactConfig, "profiles">;
type ProfileNumericKey = (typeof PROFILE_NUMERIC_KEYS)[number];
export type GlobalConfigPath = TopLevelConfigKey | `profiles.${CompressionProfile}.${ProfileNumericKey}`;
export type GlobalConfigValue = CompactConfig[TopLevelConfigKey] | ProfileConfig[ProfileNumericKey] | undefined;
export declare function readGlobalConfigValue(configPath: GlobalConfigPath): GlobalConfigValue;
/**
 * Mnemopi data directory: absolute, or `~/` followed by a path. Relative paths
 * are rejected rather than resolved against an arbitrary cwd; so are bare `~`,
 * `~user` and control characters.
 */
export declare function isValidMnemopiDataDir(value: string): boolean;
/** Remove invalid user values so the defaults merge remains authoritative. */
export declare function validateSmartCompactConfig(sc: Record<string, unknown>): void;
/**
 * Persist one extension-owned global setting without replacing other Pi or
 * extension settings. Passing undefined removes the override so the built-in
 * default becomes effective again.
 */
export declare function writeGlobalConfigValue(configPath: GlobalConfigPath, value: GlobalConfigValue): Promise<CompactConfig>;
/**
 * Persist several global settings as one change: a single read-modify-write
 * under the settings lock, validated as a whole, written only if every value
 * survives validation (all-or-nothing). `undefined` removes an override.
 */
export declare function writeGlobalConfigValues(patch: Partial<Record<GlobalConfigPath, GlobalConfigValue>>): Promise<CompactConfig>;
/** Test helper — forces the next loadConfig() to re-read settings.json. */
export declare function resetConfigCache(): void;
export declare function loadConfig(): CompactConfig;
export {};
//# sourceMappingURL=config.d.ts.map