/** Session-scoped pending compaction store with TTL and bounded memory. */
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { PendingCompaction, SessionMessageEntry } from "../types.ts";
import { type SessionIdentityContext } from "../infra/session-identity.ts";
export declare function fingerprintContext(messages: readonly SessionMessageEntry[]): NonNullable<PendingCompaction["contextSnapshot"]>;
/** Permit append-only growth, never branch changes or edits to the captured context. */
export declare function pendingMatchesBranch(pending: PendingCompaction, branch: readonly {
    id?: unknown;
}[]): boolean;
/** Capture before preparation starts, not after a possibly long-running provider call. */
export declare function readerSignature(ctx: Pick<ExtensionContext, "model"> & Partial<Pick<ExtensionContext, "getSystemPrompt">>): string | undefined;
/** Shared final gate for foreground and background candidates. Missing proof fails closed. */
export declare function revalidatePending(pending: PendingCompaction, ctx: ExtensionContext, reserveTokens?: number): PendingCompaction | null;
export type ConsumeResult = {
    kind: "ok";
    pending: PendingCompaction;
} | {
    kind: "empty";
} | {
    kind: "expired";
    ageMs: number;
} | {
    kind: "mismatch";
    expected: string;
    actual: string;
};
export interface PendingSlot {
    set(pending: PendingCompaction): void;
    consume(ctx: SessionIdentityContext): ConsumeResult;
    clear(sessionId?: string): void;
    isPresent(sessionId?: string): boolean;
    peek(sessionId?: string): Readonly<PendingCompaction> | null;
    size(): number;
}
export interface PendingSlotOptions {
    ttlMs: number | (() => number);
    /**
     * Optional ceiling (ms) past `ttlMs` for pendings the probe still certifies;
     * 0 or omitted keeps the plain TTL. The probe runs only at consume, never in
     * views: prune retains an unprobed entry until the ceiling, so `isPresent`
     * can be conservatively true for an entry that consume then expires.
     */
    maxAgeMs?: number | (() => number);
    /** Consume-time validity proof for the extended window (e.g. a live branch fingerprint). */
    stillFresh?: (pending: PendingCompaction, ctx: SessionIdentityContext) => boolean;
    now?: () => number;
    maxEntries?: number;
}
export declare function createPendingSlot(opts: PendingSlotOptions): PendingSlot;
//# sourceMappingURL=pending-slot.d.ts.map