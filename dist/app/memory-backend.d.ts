import type { CompactConfig, MemoryBackend } from "../types.ts";
import type { MemoryRef } from "../infra/memory-ref.ts";
/** Local context-graph operations run only for an exclusively selected local backend. */
export declare function localGraphOpsAllowed(config: Pick<CompactConfig, "memoryBackend" | "contextGraphEnabled">): boolean;
export interface MemoryBackendReadiness {
    backend: MemoryBackend;
    /** Selected backend only: its prerequisites are satisfiable without side effects. */
    ready: boolean;
    /**
     * Human-readable evidence naming exactly what was checked. Model,
     * credential and store checks are never claimed: presence-level checks
     * only, and only for the selected backend.
     */
    reason: string;
    /** Local context-graph read/write is permitted for this selection. */
    localOpsAllowed: boolean;
}
/**
 * Readonly readiness for the selected backend only. Never contacts a server,
 * never reads a key beyond the named environment variable's presence, never
 * creates or opens a store, and never probes an unselected backend (Mnemopi
 * stays unprobed unless it is the selection). Server installation is never
 * performed or implied: an existing URL, explicit bank and env key are
 * required configuration.
 */
export declare function describeMemoryBackendReadiness(config: Pick<CompactConfig, "memoryBackend" | "contextGraphEnabled" | "hindsightBaseUrl" | "hindsightBankId" | "hindsightApiKeyEnv" | "hindsightTimeoutMs">, env?: Record<string, string | undefined>): Promise<MemoryBackendReadiness>;
/**
 * Refuse a ref that lives in an unselected store instead of operating it:
 * the caller must switch the memory backend to the ref's own backend. Returns
 * null when the ref matches the selected backend.
 */
export declare function inactiveBackendRefusal(config: Pick<CompactConfig, "memoryBackend">, ref: MemoryRef): string | null;
export interface BunExecutable {
    /** Absolute executable path, or "bun" so execFile's PATH search resolves it. */
    executable: string;
    source: "package" | "platform-package" | "path";
}
/**
 * Resolve the executable for the Bun-only Mnemopi worker: the optional bun
 * component installed beside the extension first (metadata + actual installed
 * layout, with the platform @oven package as fallback), then a supported PATH
 * Bun. Read-only filesystem checks only: no shell, no download, no
 * self-install, no network.
 */
export declare function resolveBunExecutable(parentUrl?: string): BunExecutable | null;
export declare function bunVersionSupported(version: string): boolean;
/**
 * Presence/version evidence for the Mnemopi runtime: the optional
 * @oh-my-pi/pi-mnemopi component, the worker file, and a usable Bun executable
 * (the optional bun component first, PATH fallback). The engine is never
 * loaded and no database is opened or created. `ready` means only these
 * checks passed. Missing components name the install command.
 */
export declare function describeMnemopiRuntime(parentUrl?: string): Promise<{
    ready: boolean;
    reason: string;
}>;
//# sourceMappingURL=memory-backend.d.ts.map