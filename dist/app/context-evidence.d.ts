/** One bounded retrieval surface for native-history references, visual excerpts, and spill files. */
import type { SessionEntry } from "@earendil-works/pi-coding-agent";
import type { SecretScrubber } from "../domain/scrub.ts";
import type { LineageSession } from "./session-lineage.ts";
export declare const MAX_SEARCH_SOURCES = 32;
export declare const MAX_SEARCH_CHARS: number;
export declare const MAX_READ_CHARS = 4096;
interface EvidenceSource {
    id: string;
    kind: "session-output" | "visual-excerpt" | "tool-artifact";
    tool: string;
    source: string;
    chars: number;
    /** Session outputs only: whether a SHA-256 was recorded at archive time (checked on read/search). */
    hashed?: boolean;
    /** Parent-session sources only (`scope=lineage`): owning session id and handoff/fork depth. */
    session?: string;
    depth?: number;
}
/**
 * Active-branch evidence, then (with `lineage`, nearest-first) parent-session outputs and artifacts.
 * An id resolves in the nearest scope that owns it; visual excerpts stay active-branch only.
 */
export declare function contextEvidence(branch: SessionEntry[], sessionId: string, scrubber: SecretScrubber, lineage?: readonly LineageSession[]): {
    state: {
        checkpoint: import("./context-operations.ts").ContextCheckpoint | null;
        checkpointIndex: number;
        invalidReason: string | undefined;
        references: Set<string>;
        archives: Map<string, Omit<import("./context-operations.ts").ArchiveRecord, "id">>;
    };
    list: EvidenceSource[];
    read: (id: string) => Promise<string>;
    search: (query: string, offset: number, limit: number, id?: string) => Promise<{
        matches: {
            id: string;
            source: string;
            session?: string;
            matched: "text" | "source";
            line: number;
            offset: number;
            excerpt: string;
        }[];
        scanned: number;
        unavailable: string[];
        nextOffset: number | null;
    }>;
    origin: (id: string) => LineageSession | undefined;
    visualExcerpts: number | undefined;
};
/** Line reads are still character-capped; nextOffset can finish a single oversized line. */
export declare function evidencePage(text: string, offset: number, limit: number, line?: number): {
    text: string;
    nextOffset: number | null;
};
export {};
//# sourceMappingURL=context-evidence.d.ts.map