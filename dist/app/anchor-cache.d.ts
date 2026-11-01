/**
 * Anthropic prompt-cache breakpoint on the newest context anchor.
 *
 * Adapted from pi-toolkit's auto-context anchor-cache (MIT License,
 * Copyright (c) 2025 Ersin Tarhan).
 *
 * Pi places one rolling `cache_control` marker on the last user block. This
 * hook moves every message-level marker before the newest on-branch anchor
 * onto that anchor's block (smart_navigation / recorded `context` tool result,
 * or a human `smart-context-anchor` custom message), so the prefix up to the
 * anchor stays readable while later turns churn. Layout, at most four markers:
 *
 *   [system, tools, LAST_ANCHOR, rolling tail]
 *
 * Transition bridge: on the first request after a new anchor N (no assistant
 * reply after N yet) N's prefix has never been written. The previous anchor M
 * keeps a marker too, [system, tools, M, N], so the prefix through M is read
 * and only (M, N] is written. The bridge uses a free slot or displaces a
 * redundant foreign marker (see `evictable`); it never displaces the rolling
 * tail, which is what advances the cache every turn (pi-ai's OAuth layout
 * already carries four markers: identity, system prompt, tools, tail).
 *
 * TTL follows the payload: a `1h` marker (Pi long retention) makes the anchor
 * `1h` and rolling markers after it `5m`; otherwise markers stay default.
 * Nothing happens without an existing rolling message marker (retention
 * `none` emits none) or when the anchor is not in the projected history
 * (e.g. summarized away); such payloads are left byte-identical, which keeps
 * native compaction replay exact. Marker ownership lives in a WeakMap, never
 * on the wire.
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
type AnchorCacheConfig = Pick<CompactConfig, "contextNavigationEnabled" | "contextAnchorCacheEnabled">;
export declare function registerAnchorCache(pi: Pick<ExtensionAPI, "on">, deps: {
    config: () => AnchorCacheConfig;
}): void;
export {};
//# sourceMappingURL=anchor-cache.d.ts.map