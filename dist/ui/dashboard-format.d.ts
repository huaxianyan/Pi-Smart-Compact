import type { CompactMetricsEntry } from "../types.ts";
/** Dashboard lines per page: fits the 85%-high overlay minus its 6 chrome lines; 24 without a known height. */
export declare function dashboardPageSize(rows?: number | undefined): number;
export declare function metricDuration(entry: CompactMetricsEntry): number;
export declare function metricMs(ms: number): string;
export declare function metricPct(value: number | undefined): string;
export declare function metricNum(value: number | undefined): string;
export declare function metricScore(entry: CompactMetricsEntry | undefined): string;
export declare function formatMetricRun(entry: CompactMetricsEntry, index?: number): string;
export declare function formatMetricRunCompact(entry: CompactMetricsEntry): string;
export declare function formatRunDetails(entry: CompactMetricsEntry | undefined, title: string): string[];
export declare function formatCurrentSession(entries: CompactMetricsEntry[], currentSessionId: string | undefined): string[];
export declare function formatRecentRuns(entries: CompactMetricsEntry[]): string[];
export declare function isDashboardTitleLine(line: string): boolean;
//# sourceMappingURL=dashboard-format.d.ts.map