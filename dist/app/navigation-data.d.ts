import type { AnchorPage, AnchorQuery, AnchorRecallPage, AnchorRecallQuery, AnchorRecord, AnchorState, NavigationSession } from "./navigation-types.ts";
export declare const NAVIGATION_TOOL_NAME = "smart_navigation";
/** Tool name used by pi-toolkit; its recorded anchors stay readable as session data. */
export declare const LEGACY_CONTEXT_TOOL_NAME = "context";
export declare const ANCHOR_CUSTOM_TYPE = "smart-context-anchor";
/** Anchor carried by an owned or legacy anchor tool result, or by a human anchor message. */
export declare function anchorFromMessage(message: unknown): AnchorState | null;
export declare function anchorFromEntry(entry: unknown): AnchorState | null;
/** Every anchor in the session, in entry order. */
export declare function getAnchors(sm: NavigationSession): AnchorRecord[];
/** On-branch anchors newest-first, then off-branch anchors newest-first. */
/** In-session lists show at most this many newest synthetic (compaction) anchors; older ones stay as data. */
export declare const SYNTHETIC_ANCHOR_VISIBLE_LIMIT = 2;
export declare function listAnchors(sm: NavigationSession, query?: AnchorQuery): AnchorPage;
/** Resolve an entry id, anchor name or label to the entry a pivot should land on. */
export declare function resolveAnchorTarget(sm: NavigationSession, target: string): string | null;
/**
 * Text Pi's navigateTree drops into an empty editor when landing on a user or
 * custom_message entry, so a pivot can clear exactly that and nothing else.
 */
export declare function getEditorInjectionFor(sm: NavigationSession, targetId: string): string;
/**
 * Search anchors across stored sessions. Only runs when called: no watcher, no
 * timer, no provider or database work. `cwd` scope (default) matches the
 * header cwd home-portably; sessions with an unknown cwd never match it.
 */
export declare function recallAnchors(options: AnchorRecallQuery & {
    sessionsDir: string;
    cwd: string;
}): Promise<AnchorRecallPage>;
//# sourceMappingURL=navigation-data.d.ts.map