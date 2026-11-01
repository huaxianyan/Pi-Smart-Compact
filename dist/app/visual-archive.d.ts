import type { Api, Model } from "@earendil-works/pi-ai";
import { type ContextEvent, type ExtensionContext, type SessionEntry } from "@earendil-works/pi-coding-agent";
import { SecretScrubber } from "../domain/scrub.ts";
import type { SessionMessageEntry, VisualArchive } from "../types.ts";
export declare const VISUAL_CONTEXT_TYPE = "smart-compact-visual-evidence";
export declare const VISUAL_MAX_SOURCE_CHARS = 24000;
export declare function canReadVisual(model: Pick<Model<Api>, "input" | "api"> | undefined): boolean;
/** Planning only, not billed savings. Expand supported models after validating their image rules. */
export declare function visualEconomics(reader: VisualArchive["reader"], sources: VisualArchive["sources"], frames: Array<{
    width: number;
    height: number;
}>, estimateText?: (text: string) => number): {
    textTokens: number;
    imageTokens: number | null;
    worthwhile: boolean;
};
export declare function visualSourceLines(source: VisualArchive["sources"][number]): string[];
export declare function visualPages(sources: VisualArchive["sources"]): string[][];
/** Validate persisted data before it can become model input or a retrieval result. */
export declare function validVisualArchive(value: unknown): value is VisualArchive;
export declare function activeVisualArchive(branch: readonly SessionEntry[]): {
    entry: import("@earendil-works/pi-coding-agent").CompactionEntry<unknown>;
    archive: VisualArchive;
} | null;
/** Prefer recent evidence; carry bounded source text across generations without OCR. */
export declare function selectVisualSources(branch: SessionEntry[], toCompact: SessionMessageEntry[], summary: string, scrubber: SecretScrubber): VisualArchive["sources"];
/** Append image evidence beside, not instead of, the exact summary in this request. */
export declare function injectVisualArchive(messages: ContextEvent["messages"], branch: SessionEntry[], ctx: Pick<ExtensionContext, "model" | "getContextUsage">, enabled: boolean, scrubber?: SecretScrubber): ContextEvent["messages"];
//# sourceMappingURL=visual-archive.d.ts.map