export interface ArtifactOwnerStatus {
    owner: string;
    files: number;
    bytes: number;
    oldestMs: number | null;
    newestMs: number | null;
    /** Entries inside the owner directory that are not hex-named regular files (locks, strays). */
    stray: number;
    status: "live" | "unreferenced-in-scan" | "unknown";
    reasons: string[];
}
export interface ArtifactStorageReport {
    root: string;
    rootPresent: boolean;
    rootSafe: boolean;
    sessionsRoot: string;
    sessionsRootPresent: boolean;
    sessionFilesScanned: number;
    sessionFilesUnreadable: string[];
    /** False when any lineage source was missing, unreadable, or unsafe. */
    scanComplete: boolean;
    owners: ArtifactOwnerStatus[];
    foreign: Array<{
        name: string;
        kind: string;
    }>;
    totals: {
        owners: number;
        files: number;
        bytes: number;
        liveBytes: number;
        unreferencedBytes: number;
        unknownBytes: number;
    };
    /** Self-managing retention neighbors, for one coherent status surface. */
    retention: {
        backupMaxFiles: number;
        backupMaxAgeDays: number;
        extractionCachePruneDays: number;
        artifacts: "no automatic deletion";
    };
    /** Coverage boundary, stated by the report itself so no consumer can misread it. */
    coverage: "native sessions root only; unreferenced-in-scan is not safe-to-delete";
}
/** Readonly, reference-aware inventory of the artifact store and its lineage anchors. */
export declare function inspectArtifactStorage(): Promise<ArtifactStorageReport>;
//# sourceMappingURL=artifact-storage.d.ts.map