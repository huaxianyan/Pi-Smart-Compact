type Args = Record<string, unknown>;
/**
 * Extract a non-empty file-path argument from a tool call, covering common key
 * names. Returns undefined when no usable path is present.
 */
export declare function extractToolPath(args: unknown): string | undefined;
/** Explicit instruction/skill sources stay inline even when their read is recoverable. */
export declare function isInstructionSource(args: Args): boolean;
export declare function isReadOnlyResearchTool(toolName: string, input: Args): boolean;
/** Shell runs have side effects; only their old text output is archivable, never the call. */
export declare function isShellTool(toolName: string): boolean;
/**
 * Results a context trim may replace with a digest once old: read-only research,
 * `smart_context read` pages (ephemeral copies of archived text), and shell output.
 */
export declare function isArchivableToolResult(toolName: string, input: Args): boolean;
/** The call's subject for a trim digest: file path, first command line, or search pattern. */
export declare function toolCallSubject(toolName: string, args: unknown): string | undefined;
export interface ShellFileOperations {
    modified: string[];
    deleted: string[];
}
/**
 * True only when every pipeline segment and line provably just reads: an allowlisted command, no
 * expansion, substitution, glob or heredoc, and redirects only to /dev/null or a file descriptor.
 * Fails closed; used to let a research rewind remove read-only shell exchanges.
 */
export declare function isReadOnlyShellCommand(command: string): boolean;
/** Calls a research rewind may remove: read-only research tools, plus shell commands that provably only read. */
export declare function isRemovableResearchCall(toolName: string, input: Args): boolean;
export declare function extractShellFileOperations(args: unknown): ShellFileOperations;
/**
 * File paths a call reads (read-only tools carrying a path) or writes/deletes (mutating
 * tools by `classifyToolOperation`, plus literal shell targets). `path.normalize` only:
 * relative and absolute forms never match, so an unknown relation stays unsuperseded.
 */
export declare function fileOperationPaths(name: string, args: unknown): {
    reads: string[];
    writes: string[];
};
export type ToolClass = "mutates" | "accesses" | "executes" | "other";
export type ToolOperation = "read" | "search" | "list" | "mutate" | "delete" | "execute" | "unknown";
/** Normalize provider wrappers and spelling differences without merging namespaces. */
export declare function normalizeToolName(name: unknown): string;
/**
 * Fine-grained EESV operation taxonomy. Argument shape is authoritative;
 * normalized names only disambiguate otherwise-safe path/text and access calls.
 */
export declare function classifyToolOperation(args: unknown, toolName?: string): ToolOperation;
/** Stable identity for deciding whether a later call is a retry of an earlier one. */
export declare function toolOperationSignature(toolName: string, args: Record<string, unknown>): string;
export declare function sameToolOperation(left: {
    name: string;
    arguments: Record<string, unknown>;
}, right: {
    name: string;
    arguments: Record<string, unknown>;
}): boolean;
/**
 * Broad compatibility classifier retained for existing name-agnostic callers.
 */
export declare function classifyTool(args: unknown): ToolClass;
export {};
//# sourceMappingURL=tool-semantics.d.ts.map