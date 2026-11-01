/** Optional companion. Explicitly load this entry point; never auto-loaded by Smart Compact.
 * Delegates rules to RTK's public `rewrite` CLI; requires >=0.50 for the tested recall behavior.
 * No RTK source or filtering rules are bundled. https://github.com/rtk-ai/rtk/tree/master/hooks/pi
 */
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
export default function rtkCompanion(pi: Pick<ExtensionAPI, "on" | "exec">): void;
//# sourceMappingURL=rtk.d.ts.map