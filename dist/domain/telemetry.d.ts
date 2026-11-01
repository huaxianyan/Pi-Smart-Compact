import type { CompactMetricsEntry, PreparationDiscardReason, TelemetryFailureKind } from "../types.ts";
export interface DamageTelemetryEntry {
    ts?: string;
    /** Originating compaction run; required for trustworthy quality/damage joins. */
    runId?: string;
    version?: string;
    releaseChannel?: "stable" | "canary";
    observationSource?: "online-window" | "next-compaction";
    damageScore?: number;
}
export interface TelemetryWindowStats {
    runs: number;
    /** Host-confirmed applies only (status success). */
    appliedRuns: number;
    /** Real non-dry, non-cancel attempts backing the failure-rate signal. */
    attemptedRuns: number;
    successRate: number;
    avgQuality: number | null;
    qualityCoverage: number;
    p95LatencyMs: number;
    avgTokens: number;
    fallbackRate: number;
    damageRate: number;
    damageCoverage: number;
}
export interface CanaryTrigger {
    metric: "failure-rate" | "quality" | "latency" | "tokens" | "fallback" | "damage";
    baseline: number;
    canary: number;
    threshold: string;
}
export interface CanaryAssessment {
    version: string;
    decision: "promote" | "hold" | "rollback";
    dataConfidence: number;
    baseline: TelemetryWindowStats;
    canary: TelemetryWindowStats;
    triggers: CanaryTrigger[];
    reasons: string[];
}
export interface PrivacySafeTelemetryAggregate {
    version: string;
    /** "unknown" when an entry carries no explicit channel; never silently stable. */
    channel: "stable" | "canary" | "unknown";
    provider: string;
    model: string;
    runs: number;
    /** Host-confirmed applies only. */
    successes: number;
    avgQuality: number | null;
    avgLatencyMs: number;
    inputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
    outputTokens: number;
}
/** Content-free policy measurements for speculative preparation. */
export interface PreparationPolicyStats {
    preparedRuns: number;
    usedRuns: number;
    discardedRuns: number;
    /** Prepared runs that ended in timeout/error — real failures, not discards. */
    otherOutcomes: number;
    discardReasons: Partial<Record<PreparationDiscardReason, number>>;
    medianReadyMs: number | null;
    medianWaitMs: number | null;
    /** used / (used + discarded); null before the first resolvable outcome. */
    reuseRate: number | null;
    /** Spend on work that never applied; counted once, never in the applied cohort. */
    discardedCost: {
        calls: number;
        inputTokens: number;
        cacheReadTokens: number;
        cacheWriteTokens: number;
        outputTokens: number;
    };
}
/** Aggregate visibility for existing verifier-provenance fields. */
export interface QualityProvenanceStats {
    measuredRuns: number;
    avgInitialQuality: number | null;
    avgRepairGain: number | null;
    deterministicPatchRuns: number;
    llmPatchRuns: number;
    qualityFloorRuns: number;
}
export interface PrivacySafeTelemetry {
    generatedAt: string;
    totalRuns: number;
    aggregates: PrivacySafeTelemetryAggregate[];
    failures: Partial<Record<TelemetryFailureKind, number>>;
    canary: CanaryAssessment;
    preparation: PreparationPolicyStats;
    qualityProvenance: QualityProvenanceStats;
    privacy: "aggregate-only; no session ids, project ids, prompts, summaries, paths, or error text";
}
/** Stable, content-free failure taxonomy for aggregate telemetry. */
export declare function classifyTelemetryFailure(error: unknown, timedOut?: boolean): TelemetryFailureKind;
export declare function assessCanary(entries: readonly CompactMetricsEntry[], damageEntries: readonly DamageTelemetryEntry[], options: {
    version: string;
    minCanaryRuns?: number;
    baselineRuns?: number;
}): CanaryAssessment;
export declare const TELEMETRY_FAILURE_KINDS: ReadonlySet<TelemetryFailureKind>;
export declare function isTelemetryFailureKind(value: unknown): value is TelemetryFailureKind;
export declare function buildPreparationStats(entries: readonly CompactMetricsEntry[]): PreparationPolicyStats;
export declare function buildQualityProvenanceStats(entries: readonly CompactMetricsEntry[]): QualityProvenanceStats;
export declare function buildPrivacySafeTelemetry(entries: readonly CompactMetricsEntry[], damageEntries: readonly DamageTelemetryEntry[], options: {
    version: string;
    minCanaryRuns?: number;
}): PrivacySafeTelemetry;
export declare function formatPrivacySafeTelemetry(report: PrivacySafeTelemetry): string;
//# sourceMappingURL=telemetry.d.ts.map