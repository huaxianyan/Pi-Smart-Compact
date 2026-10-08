# Extension recovery API

This fork is based on upstream `v9.7.1` and maintained on `v2ex-recovery`. It adds an in-process recovery interface; the existing EESV pipeline, verification, approval settings, and persistence implementation remain the summary authority.

Install the running extension:

```sh
pi install git:github.com/huaxianyan/pi-smart-compact@v2ex-recovery
```

Remove the previous Smart Compact package declaration after installation succeeds. Only one Smart Compact factory should be loaded. Existing `smartCompact` settings remain in use.

## Calling the interface

Declare a dependency on this fork and import the small protocol module:

```ts
import { requestSmartCompaction } from "pi-smart-compact/extension-api";

const controller = new AbortController();
const result = await requestSmartCompaction(pi, ctx, controller.signal);
if (result.status === "applied") {
  // The verified summary is already persisted by Pi. Resume the original task.
}
```

The protocol module does not initialize another extension or another summarizer. It talks to the loaded factory through Pi's event bus. The caller must use an idle context and cancel its controller when the user cancels, switches tasks, or reloads. This API is for trusted in-process extensions, not model-supplied event payloads.

The default request deadline is 300 seconds. The existing global Smart Compact latency and token budgets still apply. Recovery uses `fast`, stages through the existing pipeline, and automatically requests native Apply without the manual approval dialog. It bypasses the adaptive pressure gate because the caller has already encountered a failed compaction, but respects the effective branch automatic-compaction switch.

Results are `applied` (with the correlation run ID), `failed` (with a diagnostic error message), `cancelled`, or `busy`. Treat only `applied` as permission to resume. The caller owns bounded retry, quota waiting, and durable recovery plans. Timeout results are reported as failures rather than user cancellation.

During Apply, the native hook must consume the summary from exactly that request. A missing, expired, or mismatched candidate cancels Apply instead of calling the native summarizer. Existing session, branch, verification, yield, and persistence gates remain active. Original history is retained on failure.

`SMART_COMPACT_MIN_CONTEXT_PERCENT` exposes the existing default from Smart Compact's canonical configuration, so consumers can check trigger compatibility without copying it.

## Development and verification

The fork tracks `dist/index.js` and `dist/extension-api.js` for Git-based installation. Rebuild changed entries before committing:

```sh
bun build src/index.ts src/extension-api.ts --outdir dist --target node \
  --external '@earendil-works/*' --external typebox
node --test test/extension-api.test.ts
bun test test/index-tool.test.ts
```

The companion V2EX repository has a real-Pi integration case:

```sh
SMART_COMPACT_EXTENSION=/path/to/fork/dist/index.js \
  node tools/verify-compact-window.mjs --recovery
```

It exercises failed initial compaction, quota waiting, reload restoration, verified Apply, and task continuation. Model responses and the quota server are fixtures; it uses no upstream quota. See `docs/STATUS.md` for the recorded validation scope.
