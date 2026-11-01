import type { CompactConfig } from "../types.ts";
import { type HindsightRecallFact, type HindsightTarget } from "../infra/hindsight-client.ts";
import { type HindsightReceipt, type HindsightReceiptScope } from "../infra/hindsight-receipts.ts";
export declare const HINDSIGHT_SOURCE_TAG = "psc-source:smart-compact";
export type ConfiguredHindsightTargetResolution = {
    enabled: true;
    ok: true;
    target: HindsightTarget;
} | {
    enabled: true;
    ok: false;
    reason: string;
};
export type HindsightConfigResolution = {
    enabled: false;
} | ConfiguredHindsightTargetResolution;
/** Resolve the configured target. The API key is read from the named env var only. */
export declare function resolveHindsightTarget(config: Pick<CompactConfig, "memoryBackend" | "hindsightBaseUrl" | "hindsightBankId" | "hindsightApiKeyEnv" | "hindsightTimeoutMs">, env?: Record<string, string | undefined>): HindsightConfigResolution;
/**
 * Target for dispatching a hindsight memory ref, regardless of the currently
 * active backend: a ref from an older save must reach the server that holds
 * it instead of silently retargeting. The target still comes only from
 * current configuration — never from the ref itself.
 */
export declare function resolveHindsightRefTarget(config: Pick<CompactConfig, "memoryBackend" | "hindsightBaseUrl" | "hindsightBankId" | "hindsightApiKeyEnv" | "hindsightTimeoutMs">, env?: Record<string, string | undefined>): ConfiguredHindsightTargetResolution;
export declare function projectTag(projectId: string): string;
/** Stable remote document id for one explicit local memory identity. */
export declare function hindsightDocumentId(memoryId: string): string;
export declare function receiptScope(target: HindsightTarget, projectId: string): HindsightReceiptScope;
export interface HindsightMemoryInput {
    projectId: string;
    memoryId: string;
    kind: string;
    title: string;
    content: string;
    relatedPaths: string[];
}
/** Exact text sent to the server; shown verbatim in the confirmation. */
export declare function hindsightRetainContent(memory: HindsightMemoryInput): string;
export type RemoteSaveOutcome = {
    state: "completed";
    receipt: HindsightReceipt;
} | {
    state: "accepted";
    receipt: HindsightReceipt;
    operationStatus: string;
} | {
    state: "failed";
    receipt?: HindsightReceipt;
    reason: string;
} | {
    state: "unknown";
    receipt: HindsightReceipt;
    reason: string;
};
export declare function refreshReceipt(target: HindsightTarget, receipt: HindsightReceipt, signal?: AbortSignal, drainNotFound?: boolean): Promise<HindsightReceipt>;
/** Submit one confirmed memory. Never retried automatically beyond one request. */
export declare function saveHindsightMemory(target: HindsightTarget, memory: HindsightMemoryInput, signal?: AbortSignal, resubmitAfterFailure?: boolean): Promise<RemoteSaveOutcome>;
export type RemoteResolveOutcome = {
    state: "deleted";
    documentId: string;
    memoryUnitsDeleted: number;
    ledgerWarning?: string;
} | {
    state: "not-found";
    documentId: string;
    ledgerWarning?: string;
} | {
    state: "pending";
    documentId: string;
    operationIds: string[];
} | {
    state: "failed";
    documentId: string;
    reason: string;
};
/**
 * Delete the owned remote document for one memory. Refuses while a retain for
 * it may still be extracting, so async completion cannot recreate the fact.
 */
export declare function resolveHindsightMemory(target: HindsightTarget, projectId: string, memoryId: string, signal?: AbortSignal): Promise<RemoteResolveOutcome>;
/**
 * Refresh a few open receipts for this scope (called from recall). Unknown
 * receipts count as open — they can fill the ledger cap — so they share the
 * same bounded refresh; a terminal server status frees them, and so does an
 * operation the server has reported missing for NOT_FOUND_DRAIN_HOURS.
 */
export declare function refreshPendingReceipts(target: HindsightTarget, projectId: string, signal?: AbortSignal): Promise<HindsightReceipt[]>;
export type RemoteRecallOutcome = {
    state: "ok";
    facts: HindsightRecallFact[];
} | {
    state: "failed";
    reason: string;
};
export declare function recallHindsightMemory(target: HindsightTarget, projectId: string, query: string, maxTokens: number, signal?: AbortSignal): Promise<RemoteRecallOutcome>;
/** Bounded untrusted-evidence rendering with provenance. */
export declare function formatHindsightFacts(target: HindsightTarget, projectId: string, facts: HindsightRecallFact[], maxChars?: number): string;
export declare function describeRemoteSave(outcome: RemoteSaveOutcome): string;
export declare function describeRemoteResolve(outcome: RemoteResolveOutcome): string;
//# sourceMappingURL=hindsight-memory.d.ts.map