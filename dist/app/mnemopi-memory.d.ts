import type { CompactConfig } from "../types.ts";
import { type BunExecutable } from "./memory-backend.ts";
import { type MnemopiOutcome, type MnemopiRequest } from "./mnemopi-protocol.ts";
export declare function mnemopiTarget(config: Pick<CompactConfig, "mnemopiDataDir">, projectId: string): {
    dbPath: string;
    projectId: string;
};
/** The Bun-only optional engine never loads into stock Pi's Node process. */
export declare function runMnemopi(request: MnemopiRequest, signal?: AbortSignal, options?: {
    bunExecutable?: BunExecutable | null;
}): Promise<MnemopiOutcome>;
export declare function formatMnemopiOutcome(outcome: MnemopiOutcome): string;
//# sourceMappingURL=mnemopi-memory.d.ts.map