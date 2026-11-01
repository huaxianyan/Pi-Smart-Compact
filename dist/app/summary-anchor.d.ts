/** Summary pseudo-anchor (C): the compaction summary as a recall surface and pivot target. */
import type { AnchorState } from "./navigation-types.ts";
import { ANCHOR_CUSTOM_TYPE } from "./navigation-data.ts";
interface SummaryAnchorSession {
    getLeafId(): string | null;
    getEntries(): unknown[];
}
export interface SummaryAnchorEntry {
    customType: typeof ANCHOR_CUSTOM_TYPE;
    content: string;
    display: boolean;
    details: {
        anchor: AnchorState;
    };
}
/**
 * Build a synthetic anchor for a committed compaction summary.
 *
 * Best-effort bookkeeping: without a leaf, nothing is written and nothing
 * throws — callers run this inside post-apply bookkeeping that must not fail
 * the commit path. The anchor targets the post-compaction leaf so pivots land
 * on the summary boundary; `synthetic: true` lets list views keep only the
 * newest few visible. Value = recall surface + pivot target.
 *
 * Compaction summaries can repeat their first line, so a name collision gets
 * a numbered suffix instead of dropping the anchor: the second compaction
 * keeps its recall surface.
 */
export declare function buildSummaryAnchor(sm: SummaryAnchorSession, details: {
    summary: string;
}): SummaryAnchorEntry | null;
export {};
//# sourceMappingURL=summary-anchor.d.ts.map