import { type ExtensionContext, type SessionEntry } from "@earendil-works/pi-coding-agent";
export interface LineageSession {
    sessionId: string;
    file: string;
    branch: SessionEntry[];
    depth: number;
}
/**
 * Parent sessions nearest-first. The walk stops at a missing, unreadable, oversized,
 * header-less or already-seen file, and after `maxDepth` levels.
 */
export declare function loadLineage(ctx: Pick<ExtensionContext, "sessionManager">, options?: {
    maxDepth?: number;
    maxBytes?: number;
    signal?: AbortSignal;
}): Promise<LineageSession[]>;
//# sourceMappingURL=session-lineage.d.ts.map