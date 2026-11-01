/**
 * Minimal Hindsight HTTP client for Smart Compact's confirmed memory path.
 *
 * Deliberately exposes only four fixed bank-scoped routes (retain, operation
 * status, recall, delete one document). There is no generic request method, so
 * destructive bank-wide routes such as `DELETE /memories` are unreachable.
 */
export interface HindsightTarget {
    /** Normalized origin plus optional path prefix, without trailing slash. */
    baseUrl: string;
    bankId: string;
    /** Bearer token value; never persisted or rendered. */
    apiKey?: string;
    timeoutMs: number;
}
export type HindsightErrorKind = "config" | "aborted" | "timeout" | "network" | "unauthorized" | "not-found" | "conflict" | "http" | "invalid-response";
export declare class HindsightError extends Error {
    readonly kind: HindsightErrorKind;
    readonly status?: number;
    constructor(kind: HindsightErrorKind, message: string, status?: number);
    /** True when the server may or may not have received the request. */
    get outcomeUnknown(): boolean;
}
export type HindsightOperationStatus = "pending" | "processing" | "completed" | "failed" | "cancelled" | "not_found";
export interface HindsightRetainItem {
    content: string;
    documentId: string;
    context?: string;
    tags: string[];
    metadata: Record<string, string>;
}
export interface HindsightRecallFact {
    id: string;
    text: string;
    type: string | null;
    documentId: string | null;
    tags: string[];
    metadata: Record<string, string>;
    mentionedAt: string | null;
}
/**
 * Validate and normalize a configured base URL. HTTPS is required except for
 * loopback development servers; credentials, query and fragment are refused.
 */
export declare function normalizeHindsightBaseUrl(raw: unknown): string;
export declare function isValidHindsightBankId(value: unknown): value is string;
/** Display-safe destination label (origin + bank), never includes secrets. */
export declare function describeHindsightTarget(target: HindsightTarget): string;
/**
 * Submit one asynchronous retain. The caller-supplied operation id makes
 * retries of the same submission idempotent on the server. Acceptance is not
 * completion: extracted facts are not searchable until the operation completes.
 */
export declare function retainDocument(target: HindsightTarget, item: HindsightRetainItem, operationId: string, signal?: AbortSignal): Promise<{
    operationId: string;
}>;
export declare function getOperationStatus(target: HindsightTarget, operationId: string, signal?: AbortSignal): Promise<{
    status: HindsightOperationStatus;
    failed: boolean;
}>;
export interface HindsightRecallRequest {
    query: string;
    tags: string[];
    maxTokens: number;
}
/** Bounded, strictly tag-scoped recall. No reflect, chunks or source facts. */
export declare function recallFacts(target: HindsightTarget, request: HindsightRecallRequest, signal?: AbortSignal): Promise<HindsightRecallFact[]>;
/** Delete exactly one owned document. A missing document is reported, not thrown. */
export declare function deleteDocument(target: HindsightTarget, documentId: string, signal?: AbortSignal): Promise<{
    found: boolean;
    memoryUnitsDeleted: number;
}>;
//# sourceMappingURL=hindsight-client.d.ts.map