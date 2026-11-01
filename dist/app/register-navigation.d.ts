import { type ExtensionAPI, type ExtensionCommandContext, type ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
import type { ContextEditKind } from "./host-cache-ledger.ts";
import type { NavigationPanelActions } from "./navigation-types.ts";
export interface NavigationController {
    isPending(ctx: ExtensionContext): boolean;
    refresh(ctx: ExtensionContext): void;
    panel(ctx: ExtensionCommandContext): NavigationPanelActions;
    handleCommand(args: string, ctx: ExtensionCommandContext): Promise<boolean>;
}
/** Navigation uses public Pi command dispatch, never patches ExtensionRunner. */
export declare function registerNavigation(pi: ExtensionAPI, options?: {
    config?: () => CompactConfig;
    mutationBlocked?: (ctx: ExtensionContext) => string | undefined;
    /** Anchor creation may request one safe consolidation, without invalidating prepared compaction. */
    onAnchor?: (ctx: ExtensionContext, originId: string, callId?: string, signal?: AbortSignal, userConfirmed?: boolean) => string;
    /** Staging-time signal: queued and about-to-apply pivots, never append-only anchors. */
    onContextChange?: (ctx: ExtensionContext) => void;
    /** Commit-time signal: fires only after Pi applied a pivot's tree navigation. */
    onContextEdit?: (ctx: ExtensionContext, kind: ContextEditKind) => void;
}): NavigationController;
//# sourceMappingURL=register-navigation.d.ts.map