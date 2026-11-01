import { Type, type Static } from "typebox";
export declare const MNEMOPI_READY = "psc-mnemopi-ready-v1";
export declare const MnemopiMetadataSchema: Type.TObject<{
    projectId: Type.TString;
    memoryId: Type.TString;
    kind: Type.TString;
    title: Type.TString;
    relatedPaths: Type.TArray<Type.TString>;
}>;
export declare const MnemopiRequestSchema: Type.TUnion<[Type.TObject<{
    dbPath: Type.TString;
    projectId: Type.TString;
    memoryId: Type.TString;
    kind: Type.TString;
    title: Type.TString;
    content: Type.TString;
    relatedPaths: Type.TArray<Type.TString>;
    operation: Type.TLiteral<"save">;
}>, Type.TObject<{
    dbPath: Type.TString;
    projectId: Type.TString;
    operation: Type.TLiteral<"resolve">;
    memoryId: Type.TString;
}>, Type.TObject<{
    dbPath: Type.TString;
    projectId: Type.TString;
    operation: Type.TLiteral<"inspect">;
    memoryId: Type.TString;
}>, Type.TObject<{
    dbPath: Type.TString;
    projectId: Type.TString;
    operation: Type.TLiteral<"recall">;
    query: Type.TString;
    limit: Type.TInteger;
    kinds: Type.TOptional<Type.TArray<Type.TString>>;
}>]>;
export declare const MnemopiOutcomeSchema: Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"saved">;
    dbPath: Type.TString;
    id: Type.TString;
    memoryId: Type.TString;
    existing: Type.TBoolean;
}>, Type.TObject<{
    state: Type.TLiteral<"resolved">;
    dbPath: Type.TString;
    closed: Type.TBoolean;
}>, Type.TObject<{
    state: Type.TLiteral<"inspected">;
    dbPath: Type.TString;
    fact: Type.TUnion<[Type.TObject<{
        memoryId: Type.TString;
        kind: Type.TString;
        title: Type.TString;
        content: Type.TString;
    }>, Type.TNull]>;
}>, Type.TObject<{
    state: Type.TLiteral<"recalled">;
    dbPath: Type.TString;
    facts: Type.TArray<Type.TObject<{
        id: Type.TString;
        memoryId: Type.TString;
        kind: Type.TString;
        title: Type.TString;
        content: Type.TString;
        score: Type.TNumber;
    }>>;
}>, Type.TObject<{
    state: Type.TLiteral<"failed">;
    reason: Type.TString;
    dbPath: Type.TOptional<Type.TString>;
}>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
    reason: Type.TString;
    dbPath: Type.TOptional<Type.TString>;
}>]>;
export type MnemopiRequest = Static<typeof MnemopiRequestSchema>;
export type MnemopiOutcome = Static<typeof MnemopiOutcomeSchema>;
//# sourceMappingURL=mnemopi-protocol.d.ts.map