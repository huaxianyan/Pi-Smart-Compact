export type IssueSeverity = "warning" | "error";
export interface IssueInput {
    /** Stable cause key used for dedupe, e.g. "hindsight.auth". */
    key: string;
    /** "Smart Compact: <what happened>. <effect>. <what to do>" (prefix optional). */
    message: string;
    severity?: IssueSeverity;
    /** Raw error for the debug trace only. */
    error?: unknown;
}
export interface IssueRecord {
    key: string;
    severity: IssueSeverity;
    message: string;
    firstAt: number;
    lastAt: number;
    count: number;
}
/** Minimal context surface; both extension and command contexts satisfy it. */
export interface IssueSink {
    hasUI?: boolean;
    /**
     * Background snapshot contexts: routine messages are dropped and reported
     * issues are queued for the next real context instead of shown now.
     */
    silentBackground?: boolean;
    ui?: {
        notify(message: string, type?: "info" | "warning" | "error"): void;
    };
    sessionManager?: {
        getSessionId?(): string | undefined;
    };
}
/** Scrub secrets, collapse to one line, bound length, add the prefix. */
export declare function formatIssueMessage(message: string): string;
/** Literal, scrubbed, single-line error text for embedding in a message. */
export declare function errorDetail(error: unknown): string;
/**
 * Record a problem for the status history without a toast. Use it when the
 * caller already surfaces the failure (e.g. a returned `false` becomes a
 * visible persistence warning) or when the effect is harmless and expected.
 */
export declare function recordIssue(input: IssueInput): void;
/**
 * Report a user-visible problem. With a context it is shown now (once per
 * session per key); without one it is queued until `flushIssues(ctx)`.
 */
export declare function reportIssue(input: IssueInput, sink?: IssueSink): void;
/** Deliver issues reported where no context was available. */
export declare function flushIssues(sink: IssueSink): void;
/**
 * Show a user-facing message. With a UI it goes to ctx.ui.notify. Without
 * one (print/RPC/SDK modes, where notify is a no-op) warnings and errors go
 * to stderr with secrets scrubbed; info stays silent.
 */
export declare function notifyUser(sink: IssueSink | undefined, message: string, type?: "info" | "warning" | "error"): void;
/** Most recent first. */
export declare function recentIssues(): IssueRecord[];
export declare function formatRecentIssues(now?: number): string;
export declare function resetIssuesForTests(): void;
//# sourceMappingURL=issues.d.ts.map