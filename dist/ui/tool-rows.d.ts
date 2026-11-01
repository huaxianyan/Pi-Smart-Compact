/**
 * Shared, PURE rendering helpers for the Smart Compact tool rows.
 *
 * Every function here is synchronous, side-effect free, and reads nothing
 * but its arguments: a tool row is a call-time snapshot and must never
 * trigger implicit polling, filesystem reads, or network requests. Missing
 * or malformed details degrade to a visible raw-text fallback — never to a
 * generic success row — and control characters are sanitized before any
 * text reaches the terminal.
 */
import { Text } from "@earendil-works/pi-tui";
import { type Theme } from "@earendil-works/pi-coding-agent";
/** Honest terminal states; each maps to a semantic theme color AND a word,
 * so status never rides on color alone. */
export type RowStatus = "done" | "queued" | "pending" | "failed" | "cancelled" | "skipped" | "info";
/** Terminal-safe text: strip ANSI/VT sequences with the platform utility
    * first, then remove remaining C0/C1 control characters. Only ever applied
    * to RAW text — never to strings already carrying theme markup. */
export declare function sanitizeVisible(text: string): string;
/** First text part of a tool result's model content, sanitized; empty when
 * the content carries none. */
export declare function firstTextContent(content: ReadonlyArray<{
    type: string;
    text?: string;
}> | undefined): string;
/** Single-line preview of a possibly long text. */
export declare function summarizeLine(text: string, maxLength?: number): string;
export declare function statusLabel(theme: Theme, status: RowStatus): string;
/** `key: value` line with a dimmed key. */
export declare function metaLine(theme: Theme, key: string, value: string): string;
/** Bounded, expansion-aware preview block. Collapsed shows at most
    * `maxCollapsed` lines, each char-clipped, with an overflow marker; expanded
    * shows EVERY line in full. */
export declare function previewBlock(lines: readonly string[], expanded: boolean, maxCollapsed: number, maxLength?: number): string[];
/** All text parts of model content, sanitized, in order. */
export declare function allTextParts(content: ReadonlyArray<{
    type: string;
    text?: string;
}> | undefined): string[];
/** Type-guarded, sanitized, bounded argument string for call rows:
 * undefined/null/missing fields render as EMPTY (skipped), never the
 * literal "undefined", and hostile control sequences never survive into
 * theme output. */
export declare function safeArg(value: unknown, maxLength?: number): string;
/** Native expansion hint using the CONFIGURED keybinding (never a
 * hard-coded key); degrades to plain guidance when bindings are
 * unavailable. Pure display — no state, no polling. */
export declare function expandHint(theme: Theme): string;
/** Expanded rows never truncate: the status summary first, then the FULL
 * original model content — every tool, every state. Bounded previews are a
 * collapsed-only concern. */
export declare function expandedRow(theme: Theme, result: {
    content?: ReadonlyArray<{
        type: string;
        text?: string;
    }>;
}, summaryLines: readonly string[]): Text;
/** The raw-text fallback row: model content shown sanitized, never a
 * fabricated success. Collapsed shows a bounded prefix with an expansion
 * marker; expanded preserves ALL text parts in full — a truncated tail
 * would hide end-of-content identity like Ref lines. */
export declare function rawFallbackRow(theme: Theme, result: {
    content?: ReadonlyArray<{
        type: string;
        text?: string;
    }>;
}, expanded: boolean): Text;
/** Rendering must never break the row: any renderer defect degrades to the
    * visible raw fallback instead of throwing inside the TUI. */
export declare function tryRow(theme: Theme, build: () => Text, result: {
    content?: ReadonlyArray<{
        type: string;
        text?: string;
    }>;
}, expanded: boolean): Text;
//# sourceMappingURL=tool-rows.d.ts.map