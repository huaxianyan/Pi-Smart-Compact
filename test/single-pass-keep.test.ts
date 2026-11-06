import { describe, expect, it } from "bun:test";
import { planCompactionWindow } from "../src/app/steps/window.ts";
import { singlePassTokenLimit } from "../src/app/mode-policy.ts";
import type { ProfileConfig, SessionMessageEntry } from "../src/types.ts";

function messageEntry(
  id: string,
  parentId: string | null,
  message: Record<string, unknown>,
): SessionMessageEntry & { parentId: string | null; timestamp: string } {
  return {
    type: "message",
    id,
    parentId,
    timestamp: "2026-06-15T00:00:00.000Z",
    message,
  };
}

/** Fine-grained turns, so retention lands close to the token targets. */
function branchOf(turns: number) {
  const branch: ReturnType<typeof messageEntry>[] = [];
  for (let index = 0; index < turns; index += 1) {
    branch.push(
      messageEntry(
        `m${index}`,
        index === 0 ? null : `m${index - 1}`,
        { role: index % 2 === 0 ? "user" : "assistant", content: [{ type: "text", text: `turn ${index}` }] },
      ),
    );
  }
  return branch;
}

function profile(overrides: Partial<ProfileConfig> = {}): ProfileConfig {
  return {
    summaryBudgetTokens: 10_000,
    keepRecentTokens: 30_000,
    minChunkTokens: 800,
    maxChunkTokens: 30_000,
    singlePassMaxTokens: 300_000,
    batchMaxTokens: 120_000,
    ...overrides,
  };
}

/** The phase a 700k trigger on a 1M window actually summarizes. */
function planAt(totalTokens: number, singlePassMaxTokens = 300_000) {
  const turns = 40;
  return planCompactionWindow({
    msgs: branchOf(turns),
    branch: branchOf(turns),
    messageTokens: Array.from({ length: turns }, () => Math.round(totalTokens / turns)),
    totalTokens,
    modelContextWindow: 1_048_576,
    mode: "thorough",
    profileCfg: profile({ singlePassMaxTokens }),
    force: false,
  });
}

describe("single pass token limit", () => {
  it("scales the profile budget by the thorough mode multiplier", () => {
    // 300k profile budget × 1.0 provider × 0.9 thorough multiplier.
    expect(
      singlePassTokenLimit({
        singlePassMaxTokens: 300_000,
        providerMultiplier: 1,
        mode: "thorough",
      }),
    ).toBe(270_000);
  });

  it("applies the fast mode multiplier to the same budget", () => {
    // fast doubles the budget, which is why a 32k summarizer stays ineligible.
    expect(
      singlePassTokenLimit({
        singlePassMaxTokens: 40_000,
        providerMultiplier: 1,
        mode: "fast",
      }),
    ).toBe(80_000);
  });
});

describe("compaction window on a one-million-token model", () => {
  it("summarizes a 700k trigger in one pass at the current profile budget", () => {
    // Half the window stays raw, so only the excess is summarized. This is why
    // raising the trigger point needs no keepRecentTokens change.
    const plan = planAt(700_000);

    expect(plan.viable).toBeTrue();
    expect(plan.compactTokens).toBeLessThan(270_000);
  });

  it("crosses the single-pass limit once the trigger approaches the window", () => {
    // Guards the real cliff: past roughly window/2 + single-pass limit the
    // summarized phase alone no longer fits one request.
    const plan = planAt(1_000_000);

    expect(plan.viable).toBeTrue();
    expect(plan.compactTokens).toBeGreaterThan(270_000);
  });
});
