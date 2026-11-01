/**
 * Context size across our own context edits.
 *
 * Pi's getContextUsage() drops the last provider-measured usage once a `context_edit` or
 * `compaction` entry is newer than it, and falls back to a chars/4 estimate of the visible
 * messages that misses encrypted and signed reasoning. After real rewinds that estimate read
 * 14-33% below the input the provider measured on the next request. Anchoring keeps the measured
 * size and applies only the edits' estimated difference (0.3-2% from the next input there).
 */
import { estimateTokens, type ExtensionContext, type SessionEntry } from "@earendil-works/pi-coding-agent";
type Estimate = (message: Parameters<typeof estimateTokens>[0]) => number;
/**
 * Last measured usage plus the estimated change since: edits to messages it covered and messages
 * added after it. Null when Pi's own figure is already right (no edit newer than the measurement)
 * or nothing can anchor it (no measured response, or a compaction replaced the measured window).
 * The measured response may itself be edited away: a rewind removes its own call with the research.
 * Pi's own estimator measured the edits most accurately on real rewinds (the provider-calibrated
 * one overcounted removed tool output by up to 8%).
 */
export declare function anchoredContextTokens(branch: SessionEntry[], estimate?: Estimate): number | null;
type UsageContext = Partial<Pick<ExtensionContext, "getContextUsage" | "sessionManager">>;
/** `ctx.getContextUsage()`, anchored across context edits; Pi's value whenever anchoring cannot apply. */
export declare function contextUsage(ctx: UsageContext): ReturnType<ExtensionContext["getContextUsage"]>;
export {};
//# sourceMappingURL=context-usage.d.ts.map