import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { type ContextGraphScope } from "../infra/context-graph.ts";
export declare function resolveGraphScope(ctx: ExtensionContext): ContextGraphScope | null;
export declare function registerContextTools(pi: ExtensionAPI): void;
type ToolText = {
    type: "text";
    text: string;
};
type ToolResult = {
    content: ToolText[];
    details: unknown;
};
interface RecallParams {
    query: string;
    scope?: "project" | "session";
    kinds?: string[];
    limit?: number;
}
export declare function executeRecall(params: RecallParams, signal: AbortSignal | undefined, ctx: ExtensionContext): Promise<ToolResult>;
export {};
//# sourceMappingURL=register-context-tools.d.ts.map