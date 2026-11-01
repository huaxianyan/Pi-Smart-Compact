/**
 * Constants, prompts, and profile defaults.
 */
import type { CompressionProfile, ProfileConfig } from "./types.ts";
/**
 * Single-source-of-truth note: this literal is rewritten in place by
 * `scripts/sync-version.ts` (wired to `prebuild`/`prepublishOnly`) from
 * `package.json#version`. Do not hand-edit this line for releases; bump
 * package.json and run `bun run sync-version`.
 */
export declare const VERSION = "10.7.3";
/**
 * Opt-in components that are not installed with the extension: optional peer
 * dependencies in package.json, pinned to the versions the release audit
 * exercises. The audit fails if these drift from the manifest.
 */
export declare const OPTIONAL_COMPONENTS: {
    readonly mnemopi: {
        readonly name: "@oh-my-pi/pi-mnemopi";
        readonly version: "18.12.6";
        readonly enables: "Mnemopi memory store";
    };
    readonly bun: {
        readonly name: "bun";
        readonly version: "1.4.4";
        readonly enables: "Mnemopi worker runtime when no Bun 1.3.14+ is on PATH";
    };
    readonly resvg: {
        readonly name: "@resvg/resvg-js";
        readonly version: "2.6.2";
        readonly enables: "image snapshots";
    };
};
export declare const CHARS_PER_TOKEN = 3.8;
export declare const MIN_COMPACTION_SAVING_RATIO = 0.1;
export declare const ESTIMATOR_ROUNDING_TOLERANCE_TOKENS = 1;
/** Share of the planned post-compaction target a verified summary may overshoot. */
export declare const YIELD_TARGET_TOLERANCE_RATIO = 0.05;
/** Space reserved in the window plan for deterministic verification/state sections added after LLM synthesis. */
export declare const POST_SUMMARY_RESERVE_RATIO = 0.25;
/** Maximum number of open-loop records retained in durable continuity state. */
export declare const MAX_STATE_OPEN_LOOPS = 25;
/**
 * Hard ceiling for an automatic run. Large windows need materially more than a
 * minute: a 270K-token context splits into several batches, and aborting mid-run
 * throws away every completed batch and hands the turn to native compaction.
 * The ceiling still exists so a wedged provider cannot block the host forever.
 */
export declare const AUTO_TRIGGER_TIMEOUT_CAP_MS = 300000;
/** Provider-call ceiling for the synchronous session_before_compact hook. */
export declare const AUTO_TRIGGER_MAX_LLM_CALLS = 4;
/** Suppress proactive settled-trigger churn after any confirmed compaction. */
export declare const SETTLED_TRIGGER_COOLDOWN_MS: number;
/**
 * Minimum uncached prompt tokens (input + cacheWrite) for a host request to
 * count as a prompt-cache rebuild. Anthropic caches need >=1024-4096-token
 * prefixes and every turn legitimately re-sends the new tail uncached (tool
 * results, user input: routinely a few thousand tokens); 16k sits clearly
 * above that tail noise while staying far below a real prefix rebuild.
 */
export declare const REBUILD_MIN_TOKENS = 16384;
/** Consecutive large zero-read requests before a route is flagged cache-inactive. */
export declare const CACHE_INACTIVE_ROUTE_MIN_REQUESTS = 3;
/** Prompt floor for the inactive-route streak; covers every documented provider minimum. */
export declare const CACHE_INACTIVE_ROUTE_MIN_PROMPT_TOKENS = 4096;
/** First-party Anthropic long-context pricing starts above this many prompt tokens. */
export declare const LONG_CONTEXT_PRICING_THRESHOLD_TOKENS = 200000;
/**
 * Further requests within which a warm-cache automatic trim must pay back its
 * prefix rewrite; sessions rarely run that many requests without another prefix change.
 */
export declare const AUTO_TRIM_BREAK_EVEN_REQUESTS = 24;
/**
 * Expected savings (USD) a prompt-cache refresh must reach to be worth sending;
 * Pi warms when `continuationProbability * missCost - warmCost >= 0.05` (Pi docs/settings.md).
 */
