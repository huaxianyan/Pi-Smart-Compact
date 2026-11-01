import type { Api, Model, Usage } from "@earendil-works/pi-ai";
import type { MetricsSnapshot } from "../types.ts";
export type RouteModelResolver = (provider: string, model: string) => Model<Api> | undefined;
/**
 * Provider-reported usage of one compaction run in Pi's `Usage` shape, so a
 * `session_before_compact` result can carry it into Pi's session totals.
 *
 * Tokens come from the run's per-route metrics (or the run totals when no
 * route rows exist). Cost uses the catalog rates of each route's model, the
 * way Pi prices its own requests; an unresolvable model contributes tokens
 * but no cost. Returns undefined when the run made no provider call or when
 * any route's usage was estimated rather than reported: Pi's totals must not
 * mix local estimates with provider counts.
 */
export declare function compactionUsage(snapshot: Pick<MetricsSnapshot, "totalCalls" | "totalInput" | "totalOutput" | "totalCacheHit" | "totalCacheWrite" | "providerRoutes" | "provider" | "model">, resolveModel: RouteModelResolver): Usage | undefined;
//# sourceMappingURL=compaction-usage.d.ts.map