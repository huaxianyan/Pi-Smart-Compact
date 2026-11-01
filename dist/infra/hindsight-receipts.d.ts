export type HindsightReceiptState = 
/** Request sent, no response yet (process died mid-flight). */
"submitted"
/** Server acknowledged the async operation; extraction not yet complete. */
 | "accepted"
/** Operation completed; facts are searchable. */
 | "completed"
/** Server reported failure/cancellation, or refused the request. */
 | "failed"
/** Transport failure: the server may or may not have accepted it. */
 | "unknown"
/** The owned document was deleted by a confirmed resolve. */
 | "deleted";
export interface HindsightReceipt {
    key: string;
    baseUrl: string;
    bankId: string;
    projectId: string;
    documentId: string;
    revision: string;
    operationId: string;
    /** Operation id the server acknowledged, when it differs from `operationId`. */
    serverOperationId?: string;
    kind: string;
    title: string;
    state: HindsightReceiptState;
    createdAt: number;
    updatedAt: number;
    /** Short, secret-free failure reason. */
    detail?: string;
}
export interface HindsightReceiptScope {
    baseUrl: string;
    bankId: string;
    projectId: string;
}
export declare const MAX_HINDSIGHT_RECEIPTS = 500;
/** An operation missing server-side this long is treated as failed so the ledger drains. */
export declare const NOT_FOUND_DRAIN_HOURS = 24;
export declare function isOpenReceipt(receipt: HindsightReceipt): boolean;
export declare function hindsightReceiptsFile(): string;
export declare function receiptKey(scope: HindsightReceiptScope, documentId: string, revision: string): string;
/**
 * Deterministic UUID-shaped operation id for one submission, so a retry of the
 * same confirmed save is idempotent server-side and never double-retains.
 */
export declare function operationIdFor(scope: HindsightReceiptScope, documentId: string, revision: string): string;
/**
 * A present but unreadable ledger is never treated as empty: that would let a
 * resolve delete a document with in-flight retains, and the next save would
 * overwrite the evidence. Callers refuse instead; the file is left untouched.
 */
export declare class ReceiptLedgerUnreadableError extends Error {
    constructor(file: string, detail: string);
}
export declare function listReceipts(scope: HindsightReceiptScope, documentId?: string, file?: string): HindsightReceipt[];
/** Every receipt in the ledger, across scopes; for orphan-target draining. */
export declare function listAllReceipts(file?: string): HindsightReceipt[];
export declare class ReceiptLedgerFullError extends Error {
    constructor(file?: string);
}
/**
 * Insert or update one receipt. Terminal receipts are pruned oldest-first when
 * the cap is reached; open receipts are never evicted — the write is refused.
 */
export declare function upsertReceipt(receipt: HindsightReceipt, file?: string): HindsightReceipt;
export declare function updateReceiptState(key: string, state: HindsightReceiptState, detail?: string, extra?: Pick<HindsightReceipt, "serverOperationId"> & {
    onlyIfOpen?: boolean;
}, file?: string): HindsightReceipt | null;
/** Capacity check before a remote submission, without writing. */
export declare function receiptCapacityAvailable(file?: string): boolean;
//# sourceMappingURL=hindsight-receipts.d.ts.map