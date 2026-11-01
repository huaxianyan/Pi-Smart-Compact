/**
 * Stable memory references shown by save/recall results and required by
 * smart_save_memory status=resolved.
 *
 * A ref names the backend that holds the fact, the id that backend assigned,
 * and a digest of the exact target (graph file / data root / server+bank).
 * Hindsight also binds the project and document id. Saving the same fact to
 * two targets therefore produces two distinct refs, and after a configuration
 * switch an old ref refuses to act instead of silently retargeting.
 *
 * Refs never carry a raw URL, bank id, or filesystem path, so a caller cannot
 * redirect an action to another target: the destination is always re-derived
 * from current configuration and compared against the digest.
 */
export type MemoryRefBackend = "local" | "mnemopi" | "hindsight";
export interface MemoryRef {
    backend: MemoryRefBackend;
    id: string;
    /** Mandatory 96-bit digest of the exact backend storage target. */
    target: string;
}
export declare function localTargetDigest(graphFile: string): string;
export declare function hindsightTargetDigest(baseUrl: string, bankId: string, projectId: string, memoryId: string): string;
export declare function mnemopiTargetDigest(dbPath: string): string;
/** Parse and validate one ref; anything else (URLs, paths, free text) is null. */
export declare function parseMemoryRef(value: string): MemoryRef | null;
//# sourceMappingURL=memory-ref.d.ts.map