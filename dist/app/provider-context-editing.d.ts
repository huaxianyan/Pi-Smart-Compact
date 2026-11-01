/**
 * Provider-native context editing for direct Anthropic sessions.
 *
 * Signed Anthropic thinking binds everything sent before it, so local trims cannot
 * edit that history. The Messages API can instead clear old tool results (and,
 * optionally, old thinking) server-side before the prompt reaches the model, while
 * the client history stays unchanged:
 * https://platform.claude.com/docs/en/build-with-claude/context-editing
 */
import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
export declare const CONTEXT_MANAGEMENT_BETA = "context-management-2025-06-27";
export type ProviderContextEditing = CompactConfig["providerContextEditing"];
type EditingConfig = Pick<CompactConfig, "providerContextEditing" | "minContextPercent" | "prepareContextPercent" | "maxContextTokens">;
export declare function contextManagementEdits(level: Exclude<ProviderContextEditing, "off">, toolNames: string[], triggerTokens: number | null): Record<string, unknown>[];
/**
 * Adds `context_management` and its beta to the session model's own request, in place.
 * Summarizer routes, other providers and payloads that already carry context management
 * are left untouched; the beta travels in the same payload, so it never reaches another request.
 */
export declare function applyProviderContextEditing(payload: unknown, ctx: Pick<ExtensionContext, "model" | "getContextUsage">, config: EditingConfig): void;
export declare function registerProviderContextEditing(pi: Pick<ExtensionAPI, "on">, deps: {
    config: () => EditingConfig;
}): void;
export {};
//# sourceMappingURL=provider-context-editing.d.ts.map