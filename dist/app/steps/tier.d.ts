/**
 * Step 4: apply the admission gate and record context-pressure tier.
 *
 * Stage: `RecoveredRc` → `TieredRc | null`.
 *
 * Returns `null` for tier="none" so the orchestrator can short-circuit. The
 * "light" / "full" value is a telemetry and UI pressure label; Fast,
 * Balanced, and Thorough modes independently control downstream strategy.
 * `ActiveTier` statically proves that an admitted run cannot carry "none".
 */
import type { RecoveredRc, TieredRc } from "../run-context.ts";
export declare function selectTier(rc: RecoveredRc): TieredRc | null;
//# sourceMappingURL=tier.d.ts.map