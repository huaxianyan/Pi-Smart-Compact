import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { SMART_COMPACT_REQUEST, type SmartCompactRequest, type SmartCompactResult } from "../extension-api.ts";
import { BUDGET_LIMITS } from "../constants.ts";
import { loadConfig } from "../utils/config.ts";
import { resolveSessionId, isUnresolvedSessionId } from "../infra/session-identity.ts";
import { resolveModels } from "./model-routing.ts";
import { runSmartCompact } from "./run-smart-compact.ts";
import type { PendingSlot } from "./pending-slot.ts";
import type { SessionRunLock } from "./session-run-lock.ts";
import type { SmartCompactPolicy } from "./smart-compact-policy.ts";

export interface ExtensionApiDependencies {
  pendingRef: PendingSlot;
  runLock: SessionRunLock;
  onNativeApplyError: (runId: string) => boolean;
  policy: SmartCompactPolicy;
  /** While applying a requested run, the native hook must accept exactly this summary. */
  nativeApplyRuns: Map<string, string>;
}

export function registerExtensionApi(pi: ExtensionAPI, dependencies: ExtensionApiDependencies): void {
  const active = new Map<string, AbortController>();
  pi.events.on(SMART_COMPACT_REQUEST, (data) => {
    const request = data as SmartCompactRequest;
    if (!request.accept()) return;
    void recover(request).then(request.respond, (error) => request.respond({
      status: "failed", errorMessage: error instanceof Error ? error.message : String(error),
    }));
  });

  pi.on("session_shutdown", (_event, ctx) => {
    active.get(resolveSessionId(ctx))?.abort();
  });

  async function recover(request: SmartCompactRequest): Promise<SmartCompactResult> {
    const { ctx, signal } = request;
    const sessionId = resolveSessionId(ctx);
    if (active.has(sessionId) || dependencies.runLock.isRunning(sessionId) || dependencies.pendingRef.peek(sessionId)) {
      return { status: "busy" };
    }
    if (!ctx.isIdle() || isUnresolvedSessionId(sessionId) || !ctx.model) {
      return { status: "failed", errorMessage: "Wait for an idle session with a selected model before recovering compaction." };
    }
    if (!dependencies.policy.isAutoTriggerEnabled()) {
      return { status: "failed", errorMessage: "Automatic Smart Compact is disabled; enable it in /smart-compact settings." };
    }
    if (!Number.isFinite(request.timeoutMs) || request.timeoutMs < BUDGET_LIMITS.LATENCY_MS.min || request.timeoutMs > BUDGET_LIMITS.LATENCY_MS.max) {
      return { status: "failed", errorMessage: "The compaction recovery deadline is outside the supported range." };
    }
    const model = ctx.model;
    const head = ctx.sessionManager.getLeafId();
    const controller = new AbortController();
    active.set(sessionId, controller);
    const abort = () => controller.abort();
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    let runId: string | undefined;
    const unchanged = () => !controller.signal.aborted && resolveSessionId(ctx) === sessionId &&
      ctx.model?.provider === model.provider && ctx.model?.id === model.id && ctx.sessionManager.getLeafId() === head;
    try {
      const config = loadConfig();
      const { segModel, sumModel, verifyModel } = resolveModels(ctx, model, config);
      if (!sumModel) return { status: "failed", errorMessage: "The summary model is unavailable; check Smart Compact model settings." };
      const outcome = await runSmartCompact({
        ctx, config, summaryModel: sumModel, segModel: segModel ?? sumModel, verifyModel: verifyModel ?? sumModel,
        mode: "fast", pendingRef: dependencies.pendingRef, isRunning: dependencies.runLock,
        autoTriggered: true, skipCompact: true, force: true,
        timeoutMs: request.timeoutMs, abortSignal: controller.signal, onNativeApplyError: dependencies.onNativeApplyError,
      });
      if (!unchanged()) return { status: "cancelled" };
      if (outcome.kind === "cancelled") return outcome.source === "timeout"
        ? { status: "failed", errorMessage: "Smart compaction timed out." }
        : { status: "cancelled" };
      if (outcome.kind !== "staged") return { status: "failed", errorMessage: `Smart compaction did not produce an applicable summary (${outcome.kind}).` };
      runId = outcome.pending.runId;
      dependencies.nativeApplyRuns.set(sessionId, runId);
      const expectedRunId = runId;
      return await new Promise<SmartCompactResult>((resolve) => {
        let done = false;
        const finish = (result: SmartCompactResult) => {
          if (done) return;
          done = true;
          controller.signal.removeEventListener("abort", cancel);
          resolve(result);
        };
        const cancel = () => {
          try { ctx.abort(); } catch { /* Reload invalidates the old context. */ }
          finish({ status: "cancelled" });
        };
        controller.signal.addEventListener("abort", cancel, { once: true });
        if (controller.signal.aborted) { cancel(); return; }
        try {
          ctx.compact({
            onComplete: (result) => finish((result.details as { runId?: string } | undefined)?.runId === expectedRunId
              ? { status: "applied", runId: expectedRunId }
              : { status: "failed", errorMessage: "The requested Smart Compact summary was not applied." }),
            onError: (error) => finish({ status: "failed", errorMessage: error.message }),
          });
        } catch (error) {
          finish({ status: "failed", errorMessage: error instanceof Error ? error.message : String(error) });
        }
      });
    } catch (error) {
      return controller.signal.aborted ? { status: "cancelled" } : {
        status: "failed", errorMessage: error instanceof Error ? error.message : String(error),
      };
    } finally {
      signal.removeEventListener("abort", abort);
      if (dependencies.nativeApplyRuns.get(sessionId) === runId) dependencies.nativeApplyRuns.delete(sessionId);
      active.delete(sessionId);
      // A cancelled request cannot leave an unclaimed summary for a later /compact.
      if (runId && dependencies.pendingRef.peek(sessionId)?.runId === runId) {
        dependencies.pendingRef.clear(sessionId);
      }
    }
  }
}
