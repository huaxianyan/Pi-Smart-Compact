import type { CompactOptions, ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { type SmartCompactOptions, type CompactOutcome } from "./run-smart-compact.ts";
/** Hold external messages, not the agent loop or speculative background preparation. */
export declare function registerCompactionDelivery(pi: ExtensionAPI): {
    runManual: (options: SmartCompactOptions) => Promise<CompactOutcome>;
    guard: (ctx: ExtensionContext) => ExtensionContext;
    /** Return an idle-checked recovery callback for the automatic request's watchdog. */
    compact: (ctx: ExtensionContext, options?: CompactOptions) => () => void;
};
//# sourceMappingURL=compaction-delivery.d.ts.map