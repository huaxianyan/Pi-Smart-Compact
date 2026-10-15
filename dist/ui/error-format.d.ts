/** Never echo provider errors: their bodies may contain prompts, credentials, or paths. */
export declare function formatGenerationFailureForUi(error: unknown): string;
/** One content-free UI line; raw diagnostics require explicit local opt-in. */
export declare function formatCompactErrorForUi(error: unknown): string;
//# sourceMappingURL=error-format.d.ts.map