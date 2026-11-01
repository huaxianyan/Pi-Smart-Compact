/**
 * LLM client seam.
 *
 * Production requests go through the requesting session's public model
 * runtime (`ctx.modelRegistry`), never pi-ai's standalone completers: only the
 * session runtime applies request-time auth, OAuth and extension provider
 * overrides registered with `pi.registerProvider` (e.g. a subscription
 * adapter that owns final payload normalization). Clients are built per run
 * from that runtime, so one session can never route through another's.
 *
 * Test fakes need to assert which `phase` was used, control failures, and
 * return synthetic usage tokens, so `setLlmClient` installs a process-wide
 * test override that takes precedence over every run's runtime client.
 *
 * The interface is intentionally narrow: a single `complete()` method matching
 * the pi-ai shape, plus the same options object existing callers already pass.
 * Provider-specific `stream()` keeps existing calls; `streamSimple()` is used
 * when generic reasoning is explicitly configured.
 */
import type { Model, Api, AssistantMessage, AssistantMessageEventStream, Context, ProviderStreamOptions, SimpleStreamOptions } from "@earendil-works/pi-ai";
export type LlmCompleteOptions = SimpleStreamOptions & {
    codexWatchdogMs?: number;
};
/** The public session model runtime slice used for requests (`ctx.modelRegistry`). */
export interface LlmModelRuntime {
    stream(model: Model<Api>, context: Context, options?: ProviderStreamOptions): AssistantMessageEventStream;
    streamSimple(model: Model<Api>, context: Context, options?: SimpleStreamOptions): AssistantMessageEventStream;
}
/** `ctx.modelRegistry.isUsingOAuth(model)`, false when unavailable or throwing. */
export declare function usesOAuth(ctx: {
    modelRegistry?: unknown;
}, model: Model<Api>): boolean;
export interface LlmClient {
    complete(model: Model<Api>, body: Context, opts: LlmCompleteOptions): Promise<AssistantMessage>;
}
export declare function isChatGptCodex(model: Model<Api>): boolean;
/** ChatGPT rejects wire token caps; OpenAI-compatible custom Codex endpoints may accept them. */
export declare function withCodexWireLimit(model: Model<Api>, opts: LlmCompleteOptions): LlmCompleteOptions;
/**
 * MiniMax-M3 thinks only when asked, and its enabled thinking ignores
 * budget_tokens while counting toward max_tokens, so a "minimal" request
 * ends at max_tokens without text. Omitting thinking is its real minimum.
 */
export declare function withMinimalThinkingWire(model: Model<Api>, opts: LlmCompleteOptions): LlmCompleteOptions;
export declare function resolveCodexWatchdogMs(maxTokens: number | undefined, configuredMs?: number): number;
export declare function resolveProviderWatchdogMs(provider: string | undefined, maxTokens: number | undefined, configuredMs?: number): number;
/** @internal Test seam for the transport deadline used by every provider. */
export declare function withProviderDeadline(opts: LlmCompleteOptions, invoke: (bounded: LlmCompleteOptions) => Promise<AssistantMessage>, provider?: string): Promise<AssistantMessage>;
/** Client for one session runtime — maps generic reasoning only when explicitly configured. */
export declare function createModelRuntimeLlmClient(runtime: LlmModelRuntime): LlmClient;
/** The test/wrapping override, resolved at call time; undefined in production. */
export declare function getLlmClient(): LlmClient | undefined;
export declare function setLlmClient(client: LlmClient): void;
/** Remove the override. Tests should always pair `setLlmClient` with this. */
export declare function resetLlmClient(): void;
//# sourceMappingURL=llm-client.d.ts.map