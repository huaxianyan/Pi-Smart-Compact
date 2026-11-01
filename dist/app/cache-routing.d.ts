/**
 * Cache routing-key injection (I).
 *
 * OpenAI documents `prompt_cache_key` as a stickiness aid: requests sharing a
 * prefix and key are routed to the same inference engine, which is what makes
 * implicit caching actually hit under multi-session load (OpenAI measured
 * 60%→87% hit rate for one coding customer). The key is derived from the
 * session id, so one conversation keeps landing on one engine while unrelated
 * sessions spread out.
 *
 * Constraints honored here:
 *  - Opt-in via `promptCacheRoutingEnabled` (default off): unknown request
 *    fields can be rejected by strict gateways, so the user chooses.
 *  - Provider-gated through the caps matrix: only providers whose documented
 *    routing key is a body field are stamped; header keys (xAI
 *    `x-grok-conv-id`) are not reachable from a payload hook and stay
 *    informational.
 *  - OpenAI-shaped payloads only (`messages` or `input` arrays, not the
 *    Anthropic block shape), never overriding an existing key, never for
 *    unresolved sessions whose per-call identity cannot pin a route.
 *  - In-place mutation, always returns undefined: `before_provider_request`
 *    handlers chain independently and must not fight over the returned
 *    payload.
 */
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
export type RoutingContext = Pick<ExtensionContext, "sessionManager" | "model">;
export declare function applyCacheRoutingKey(payload: unknown, ctx: RoutingContext, enabled: () => boolean): undefined;
//# sourceMappingURL=cache-routing.d.ts.map