import type { ExtensionAPI, SessionEntry } from "@earendil-works/pi-coding-agent";
import type { CompactConfig } from "../types.ts";
export declare const ARTIFACT_DETAILS_KEY = "smartCompactArtifact";
export declare const ARTIFACT_MIN_CHARS = 16384;
export declare const ARTIFACT_MAX_BYTES: number;
export declare const ARTIFACT_SESSION_BYTES: number;
export declare const ARTIFACT_SESSION_FILES = 256;
export declare const digest: (text: string) => string;
export interface ToolArtifact {
    version: 1;
    owner: string;
    hash: string;
    previewHash: string;
    chars: number;
    bytes: number;
    lines: number;
    tool: string;
    source: string;
}
export declare const artifactId: (artifact: ToolArtifact) => string;
export declare function parseToolArtifact(value: unknown): ToolArtifact | null;
/** Caller must first prove the reference is reachable from its active branch. */
export declare function readToolArtifact(artifact: ToolArtifact): Promise<string>;
/** `retrievable` answers whether the agent can reach `smart_context` to read an offloaded output back. */
export declare function registerArtifactOffload(pi: ExtensionAPI, config: () => CompactConfig, retrievable: () => boolean): void;
export declare function branchToolArtifacts(branch: readonly SessionEntry[], ownedReferences: ReadonlySet<string>): Map<string, ToolArtifact>;
//# sourceMappingURL=tool-artifacts.d.ts.map