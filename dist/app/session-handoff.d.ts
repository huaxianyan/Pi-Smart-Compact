/**
 * User-requested handoff into a new Pi session. The seed is assembled from
 * state Smart Compact already recorded (anchor, continuity ledger, pinned
 * paths, memory recall); no model writes it.
 */
import type { ExtensionCommandContext, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { SecretScrubber } from "../domain/scrub.ts";
import type { CompactConfig } from "../types.ts";
export interface HandoffSources {
    anchor?: {
        name: string;
        summary: string;
    };
    ledger?: string;
    pinPaths: string[];
    /** `query` is absent when nothing could be asked; `text` then says so. */
    recall?: {
        query?: string;
        text: string;
    };
    lineage: {
        sessionId: string;
        branchHeadId?: string;
        cwd: string;
        when: string;
    };
    note?: string;
}
export interface Handoff {
    name: string;
    content: string;
    summary: string;
}
/** Gather recorded state for a handoff; only `recall` may do I/O beyond local reads. */
export declare function collectHandoffSources(ctx: Pick<ExtensionContext, "cwd" | "sessionManager">, config: Pick<CompactConfig, "pinPaths">, options: {
    note?: string;
    recall: (query: string) => Promise<string>;
    when?: Date;
}): Promise<HandoffSources>;
/** Names of the sources that carry recorded content, in seed order. */
export declare function handoffSourceNames(sources: HandoffSources): string[];
/** Deterministic, scrubbed, bounded seed for the new session. */
export declare function buildHandoff(sources: HandoffSources, scrubber: SecretScrubber): Handoff;
export interface PreparedHandoff {
    sources: HandoffSources;
    handoff: Handoff;
    names: string[];
}
/** The memory search behind `smart_recall`, bounded for the seed. */
export declare function recallForHandoff(ctx: ExtensionContext): (query: string) => Promise<string>;
/** Collect once and build the seed; null when nothing was recorded and no note was given. */
export declare function prepareHandoff(ctx: Pick<ExtensionContext, "cwd" | "sessionManager">, note: string | undefined, recall: (query: string) => Promise<string>): Promise<PreparedHandoff | null>;
/** One-line summary of a prepared seed. */
export declare function handoffHeader(prepared: PreparedHandoff): string;
/** Open the new session seeded with `prepared`. Call only with no overlay open. */
export declare function openHandoff(ctx: ExtensionCommandContext, prepared: PreparedHandoff): Promise<void>;
/**
 * `/smart-compact handoff [dry-run] [-- note]`: open a new session seeded with
 * the handoff anchor, or with `dryRun` only show the seed.
 */
export declare function runHandoff(ctx: ExtensionCommandContext, note: string | undefined, options?: {
    dryRun?: boolean;
}): Promise<void>;
//# sourceMappingURL=session-handoff.d.ts.map