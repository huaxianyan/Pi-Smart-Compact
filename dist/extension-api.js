// src/constants.ts
var SETTLED_TRIGGER_COOLDOWN_MS = 10 * 60000;
var COMPACT_SYSTEM_PREFIX = "You are an expert conversation summarizer for a coding agent. " + "Produce structured markdown summaries. " + "Follow output format exactly. " + "Use EXACT names — never paraphrase code identifiers. " + "Trust deterministic extraction data over intuition.";
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
  autoTrigger: true,
  showStatus: true,
  autoTriggerStrategy: "native-hook",
  autoTriggerTimeoutMs: 120000,
  backupEnabled: true,
  backupDir: "",
  minContextPercent: 60,
  requireApproval: true,
  scrubSecrets: true,
  scrubPii: false,
  maxLlmCalls: 8,
  maxLlmInputTokens: 0,
  codexMaxCallMs: 0,
  maxLatencyMs: 0,
  pendingTtlMs: 300000,
  focusWeighting: true,
  zeroCallEnabled: true,
  contextGraphEnabled: true,
  telemetryChannel: "stable",
  adaptiveDamageFeedback: false,
  onlineDamageMonitor: true,
  pinPaths: []
};
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
var ASSEMBLY_PROMPT_PREFIX = `Merge these topic summaries into ONE coherent summary.

` + `## IMMUTABLE CONTEXT (do not modify or contradict these facts)
` + `These are deterministically verified from the original conversation. They take priority over ANY summary content below.

` + `Rules:
` + `1. Preserve ALL critical/high info. Condense normal, minimize low.
` + `2. Chronological order.
` + `3. The pre-processed data below is GROUND TRUTH — trust it over individual summaries.
` + `4. Files Modified list is deterministically verified — if a summary says a file was modified but it's NOT in the list above, omit it.
` + `5. Key Decisions below are verified — preserve them exactly, do not paraphrase the decision text.
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
var BACKUP_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000;
var FIVE_MINUTES_MS = 5 * 60 * 1000;
var ONE_HOUR_MS = 60 * 60 * 1000;
var SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
var THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
var RUNTIME_LOG_MAX_BYTES = 5 * 1024 * 1024;
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
