// @bun
// src/constants.ts
var VERSION = "10.7.3";
var OPTIONAL_COMPONENTS = {
  mnemopi: { name: "@oh-my-pi/pi-mnemopi", version: "18.12.6", enables: "Mnemopi memory store" },
  bun: { name: "bun", version: "1.4.4", enables: "Mnemopi worker runtime when no Bun 1.3.14+ is on PATH" },
  resvg: { name: "@resvg/resvg-js", version: "2.6.2", enables: "image snapshots" }
};
var CHARS_PER_TOKEN = 3.8;
var MIN_COMPACTION_SAVING_RATIO = 0.1;
var ESTIMATOR_ROUNDING_TOLERANCE_TOKENS = 1;
var YIELD_TARGET_TOLERANCE_RATIO = 0.05;
var POST_SUMMARY_RESERVE_RATIO = 0.25;
var MAX_STATE_OPEN_LOOPS = 25;
var AUTO_TRIGGER_TIMEOUT_CAP_MS = 300000;
var AUTO_TRIGGER_MAX_LLM_CALLS = 4;
var SETTLED_TRIGGER_COOLDOWN_MS = 10 * 60000;
var REBUILD_MIN_TOKENS = 16384;
var CACHE_INACTIVE_ROUTE_MIN_REQUESTS = 3;
var CACHE_INACTIVE_ROUTE_MIN_PROMPT_TOKENS = 4096;
var LONG_CONTEXT_PRICING_THRESHOLD_TOKENS = 200000;
var AUTO_TRIM_BREAK_EVEN_REQUESTS = 24;
var CACHE_WARMING_MIN_SAVINGS_USD = 0.05;
var BUDGET_LIMITS = {
  CALLS: { min: 1, max: 100 },
  INPUT_TOKENS: { min: 1e4, max: 1e6 },
  LATENCY_MS: { min: 5000, max: 600000 }
};
var COMPACT_SYSTEM_PREFIX = "You are an expert conversation summarizer for a coding agent. " + "Produce structured markdown summaries. " + "Follow output format exactly. " + "Use EXACT names \u2014 never paraphrase code identifiers. " + "Trust deterministic extraction data over intuition.";
var PROFILES = {
  light: {
    summaryBudgetTokens: 1e4,
    keepRecentTokens: 30000,
    minChunkTokens: 800,
    maxChunkTokens: 12000,
    singlePassMaxTokens: 40000,
    batchMaxTokens: 30000
  },
  balanced: {
    summaryBudgetTokens: 6000,
    keepRecentTokens: 20000,
    minChunkTokens: 500,
    maxChunkTokens: 8000,
    singlePassMaxTokens: 30000,
    batchMaxTokens: 24000
  },
  aggressive: {
    summaryBudgetTokens: 3000,
    keepRecentTokens: 1e4,
    minChunkTokens: 300,
    maxChunkTokens: 6000,
    singlePassMaxTokens: 20000,
    batchMaxTokens: 18000
  }
};
var PROFILE_NUMERIC_BOUNDS = {
  summaryBudgetTokens: [256, 1e5],
  keepRecentTokens: [1000, 500000],
  minChunkTokens: [100, 1e5],
  maxChunkTokens: [500, 200000],
  singlePassMaxTokens: [1000, 500000],
  batchMaxTokens: [1000, 500000]
};
var LARGE_CONTEXT_WINDOW_TOKENS = 400000;
var CONFIG_NUMERIC_LIMITS = {
  minContextPercent: { min: 0, max: 100, integer: false },
  prepareContextPercent: { min: 0, max: 100, integer: false },
  autoTriggerTimeoutMs: { min: 1000, max: 300000, integer: true },
  maxLlmCalls: { min: 0, max: 100, integer: true },
  maxLlmInputTokens: { min: 0, max: 1e6, integer: true },
  maxContextTokens: { min: 16384, max: 2000000, integer: true, zeroOrRange: true },
  codexMaxCallMs: {
    min: 5000,
    max: 3600000,
    integer: true,
    zeroOrRange: true
  },
  maxLatencyMs: {
    min: 5000,
    max: 7200000,
    integer: true,
    zeroOrRange: true
  },
  pendingTtlMs: { min: 1000, max: 3600000, integer: true },
  pendingFingerprintTtlMs: { min: 60000, max: 3600000, integer: true, zeroOrRange: true },
  hindsightTimeoutMs: { min: 1000, max: 60000, integer: true },
  hindsightRecallMaxTokens: { min: 128, max: 4096, integer: true },
  autoTrimBreakEvenRequests: { min: 1, max: 1000, integer: true },
  autoTrimMinSavingChars: { min: 0, max: 1e7, integer: true }
};
var DEFAULT_CONFIG = {
  mode: "auto",
  profile: "balanced",
  profiles: PROFILES,
  summaryModel: null,
  segmentationModel: null,
  verificationModel: null,
  summaryThinkingLevel: "minimal",
  segmentationThinkingLevel: "minimal",
  agentToolAccess: "inherit",
  toolLoading: "eager",
  autoTrigger: true,
  showStatus: true,
  autoTriggerStrategy: "settled",
  autoTriggerTimeoutMs: 300000,
  backupEnabled: true,
  backupDir: "",
  minContextPercent: 80,
  prepareContextPercent: null,
  maxContextTokens: 0,
  requireApproval: true,
  scrubSecrets: true,
  scrubPii: false,
  maxLlmCalls: 8,
  maxLlmInputTokens: 0,
  codexMaxCallMs: 0,
  maxLatencyMs: 0,
  pendingTtlMs: 300000,
  pendingFingerprintTtlMs: 0,
  focusWeighting: true,
  zeroCallEnabled: true,
  contextGraphEnabled: true,
  compactionEngines: ["eesv"],
  memoryBackend: "local",
  hindsightBaseUrl: null,
  hindsightBankId: null,
  hindsightApiKeyEnv: null,
  hindsightTimeoutMs: 12000,
  hindsightRecallMaxTokens: 2048,
  mnemopiDataDir: null,
  visualArchiveEnabled: false,
  artifactOffloadEnabled: false,
  contextHygieneEnabled: true,
  contextPressureOnly: true,
  providerContextEditing: "off",
  autoTrimBreakEvenRequests: AUTO_TRIM_BREAK_EVEN_REQUESTS,
  autoTrimMinSavingChars: 16384,
  contextNavigationEnabled: true,
  contextRecallEnabled: true,
  contextPivotEnabled: true,
  contextAnchorCacheEnabled: true,
  contextAnchorStatusEnabled: true,
  contextGuidanceEnabled: true,
  promptCacheRoutingEnabled: false,
  telemetryChannel: "stable",
  adaptiveDamageFeedback: false,
  onlineDamageMonitor: true,
  pinPaths: []
};
var NO_OP_RE = /applied:\s*0|no changes applied|nothing to (?:do|change)|0 edits? applied/i;
var SHIFT_RE = /\u015Fimdi|simdi|peki|bi de|bide|ge\u00E7elim|gecelim|bakal\u0131m|bakalim|yapal\u0131m|yapalim|ba\u015Fka|baska|sonra|tamam \u015Fimdi|tamam simdi|now let|also|next|let's|moving on|switch to/iu;
var CHOICE_RE = /use\s+\S+\s+(?:instead|not|rather)|don't\s+use|avoid\s+|switch\s+to\s+|go\s+with\s+|prefer\s+/i;
var SINGLE_PASS_PREFIX = `Summarize this coding agent conversation. Produce ONE structured summary.
` + `
Rules for Accuracy:
` + `1. Session Type: read-only tool calls = REVIEW, not implementation
` + `2. Status: Check for user complaints before marking "Done"
` + `3. Exact Names: Quote specific variable/function/parameter names, don't paraphrase
` + `4. Files: Use the VERIFIED file lists above (deterministically extracted, zero hallucination risk)
` + `
Output EXACTLY this format:

` + `## Goal
[What the user is trying to accomplish]
` + `## Constraints & Preferences
- [CRITICAL: user requirements, preferences, constraints]
` + `## Progress
### Done
- [x] [Completed tasks with file references]
### In Progress
- [ ] [Current work state]
### Blocked
- [Issues]
` + `## Key Decisions
- **[Decision]**: [Rationale]
` + `## Files Modified
- [Verified list from deterministic extraction]
` + `## Files Deleted
- [Verified deleted paths from deterministic extraction]
` + `## Files Read
- [Verified list from deterministic extraction]
` + `## Next Steps
1. [What should happen next]
` + `## Critical Context
- [Specific data, patterns, info needed to continue]
- [Error patterns or gotchas]
` + `## Topics Covered
[Chronological bullet list with priority in brackets]
`;
var SINGLE_PASS_SUFFIX = `
{PREV_CONTEXT}

{EXTRACTION_CONTEXT}

{EXPLORATION_CONTEXT}

<conversation>
{CONVERSATION}
</conversation>`;
var BATCH_PROMPT_PREFIX = `Summarize these conversation segments.

Rules for Accuracy:
` + `1. Use EXACT file paths from extraction data
` + `2. Status: only mark "done" if there's clear evidence (successful test run, user confirmation)
` + `3. Quote specific values, don't paraphrase code

` + `For EACH segment produce EXACTLY:
` + `### CHUNK {NUMBER}: {TOPIC_NAME}
` + `**Priority**: [critical|high|normal|low]
` + `**Summary**: [2-4 sentences: what happened, errors, code changes with paths]
` + `**Decisions**: [comma-separated, or "None"]
` + `**Modified**: [comma-separated paths, or "None"]
` + `**Deleted**: [comma-separated paths, or "None"]
` + `**Read**: [comma-separated paths, or "None"]
`;
var BATCH_PROMPT_SUFFIX = `
{EXTRACTION_CONTEXT}

<segments>
{TEXT}
</segments>`;
var ASSEMBLY_PROMPT_PREFIX = `Merge these topic summaries into ONE coherent summary.

` + `## IMMUTABLE CONTEXT (do not modify or contradict these facts)
` + `These are deterministically verified from the original conversation. They take priority over ANY summary content below.

` + `Rules:
` + `1. Preserve ALL critical/high info. Condense normal, minimize low.
` + `2. Chronological order.
` + `3. The pre-processed data below is GROUND TRUTH \u2014 trust it over individual summaries.
` + `4. Files Modified list is deterministically verified \u2014 if a summary says a file was modified but it's NOT in the list above, omit it.
` + `5. Key Decisions below are verified \u2014 preserve them exactly, do not paraphrase the decision text.
` + `6. Do NOT fabricate file paths, function names, or error messages not present in the verified data.

` + `Format:
` + `## Goal
[Overall objective]
` + `## Constraints & Preferences
- [CRITICAL requirements, preferences, constraints]
` + `## Progress
### Done
- [x] [Completed tasks with file refs]
### In Progress
- [ ] [Current work state]
### Blocked
- [Issues]
` + `## Key Decisions
- **[Decision]**: [Rationale]
` + `## Files Modified
- [Verified deterministic list]
` + `## Files Deleted
- [Verified deterministic deleted paths]
` + `## Files Read
- [Verified deterministic list]
` + `## Next Steps
1. [What should happen next]
` + `## Critical Context
- [Data, patterns, info needed]
` + `## Topics Covered
[Chronological bullets with priority]
`;
var ASSEMBLY_PROMPT_SUFFIX = `
IMMUTABLE CONTEXT (verified deterministic data):
- Key Decisions: {DECISIONS}
- Files Modified (VERIFIED): {MODIFIED}
- Files Read (VERIFIED): {READ}
- Files Deleted (VERIFIED): {DELETED}

{EXPLORATION_CONTEXT}
{PREV_CONTEXT}

<summaries>{SUMMARIES}</summaries>`;
var SESSION_TYPE_INSTRUCTIONS = {
  debugging: "Focus on: error chains, root cause analysis, attempted fixes, resolution status. Prioritize error messages and stack traces. Mark files as Done only if all errors resolved.",
  implementation: "Focus on: files created/modified, architectural decisions, feature completeness, test coverage. Prioritize code changes with exact paths.",
  review: "Focus on: files read, issues found, recommendations, approval status. Prioritize findings over changes. Read-only tool calls = REVIEW, not implementation.",
  discussion: "Focus on: decisions made, trade-offs discussed, consensus reached. Prioritize rationale over implementation details."
};
var SECTION_GOAL = "## Goal";
var SECTION_CONSTRAINTS = "## Constraints & Preferences";
var SECTION_PROGRESS = "## Progress";
var SECTION_DECISIONS = "## Key Decisions";
var SECTION_FILES_MODIFIED = "## Files Modified";
var SECTION_FILES_READ = "## Files Read";
var SECTION_FILES_DELETED = "## Files Deleted";
var SECTION_NEXT_STEPS = "## Next Steps";
var SECTION_CRITICAL_CONTEXT = "## Critical Context";
var SECTION_TOPICS = "## Topics Covered";
var SECTION_OPEN_LOOPS = "## Open Loops";
var SECTION_CHANGES = "## Changes Since Last Compaction";
var LOG_PREFIX = "[smart-compact]";
var MIN_TOKEN_THRESHOLD = 5000;
var MAX_EXPLORATION_ROUNDS = 3;
var BACKUP_MAX_FILES = 20;
var BACKUP_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
var FIVE_MINUTES_MS = 5 * 60 * 1000;
var ONE_HOUR_MS = 60 * 60 * 1000;
var SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
var STATE_SNAPSHOT_MAX_FILES = 64;
var EXTRACTION_LIMITS = {
  MODIFIED_FILES: 120,
  READ_FILES: 160,
  DELETED_FILES: 120,
  ERRORS: 80,
  DECISIONS: 80,
  CONSTRAINTS: 80,
  TOPICS: 80,
  TIMELINE: 120,
  MEDIA_ATTACHMENTS: 40,
  REFERENCED_FILES: 200
};
var THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
var EXTRACTION_CACHE_PREFIX = "compact-extraction-";
var ID_PREFIX = {
  PROJECT: "proj-",
  COMPACT_SESSION: "sc-",
  MULTI_TOOL_USE_SYNTHETIC: "mtu_",
  OPEN_LOOP: "loop-",
  DECISION: "decision-",
  ERROR: "error-"
};
var TUNING = {
  EMA_PREV: 0.7,
  EMA_SAMPLE: 0.3,
  CALIBRATION_CLAMP_MIN: 0.3,
  CALIBRATION_CLAMP_MAX: 3,
  CONFIDENCE_HIGH: 0.85,
  CONFIDENCE_MEDIUM: 0.8,
  CONFIDENCE_LOW: 0.6
};
var TRUNC = {
  MESSAGE: 300,
  ERROR_DETAIL: 500,
  DECISION_SUMMARY: 200,
  USER_RESPONSE: 300,
  CONSTRAINT_TEXT: 300,
  OPEN_LOOP_SUMMARY: 120,
  TIMELINE_EVENT: 150,
  TIMELINE_ERROR: 100,
  SNIPPET: 80,
  PREVIEW: 150,
  PREVIEW_MID: 200,
  DETAIL: 300,
  PREVIEW_LONG: 400,
  PREVIEW_XL: 500,
  PREVIOUS_SUMMARY: 12000,
  CONTINUITY_CAPSULE: 4000,
  CHUNK_FALLBACK: 180,
  DECISION_DETAIL: 60,
  TOPIC_LABEL: 100,
  PROJ_ID_HASH: 12,
  CONV_HASH: 8,
  RESULT_GAPS: 5,
  SESSION_ID_DISPLAY: 20,
  ERROR_SNIPPET: 30,
  TIMELINE_DISPLAY: 10,
  EXPLORE_RESULTS: 15,
  BACKUP_PREVIEW_LINES: 5,
  FINGERPRINT_SEG: 2
};
var MAX_TOOL_OUTPUT_CHARS = 800;
var MAX_EXPLORER_OUTPUT_CHARS = 12000;
var LIKELY_ERROR_RE = /(?:command not found|no such file|permission denied|syntax error|cannot find|module not found|compilation error|build failed|test failed|^FAIL\b|ERROR:)/i;
var TRIM_RISK_LINE_RE = /\b(?:error|fail(?:ed|ure)|warn(?:ing)?|exception|traceback|panic|exit code|exited with|command not found|permission denied|ENOENT|EACCES)\b/i;
var TRIM_MARKER_MAX_LINES = 6;
var TRIM_MARKER_MAX_CHARS = 400;
var ERROR_RETRY_WINDOW = 6;
var ERROR_RESOLVE_WINDOW = 10;
var HANDOFF_MAX_CHARS = 16000;
var HANDOFF_RECALL_MAX_CHARS = 6000;
var HANDOFF_RECALL_LIMIT = 5;
var LINEAGE_MAX_DEPTH = 3;
var LINEAGE_MAX_FILE_BYTES = 64 * 1024 * 1024;
var METRICS_BUFFER_MAX = 200;
var RUNTIME_LOG_MAX_BYTES = 5 * 1024 * 1024;
var CONFIG_KEY = "smartCompact";
var CONFIG_KEY_ALT = "semanticCompact";
var EXPLORER_SYSTEM_PROMPT = `You are a conversation analyst. You have deterministic extraction data and can query the raw conversation using tools.

` + `Your job:
` + `1. Verify/enrich the extracted boundaries (merge, split, or add as needed)
` + `2. Identify cross-topic relationships
` + `3. Find implicit constraints (user tone, frustration, urgency)
` + `4. Assess completion status accurately
` + `5. Extract the narrative arc

` + `Use tools BEFORE forming conclusions. Finish within 3 tool rounds.

` + `After exploration, output ONLY a JSON object (no markdown):
` + '{"boundaries":[{"afterIndex":N,"topic":"...","priority":"critical|high|normal|low","confidence":0.0-1.0}],"mainGoal":"...","sessionType":"implementation|review|debugging|discussion","enrichedConstraints":[...],"crossReferences":[...],"statusAssessment":{"done":[...],"inProgress":[...],"blocked":[...]},"criticalContext":[...],"keyDecisions":[...]}';

