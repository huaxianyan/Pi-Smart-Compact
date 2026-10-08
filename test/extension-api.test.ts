import assert from "node:assert/strict";
import { test } from "node:test";
import { createEventBus, type ExtensionContext } from "@earendil-works/pi-coding-agent";
import { requestSmartCompaction, SMART_COMPACT_REQUEST, type SmartCompactRequest } from "../src/extension-api.ts";

test("调用恢复接口后收到已应用的摘要结果", async () => {
  const events = createEventBus();
  events.on(SMART_COMPACT_REQUEST, (data) => {
    const request = data as SmartCompactRequest;
    if (request.accept()) request.respond({ status: "applied", runId: "fixture-run" });
  });
  assert.deepEqual(await requestSmartCompaction({ events }, {} as ExtensionContext, new AbortController().signal), {
    status: "applied", runId: "fixture-run",
  });
});

test("恢复处理超过期限时返回超时，供调用方安排重试", async () => {
  const events = createEventBus();
  events.on(SMART_COMPACT_REQUEST, (data) => {
    const request = data as SmartCompactRequest;
    request.accept();
    request.signal.addEventListener("abort", () => request.respond({ status: "cancelled" }), { once: true });
  });
  const result = await requestSmartCompaction({ events }, {} as ExtensionContext, new AbortController().signal, 1);
  assert.equal(result.status, "failed");
});
