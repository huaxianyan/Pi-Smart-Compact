import type { PendingCompaction } from "../types.ts";
/**
 * "foreign": another compaction (Pi's own or another extension's) was applied while this candidate waited.
 * "session-mismatch": the run was confirmed for a different session; the candidate can never commit.
 */
export type CommitDiscardReason = "expired" | "evicted" | "aborted" | "shutdown" | "apply-error" | "foreign" | "session-mismatch";
export interface CompactionCommitStore {
    stage(pending: PendingCompaction): void;
    take(runId: string, sessionId: string): PendingCompaction | null;
    discard(runId: string, reason: CommitDiscardReason): PendingCompaction | null;
    clearSession(sessionId: string, reason?: CommitDiscardReason): PendingCompaction[];
    size(): number;
}
/**
 * Holds summaries only between session_before_compact and session_compact.
 * Nothing durable is written until `take()` confirms both run and session.
 */
export declare function createCompactionCommitStore(options?: {
    ttlMs?: number | (() => number);
    maxEntries?: number;
    onDiscard?: (pending: PendingCompaction, reason: CommitDiscardReason) => void;
}): CompactionCommitStore;
//# sourceMappingURL=compaction-commit-store.d.ts.map