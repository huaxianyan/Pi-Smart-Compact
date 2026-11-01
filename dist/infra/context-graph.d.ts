import type { CompactionState } from "../types.ts";
export type ContextMemoryKind = "goal" | "decision" | "constraint" | "error" | "loop" | "next-action" | "critical" | "topic" | "file" | "preference" | "warning" | "procedure" | "context";
export interface ContextGraphScope {
    projectId: string;
    sessionId: string;
    branchHeadId?: string;
    branchEntryIds?: readonly string[];
}
export interface ContextRecallOptions {
    limit?: number;
    sessionOnly?: boolean;
    kinds?: readonly ContextMemoryKind[];
}
export interface ContextRecallResult {
    id: string;
    kind: ContextMemoryKind;
    title: string;
    content: string;
    relatedPaths: string[];
    score: number;
    source: "compaction" | "manual";
    sameSession: boolean;
    sameBranch: boolean;
    updatedAt: number;
}
export interface SavedContextMemory {
    id: string;
    kind: Extract<ContextMemoryKind, "decision" | "constraint" | "preference" | "warning" | "procedure" | "context">;
    title: string;
    content: string;
    relatedPaths?: string[];
}
export interface ContextGraphStats {
    totalNodes: number;
    activeNodes: number;
    sessions: number;
    lastUpdatedAt: number | null;
}
/** Persist a scoped compaction state into the project context graph. Best-effort. */
export declare function indexCompactionState(projectId: string, state: CompactionState): boolean;
/**
 * Queue an apply-confirmed state and resolve only after the SQLite transaction
 * succeeds or fails. Duplicate updates coalesce per branch head; every caller
 * observes the result of the latest queued state.
 */
export declare function scheduleCompactionStateIndex(projectId: string, state: CompactionState): Promise<boolean>;
/** Test seam; production drains in a microtask. */
export declare function flushCompactionStateIndexes(): void;
export interface ClosedContextMemory {
    closed: number;
    kind: string;
    title: string;
}
/** Look up one explicit memory by its stable ref id, within one project. */
export declare function getContextMemoryByRef(projectId: string, id: string): {
    kind: string;
    title: string;
    content: string;
    relatedPaths: string[];
} | null;
/**
 * Resolve an explicit memory by its stable ref id within one project. The id
 * is a hash of project, kind and fact key, so a ref from another project
 * simply matches nothing here.
 */
export declare function closeContextMemoryByRef(projectId: string, id: string): ClosedContextMemory | null;
/** Stable identity of an explicit memory; matches the id saveContextMemory assigns. */
export declare function manualMemoryId(projectId: string, kind: SavedContextMemory["kind"], content: string): string;
/** Save one explicit, user-confirmed project memory. */
export declare function saveContextMemory(scope: ContextGraphScope, memory: Omit<SavedContextMemory, "id">): SavedContextMemory;
/** Weighted project recall: lexical seeds + one-hop file relationships + scope/recency boosts. */
export declare function recallContext(scope: ContextGraphScope, query: string, options?: ContextRecallOptions): ContextRecallResult[];
export declare function formatRecallResults(results: ContextRecallResult[], maxChars?: number): string;
export declare function getContextGraphStats(projectId: string): ContextGraphStats;
/** Node counts by provenance for the /forget choice. */
export interface ContextGraphMemoryCounts {
    manual: number;
    derived: number;
    unknown: number;
}
export declare function getContextGraphMemoryCounts(projectId: string): ContextGraphMemoryCounts;
/** What a scoped forget deletes. */
export type ForgetGraphScope = "all" | "derived-only";
/**
 * Permanently forget graph memory for a project (#63). Drains any queued
 * index writes first so a scheduled compaction cannot resurrect the memory
 * afterwards. Compaction state files (restore data) and backups are left
 * intact, and no other store (Mnemopi, Hindsight) is ever touched.
 *
 * `derived-only` deletes just the compaction-derived nodes (including their
 * session/file infrastructure) with their FTS copies and edges; user-confirmed
 * memories and unknown-provenance rows are preserved.
 */
export declare function forgetProjectGraph(projectId: string, scope?: ForgetGraphScope): boolean;
//# sourceMappingURL=context-graph.d.ts.map