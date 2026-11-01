/**
 * Human session navigation: browse anchors, mark this point, search earlier
 * sessions, and return to an anchor after inspecting it.
 *
 * Every mutation (create, pivot) needs explicit input and an Enter on the
 * final step; Esc on any screen goes back one step and changes nothing. A
 * confirmed pivot runs after the panel has closed, so the session tree is
 * never navigated underneath an open overlay.
 */
import { ExtensionEditorComponent, type ExtensionCommandContext, type KeybindingsManager, type Theme } from "@earendil-works/pi-coding-agent";
import { type Component, type Focusable, type TUI } from "@earendil-works/pi-tui";
import type { NavigationPanelActions } from "../app/navigation-types.ts";
import { SmartSettingsList } from "./settings-list.ts";
/** Runs after the overlay has closed; showNavigationPanel awaits it. */
export type DeferredNavigation = () => Promise<void>;
export interface NavigationPanelEnv {
    close: (after?: DeferredNavigation) => void;
    requestRender: () => void;
    notify: (message: string, type: "info" | "error") => void;
    theme: Pick<Theme, "fg" | "bold">;
    /** Needed by Pi's multi-line editor used for summaries, carryover and messages. */
    tui: TUI;
    keybindings: KeybindingsManager;
}
export type Screen = Component & {
    focused?: boolean;
    /** Called when the screen leaves the stack (Esc, replacement or close). */
    dispose?: () => void;
    /** Called when the screen is on top again after the one above it closed. */
    reveal?: () => void;
};
export declare class ScreenStack implements Component, Focusable {
    private readonly header;
    private readonly onEmpty;
    private readonly requestRender;
    private readonly screens;
    private active;
    constructor(header: () => string[], onEmpty: () => void, requestRender: () => void);
    get focused(): boolean;
    set focused(value: boolean);
    private syncFocus;
    has(screen: Screen): boolean;
    push(screen: Screen): void;
    /** Close `screen` and everything opened from it. */
    pop(screen?: Screen | undefined): void;
    /** Swap an open screen in place (paging, finished loading). */
    replace(current: Screen, next: Screen): void;
    closeAll(): void;
    render(width: number): string[];
    handleInput(data: string): void;
    invalidate(): void;
}
/** Wrapped context lines above a list; input goes to the list. */
export declare class Framed implements Component {
    private readonly lines;
    private readonly body;
    constructor(lines: () => string[], body: SmartSettingsList);
    render(width: number): string[];
    handleInput(data: string): void;
    invalidate(): void;
}
/**
 * Multi-line field: Pi's own extension editor (the one behind ctx.ui.editor),
 * so Enter submits, the newline key (Shift+Enter / Ctrl+J) adds lines, Esc
 * goes back and Ctrl+G opens the external editor, with Pi's own key hints.
 * Pi's editor clears itself on submit; the field reopens it with the
 * submitted text so going back or a failed save never loses what was typed.
 */
export declare class TextArea implements Component, Focusable {
    private readonly open;
    private readonly submit;
    private editor;
    private readonly status;
    private busy;
    private active;
    constructor(open: (prefill: string, submit: (value: string) => void) => ExtensionEditorComponent, submit: (value: string, field: TextArea) => void);
    private reopen;
    get focused(): boolean;
    set focused(value: boolean);
    setStatus(text: string, busy?: boolean): void;
    render(width: number): string[];
    handleInput(data: string): void;
    invalidate(): void;
}
/**
 * Build the panel. Exported for tests; `showNavigationPanel` is the UI entry.
 * `env.close` receives the confirmed pivot, which must run after the overlay closes.
 */
export declare function createNavigationPanel(actions: NavigationPanelActions, env: NavigationPanelEnv): Component & Focusable;
/** Open the session navigation panel; a confirmed pivot runs after it closes. */
export declare function showNavigationPanel(ctx: ExtensionCommandContext, actions: NavigationPanelActions): Promise<void>;
//# sourceMappingURL=navigation-overlay.d.ts.map