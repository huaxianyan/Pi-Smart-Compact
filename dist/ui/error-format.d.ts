/**
 * Literal, scrubbed diagnostic: "<status> <ErrorType>: <first message line>",
 * at most 160 chars. Response bodies beyond the first line are never included.
 */
export declare function providerErrorDetail(error: unknown): string;
/** Failure kind, the scrubbed literal first error line, and an action. */
export declare function formatGenerationFailureForUi(error: unknown): string;
/** One UI line: kind, scrubbed literal first error line, effect, action. */
export declare function formatCompactErrorForUi(error: unknown): string;
//# sourceMappingURL=error-format.d.ts.map