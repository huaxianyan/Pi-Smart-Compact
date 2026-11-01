/**
 * Hand off to a new session from Home: note → preview → confirm. Nothing
 * opens until the last step; the session opens after the overlay has closed.
 */
import { type ExtensionCommandContext, type KeybindingsManager, type Theme } from "@earendil-works/pi-coding-agent";
import type { Component, Focusable, TUI } from "@earendil-works/pi-tui";
import { type PreparedHandoff } from "../app/session-handoff.ts";
export interface HandoffPanelEnv {
    /** Receives the confirmed handoff; undefined when the user backed out. */
    close: (prepared?: PreparedHandoff) => void;
    requestRender: () => void;
    theme: Pick<Theme, "fg" | "bold">;
    tui: TUI;
    keybindings: KeybindingsManager;
}
/** `prepare` starts at the note field; `preview` shows a ready seed read-only (dry-run). */
export type HandoffPanelSource = {
    prepare: (note: string | undefined) => Promise<PreparedHandoff | null>;
} | {
    preview: PreparedHandoff;
};
/** Build the panel. Exported for tests; `showHandoffPanel` is the UI entry. */
export declare function createHandoffPanel(source: HandoffPanelSource, env: HandoffPanelEnv): Component & Focusable;
/** Open the handoff panel; resolves with the confirmed handoff, which the caller opens after the overlay closed. */
export declare function showHandoffPanel(ctx: ExtensionCommandContext, source: HandoffPanelSource): Promise<PreparedHandoff | undefined>;
//# sourceMappingURL=handoff-overlay.d.ts.map