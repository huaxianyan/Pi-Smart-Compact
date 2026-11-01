import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
declare const GROUPS: {
    readonly navigation: readonly ["smart_navigation"];
    readonly history: readonly ["smart_context"];
    readonly memory: readonly ["smart_recall", "smart_save_memory"];
    readonly compaction: readonly ["smart_compact"];
};
export type ContextToolGroup = keyof typeof GROUPS;
export interface ContextToolExposure {
    /** Reconcile settings without changing which lazy groups were requested. */
    apply(): void;
    /** Forget lazy requests before the branch policy calls apply(). */
    atBoundary(): void;
    load(group: ContextToolGroup): string[];
    /** Whether the agent can call the group now or load it through the visible loader. */
    reachable(group: ContextToolGroup): boolean;
    unload(group: ContextToolGroup): void;
    summary(): string;
    status(): {
        mode: CompactConfig["toolLoading"];
        groups: Array<{
            group: ContextToolGroup;
            available: boolean;
            active: string[];
        }>;
    };
}
/** The sole owner of our tool visibility. Never scans memory or session files. */
export declare function createContextToolExposure(pi: Pick<ExtensionAPI, "getActiveTools" | "setActiveTools">, options: {
    config?: () => CompactConfig;
    compactionAccess: () => CompactConfig["agentToolAccess"];
}): ContextToolExposure;
export declare function registerContextToolLoader(pi: ExtensionAPI, exposure: ContextToolExposure): void;
export {};
//# sourceMappingURL=lazy-tools.d.ts.map