// src/extension-api.ts
var SMART_COMPACT_MIN_CONTEXT_PERCENT = DEFAULT_CONFIG.minContextPercent;
var SMART_COMPACT_REQUEST = "smart-compact:request:v1";
function requestSmartCompaction(pi, ctx, signal, timeoutMs = 300000) {
  if (signal.aborted)
    return Promise.resolve({ status: "cancelled" });
  return new Promise((resolve) => {
    let accepted = false;
    let done = false;
    const controller = new AbortController;
    let deadline;
    const finish = (result) => {
      if (done)
        return;
      done = true;
      signal.removeEventListener("abort", abort);
      if (deadline)
        clearTimeout(deadline);
      resolve(result);
    };
    const abort = () => {
      controller.abort();
      finish({ status: "cancelled" });
    };
    signal.addEventListener("abort", abort, { once: true });
    const request = {
      ctx,
      signal: controller.signal,
      timeoutMs,
      accept: () => {
        if (accepted || done)
          return false;
        accepted = true;
        return true;
      },
      respond: finish
    };
    try {
      pi.events.emit(SMART_COMPACT_REQUEST, request);
      if (!accepted)
        finish({ status: "failed", errorMessage: "Smart Compact recovery interface is unavailable; load the recovery-enabled package." });
      if (!done)
        deadline = setTimeout(() => {
          finish({ status: "failed", errorMessage: "Smart compaction timed out." });
          controller.abort();
        }, timeoutMs);
    } catch (error) {
      finish({ status: "failed", errorMessage: error instanceof Error ? error.message : String(error) });
    }
  });
}
export {
  SMART_COMPACT_MIN_CONTEXT_PERCENT,
  SMART_COMPACT_REQUEST,
  requestSmartCompaction
};
