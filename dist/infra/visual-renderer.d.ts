import type { VisualArchive } from "../types.ts";
export declare const VISUAL_WIDTH = 1280;
export declare const VISUAL_COLUMNS = 138;
export declare const VISUAL_ROWS = 74;
export declare const VISUAL_MAX_FRAMES = 2;
export declare const VISUAL_MAX_BYTES = 1000000;
export declare const VISUAL_MIN_WIDTH = 256;
/** Crop whitespace, not glyph size. Nine pixels safely covers the bundled 14px mono font. */
export declare function visualPageSize(lines: readonly string[]): {
    width: number;
    height: number;
};
/** Conservative request-planning allowance, not measured provider billing. */
export declare function estimateVisualTokens(width: number, height: number): number;
export declare function renderVisualPages(pages: string[][], signal: AbortSignal): Promise<VisualArchive["frames"]>;
//# sourceMappingURL=visual-renderer.d.ts.map