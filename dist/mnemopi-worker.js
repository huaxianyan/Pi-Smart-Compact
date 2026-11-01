// @bun
// src/app/mnemopi-worker.ts
import { Mnemopi } from "@oh-my-pi/pi-mnemopi";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { Check } from "typebox/value";

// src/app/mnemopi-protocol.ts
import { Type } from "typebox";
var MNEMOPI_READY = "psc-mnemopi-ready-v1";
var target = { dbPath: Type.String(), projectId: Type.String() };
var fact = {
  memoryId: Type.String(),
  kind: Type.String(),
  title: Type.String({ maxLength: 200 }),
  content: Type.String({ minLength: 1, maxLength: 2000 }),
  relatedPaths: Type.Array(Type.String({ maxLength: 300 }), { maxItems: 20 })
};
var MnemopiMetadataSchema = Type.Object({
  projectId: target.projectId,
  memoryId: fact.memoryId,
  kind: fact.kind,
  title: fact.title,
  relatedPaths: fact.relatedPaths
});
var MnemopiRequestSchema = Type.Union([
  Type.Object({ ...target, ...fact, operation: Type.Literal("save") }),
  Type.Object({
    ...target,
    operation: Type.Literal("resolve"),
    memoryId: fact.memoryId
  }),
  Type.Object({
    ...target,
    operation: Type.Literal("inspect"),
    memoryId: fact.memoryId
  }),
  Type.Object({
    ...target,
    operation: Type.Literal("recall"),
    query: Type.String({ maxLength: 500 }),
    limit: Type.Integer({ minimum: 1, maximum: 20 }),
    kinds: Type.Optional(Type.Array(Type.String()))
  })
]);
var MnemopiOutcomeSchema = Type.Union([
  Type.Object({
    state: Type.Literal("saved"),
    dbPath: Type.String(),
    id: Type.String(),
    memoryId: Type.String(),
    existing: Type.Boolean()
  }),
  Type.Object({
    state: Type.Literal("resolved"),
    dbPath: Type.String(),
    closed: Type.Boolean()
  }),
  Type.Object({
    state: Type.Literal("inspected"),
    dbPath: Type.String(),
    fact: Type.Union([
      Type.Object({
        memoryId: Type.String(),
        kind: Type.String(),
        title: Type.String(),
        content: Type.String()
      }),
      Type.Null()
    ])
  }),
  Type.Object({
    state: Type.Literal("recalled"),
    dbPath: Type.String(),
    facts: Type.Array(Type.Object({
      id: Type.String(),
      memoryId: Type.String(),
      kind: Type.String(),
      title: Type.String(),
      content: Type.String(),
      score: Type.Number()
    }), { maxItems: 20 })
  }),
  Type.Object({
    state: Type.Literal("failed"),
    reason: Type.String(),
    dbPath: Type.Optional(Type.String())
  }),
  Type.Object({
    state: Type.Literal("unknown"),
    reason: Type.String(),
    dbPath: Type.Optional(Type.String())
  })
]);

// src/app/mnemopi-worker.ts
async function execute(request) {
  const { dbPath, projectId } = request;
  if (request.operation !== "save" && !existsSync(dbPath)) {
    if (request.operation === "recall")
      return { state: "recalled", dbPath, facts: [] };
    if (request.operation === "inspect")
      return { state: "inspected", dbPath, fact: null };
    return { state: "resolved", dbPath, closed: false };
  }
  process.umask(63);
  if (request.operation === "save")
    mkdirSync(path.dirname(dbPath), { recursive: true, mode: 448 });
  const byRef = request.operation !== "recall";
  const memory = new Mnemopi({
    dbPath,
    sessionId: byRef ? request.memoryId : projectId,
    authorId: projectId,
    channelId: request.operation === "save" ? request.kind : request.operation === "recall" ? projectId : "resolve",
    noEmbeddings: true,
    embeddings: false,
    llmEnabled: false,
    llm: false,
    proactiveLinking: false,
    reconcile: false
  });
  try {
    if (request.operation === "recall") {
      const groups = request.kinds?.length ? [...new Set(request.kinds)] : [undefined];
      const facts = [];
      for (const kind of groups) {
        const matches = await memory.recall(request.query, request.limit, {
          authorId: projectId,
          channelId: kind,
          queryEmbedding: null,
          contentPreviewChars: 2000
        });
        for (const match of matches) {
          let metadata;
          try {
            metadata = JSON.parse(match.metadata_json ?? "");
          } catch {
            continue;
          }
          if (!Check(MnemopiMetadataSchema, metadata) || metadata.projectId !== projectId || match.source !== "pi-smart-compact:" + metadata.memoryId || kind !== undefined && metadata.kind !== kind)
            continue;
          facts.push({
            id: match.id,
            memoryId: metadata.memoryId,
            kind: metadata.kind,
            title: metadata.title,
            content: match.content.slice(0, 2000),
            score: match.score ?? 0
          });
        }
      }
      facts.sort((a, b) => b.score - a.score);
      return { state: "recalled", dbPath, facts: facts.slice(0, request.limit) };
    }
    const source = "pi-smart-compact:" + request.memoryId;
    const rows = memory.getContext(2);
    const row = rows[0];
    if (rows.length > 1 || row !== undefined && (!row || typeof row !== "object" || !("source" in row) || row.source !== source || !("id" in row) || typeof row.id !== "string")) {
      throw new Error("Mnemopi fact scope contains unexpected entries; nothing changed");
    }
    const existingId = row && typeof row === "object" && "id" in row && typeof row.id === "string" ? row.id : null;
    if (request.operation === "inspect") {
      if (!existingId)
        return { state: "inspected", dbPath, fact: null };
      const raw = memory.get(existingId);
      const metadata = raw && typeof raw === "object" && "metadata" in raw ? Check(MnemopiMetadataSchema, raw.metadata) ? raw.metadata : null : null;
      const content = raw && typeof raw === "object" && "content" in raw && typeof raw.content === "string" ? raw.content : "";
      return {
        state: "inspected",
        dbPath,
        fact: {
          memoryId: request.memoryId,
          kind: metadata?.kind ?? "fact",
          title: metadata?.title ?? "Saved fact",
          content: content.slice(0, 2000)
        }
      };
    }
    if (request.operation === "resolve") {
      return { state: "resolved", dbPath, closed: existingId !== null && memory.forget(existingId) };
    }
    if (existingId)
      return { state: "saved", dbPath, id: existingId, memoryId: request.memoryId, existing: true };
    const id = memory.remember(request.content, {
      source,
      scope: "session",
      veracity: "stated",
      extract: false,
      extractEntities: false,
      metadata: { projectId, memoryId: request.memoryId, kind: request.kind, title: request.title, relatedPaths: request.relatedPaths }
    });
    return { state: "saved", dbPath, id, memoryId: request.memoryId, existing: false };
  } finally {
    memory.close();
  }
}
console.log(MNEMOPI_READY);
try {
  const input = JSON.parse(await Bun.stdin.text());
  if (!Check(MnemopiRequestSchema, input))
    throw new Error("Invalid Mnemopi worker request");
  let outcome;
  try {
    outcome = await execute(input);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    const dbPath = typeof input.dbPath === "string" ? input.dbPath : undefined;
    outcome = input.operation === "recall" ? { state: "failed", reason, dbPath } : { state: "unknown", reason, dbPath };
  }
  console.log(JSON.stringify(outcome));
} catch (error) {
  console.log(JSON.stringify({ state: "failed", reason: error instanceof Error ? error.message : String(error) }));
}