export declare const CACHE_WARMING_MIN_SAVINGS_USD = 0.05;
/** Positive per-run bounds shared by CLI and tool arguments; config separately allows 0 as a mode-derived sentinel. */
export declare const BUDGET_LIMITS: {
    readonly CALLS: {
        readonly min: 1;
        readonly max: 100;
    };
    readonly INPUT_TOKENS: {
        readonly min: 10000;
        readonly max: 1000000;
    };
    readonly LATENCY_MS: {
        readonly min: 5000;
        readonly max: 600000;
    };
};
export declare const COMPACT_SYSTEM_PREFIX: string;
export declare const PROFILES: Record<CompressionProfile, ProfileConfig>;
export declare const PROFILE_NUMERIC_BOUNDS: {
    readonly summaryBudgetTokens: readonly [256, 100000];
    readonly keepRecentTokens: readonly [1000, 500000];
    readonly minChunkTokens: readonly [100, 100000];
    readonly maxChunkTokens: readonly [500, 200000];
    readonly singlePassMaxTokens: readonly [1000, 500000];
    readonly batchMaxTokens: readonly [1000, 500000];
};
/** Home warns above this model window when maxContextTokens is off. */
export declare const LARGE_CONTEXT_WINDOW_TOKENS = 400000;
export declare const CONFIG_NUMERIC_LIMITS: {
    readonly minContextPercent: {
        readonly min: 0;
        readonly max: 100;
        readonly integer: false;
    };
    readonly prepareContextPercent: {
        readonly min: 0;
        readonly max: 100;
        readonly integer: false;
    };
    readonly autoTriggerTimeoutMs: {
        readonly min: 1000;
        readonly max: 300000;
        readonly integer: true;
    };
    readonly maxLlmCalls: {
        readonly min: 0;
        readonly max: 100;
        readonly integer: true;
    };
    readonly maxLlmInputTokens: {
        readonly min: 0;
        readonly max: 1000000;
        readonly integer: true;
    };
    readonly maxContextTokens: {
        readonly min: 16384;
        readonly max: 2000000;
        readonly integer: true;
        readonly zeroOrRange: true;
    };
    readonly codexMaxCallMs: {
        readonly min: 5000;
        readonly max: 3600000;
        readonly integer: true;
        readonly zeroOrRange: true;
    };
    readonly maxLatencyMs: {
        readonly min: 5000;
        readonly max: 7200000;
        readonly integer: true;
        readonly zeroOrRange: true;
    };
    readonly pendingTtlMs: {
        readonly min: 1000;
        readonly max: 3600000;
        readonly integer: true;
    };
    readonly pendingFingerprintTtlMs: {
        readonly min: 60000;
        readonly max: 3600000;
        readonly integer: true;
        readonly zeroOrRange: true;
    };
    readonly hindsightTimeoutMs: {
        readonly min: 1000;
        readonly max: 60000;
        readonly integer: true;
    };
    readonly hindsightRecallMaxTokens: {
        readonly min: 128;
        readonly max: 4096;
        readonly integer: true;
    };
    readonly autoTrimBreakEvenRequests: {
        readonly min: 1;
        readonly max: 1000;
        readonly integer: true;
    };
    readonly autoTrimMinSavingChars: {
        readonly min: 0;
        readonly max: 10000000;
        readonly integer: true;
    };
};
export declare const DEFAULT_CONFIG: {
    mode: "auto";
    profile: CompressionProfile;
    profiles: Record<CompressionProfile, ProfileConfig>;
    summaryModel: string | null;
    segmentationModel: string | null;
    verificationModel: string | null;
    summaryThinkingLevel: "minimal";
    segmentationThinkingLevel: "minimal";
    agentToolAccess: "inherit";
    toolLoading: "eager";
    autoTrigger: boolean;
    showStatus: boolean;
    autoTriggerStrategy: "settled";
    autoTriggerTimeoutMs: number;
    backupEnabled: boolean;
    backupDir: string;
    minContextPercent: number;
    prepareContextPercent: number | null;
    maxContextTokens: number;
    requireApproval: boolean;
    scrubSecrets: boolean;
    scrubPii: boolean;
    maxLlmCalls: number;
    maxLlmInputTokens: number;
    codexMaxCallMs: number;
    maxLatencyMs: number;
    pendingTtlMs: number;
    pendingFingerprintTtlMs: number;
    focusWeighting: boolean;
    zeroCallEnabled: boolean;
    contextGraphEnabled: boolean;
    compactionEngines: Array<"eesv" | "native">;
    memoryBackend: "local";
    hindsightBaseUrl: string | null;
    hindsightBankId: string | null;
    hindsightApiKeyEnv: string | null;
    hindsightTimeoutMs: number;
    hindsightRecallMaxTokens: number;
    mnemopiDataDir: string | null;
    visualArchiveEnabled: boolean;
    artifactOffloadEnabled: boolean;
    contextHygieneEnabled: boolean;
    contextPressureOnly: boolean;
    providerContextEditing: "off";
    autoTrimBreakEvenRequests: number;
    autoTrimMinSavingChars: number;
    contextNavigationEnabled: boolean;
    contextRecallEnabled: boolean;
    contextPivotEnabled: boolean;
    contextAnchorCacheEnabled: boolean;
    contextAnchorStatusEnabled: boolean;
    contextGuidanceEnabled: boolean;
    promptCacheRoutingEnabled: boolean;
    telemetryChannel: "stable";
    adaptiveDamageFeedback: boolean;
    onlineDamageMonitor: boolean;
    pinPaths: string[];
};
export declare const NO_OP_RE: RegExp;
export declare const SHIFT_RE: RegExp;
export declare const CHOICE_RE: RegExp;
export declare const SINGLE_PASS_PREFIX: string;
export declare const SINGLE_PASS_SUFFIX = "\n{PREV_CONTEXT}\n\n{EXTRACTION_CONTEXT}\n\n{EXPLORATION_CONTEXT}\n\n<conversation>\n{CONVERSATION}\n</conversation>";
export declare const BATCH_PROMPT_PREFIX: string;
export declare const BATCH_PROMPT_SUFFIX = "\n{EXTRACTION_CONTEXT}\n\n<segments>\n{TEXT}\n</segments>";
export declare const ASSEMBLY_PROMPT_PREFIX: string;
export declare const ASSEMBLY_PROMPT_SUFFIX = "\nIMMUTABLE CONTEXT (verified deterministic data):\n- Key Decisions: {DECISIONS}\n- Files Modified (VERIFIED): {MODIFIED}\n- Files Read (VERIFIED): {READ}\n- Files Deleted (VERIFIED): {DELETED}\n\n{EXPLORATION_CONTEXT}\n{PREV_CONTEXT}\n\n<summaries>{SUMMARIES}</summaries>";
export declare const SESSION_TYPE_INSTRUCTIONS: Record<string, string>;
export declare const SECTION_GOAL = "## Goal";
export declare const SECTION_CONSTRAINTS = "## Constraints & Preferences";
export declare const SECTION_PROGRESS = "## Progress";
export declare const SECTION_DECISIONS = "## Key Decisions";
export declare const SECTION_FILES_MODIFIED = "## Files Modified";
export declare const SECTION_FILES_READ = "## Files Read";
export declare const SECTION_FILES_DELETED = "## Files Deleted";
export declare const SECTION_NEXT_STEPS = "## Next Steps";
export declare const SECTION_CRITICAL_CONTEXT = "## Critical Context";
export declare const SECTION_TOPICS = "## Topics Covered";
export declare const SECTION_OPEN_LOOPS = "## Open Loops";
export declare const SECTION_CHANGES = "## Changes Since Last Compaction";
export declare const LOG_PREFIX = "[smart-compact]";
export declare const MIN_TOKEN_THRESHOLD = 5000;
export declare const MAX_EXPLORATION_ROUNDS = 3;
export declare const BACKUP_MAX_FILES = 20;
export declare const BACKUP_MAX_AGE_MS: number;
export declare const FIVE_MINUTES_MS: number;
export declare const ONE_HOUR_MS: number;
export declare const SEVEN_DAYS_MS: number;
export declare const STATE_SNAPSHOT_MAX_FILES = 64;
/** Bounded summary-domain evidence; newest/highest-value items win. */
export declare const EXTRACTION_LIMITS: {
    readonly MODIFIED_FILES: 120;
    readonly READ_FILES: 160;
    readonly DELETED_FILES: 120;
    readonly ERRORS: 80;
    readonly DECISIONS: 80;
    readonly CONSTRAINTS: 80;
    readonly TOPICS: 80;
    readonly TIMELINE: 120;
    readonly MEDIA_ATTACHMENTS: 40;
    readonly REFERENCED_FILES: 200;
};
export declare const THIRTY_DAYS_MS: number;
export declare const EXTRACTION_CACHE_PREFIX = "compact-extraction-";
export declare const ID_PREFIX: {
    readonly PROJECT: "proj-";
    readonly COMPACT_SESSION: "sc-";
    readonly MULTI_TOOL_USE_SYNTHETIC: "mtu_";
    readonly OPEN_LOOP: "loop-";
    readonly DECISION: "decision-";
    readonly ERROR: "error-";
};
export declare const TUNING: {
    readonly EMA_PREV: 0.7;
    readonly EMA_SAMPLE: 0.3;
    readonly CALIBRATION_CLAMP_MIN: 0.3;
    readonly CALIBRATION_CLAMP_MAX: 3;
    readonly CONFIDENCE_HIGH: 0.85;
    readonly CONFIDENCE_MEDIUM: 0.8;
    readonly CONFIDENCE_LOW: 0.6;
};
export declare const TRUNC: {
    readonly MESSAGE: 300;
    readonly ERROR_DETAIL: 500;
    readonly DECISION_SUMMARY: 200;
    readonly USER_RESPONSE: 300;
    readonly CONSTRAINT_TEXT: 300;
    readonly OPEN_LOOP_SUMMARY: 120;
    readonly TIMELINE_EVENT: 150;
    readonly TIMELINE_ERROR: 100;
    readonly SNIPPET: 80;
    readonly PREVIEW: 150;
    readonly PREVIEW_MID: 200;
    readonly DETAIL: 300;
    readonly PREVIEW_LONG: 400;
    readonly PREVIEW_XL: 500;
    readonly PREVIOUS_SUMMARY: 12000;
    readonly CONTINUITY_CAPSULE: 4000;
    readonly CHUNK_FALLBACK: 180;
    readonly DECISION_DETAIL: 60;
    readonly TOPIC_LABEL: 100;
    readonly PROJ_ID_HASH: 12;
    readonly CONV_HASH: 8;
    readonly RESULT_GAPS: 5;
    readonly SESSION_ID_DISPLAY: 20;
    readonly ERROR_SNIPPET: 30;
    readonly TIMELINE_DISPLAY: 10;
    readonly EXPLORE_RESULTS: 15;
    readonly BACKUP_PREVIEW_LINES: 5;
    readonly FINGERPRINT_SEG: 2;
};
export declare const MAX_TOOL_OUTPUT_CHARS = 800;
/** Provider-visible output from one exploration tool invocation. */
export declare const MAX_EXPLORER_OUTPUT_CHARS = 12000;
/** Shell-output patterns signalling a likely error even in a non-`isError` result. */
export declare const LIKELY_ERROR_RE: RegExp;
/** Conservative risk lines kept in a trim marker's digest (errors, failures, warnings, exits). */
export declare const TRIM_RISK_LINE_RE: RegExp;
/** Trim marker digest bounds: line 1 always kept; later lines dropped from the end to fit. */
export declare const TRIM_MARKER_MAX_LINES = 6;
export declare const TRIM_MARKER_MAX_CHARS = 400;
/** How far forward to look for a retry of the same tool after an error. */
export declare const ERROR_RETRY_WINDOW = 6;
/** How far forward to look for that retry's resolving (non-error) result. */
export declare const ERROR_RESOLVE_WINDOW = 10;
/** Handoff seed cap (same as a pivot carryover); recall gets a bounded share. */
export declare const HANDOFF_MAX_CHARS = 16000;
export declare const HANDOFF_RECALL_MAX_CHARS = 6000;
export declare const HANDOFF_RECALL_LIMIT = 5;
/** Parent sessions `smart_context scope=lineage` follows through `parentSession` headers, and the largest file it loads. */
export declare const LINEAGE_MAX_DEPTH = 3;
export declare const LINEAGE_MAX_FILE_BYTES: number;
export declare const METRICS_BUFFER_MAX = 200;
export declare const RUNTIME_LOG_MAX_BYTES: number;
export declare const CONFIG_KEY = "smartCompact";
export declare const CONFIG_KEY_ALT = "semanticCompact";
export declare const EXPLORER_SYSTEM_PROMPT: string;
//# sourceMappingURL=constants.d.ts.map