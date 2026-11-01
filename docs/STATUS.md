# 开发进度

## 当前主线

维护 `huaxianyan/pi-smart-compact` 的 `v2ex-recovery` fork，与 V2EX 配套使用。补丁基于上游 `v9.7.1`，升级上游属于独立任务。

接手先读本文件和 [接口说明](EXTENSION_API.md)。README 保留上游介绍，fork 的安装入口单独说明。本机依赖与构建位置见本地 `AGENTS.md`。

## 2026-10-08：V2EX 压缩恢复接口

状态：实现与定向验证完成，发布目标为 `huaxianyan/pi-smart-compact` 的 `v2ex-recovery` 分支。
基线为上游 `v9.7.1`，提交 `4754047`。保留 MIT 许可证和上游贡献者信息。

### 实现

- `src/extension-api.ts` 是唯一跨扩展协议定义，调用方通过公开子路径导入。
- `src/app/register-extension-api.ts` 编排原有 EESV 管线的 `fast` 请求、取消和自动应用，不复制摘要算法。
- 默认请求期限 300 秒，遵守更低的全局 Smart Compact 预算及分支自动开关。
- 原生应用钩子只接受请求对应的暂存摘要，缺失或不匹配就取消应用，不走原生摘要。
- 自动恢复不弹手动 Apply 确认，普通手动审批设置不变。
- 对外暴露既有默认上下文占比，避免消费者复制默认常量。
- Git 安装直接使用随分支提交的 `dist/index.js` 和 `dist/extension-api.js`。

### 已验证

- 接口成功返回和超时行为两项 Node 测试通过。
- 现有 Smart Compact 工具定向回归六项通过。新增接口要求测试 fixture 提供事件总线，修复后只重跑失败的一项。
- 接口及关联源码严格 TypeScript 检查通过，使用 ES2024 库能力。
- V2EX 配套真实 pi 集成通过：自动压缩失败、配额等待、重载恢复、摘要自动应用及任务继续。
- 模型响应和配额接口为 fixture，没有使用真实 V2EX 配额，也没有验证真实摘要质量。

### 交接

安装来源为 `git:github.com/huaxianyan/pi-smart-compact@v2ex-recovery`。
移除旧 Smart Compact 安装声明，只加载一个实例；原有设置继续使用。
接口说明见 `docs/EXTENSION_API.md`。后续合并上游版本属于独立任务，不要在恢复补丁里顺带升级。

## 2026-10-13：核对 fork 交接入口

- 本轮基线：`v2ex-recovery` 的 `31fd8db`，已与该远端分支核对一致。
- 沿用现有进度和接口文档，README 明确 Git fork 与上游 npm 的区别，避免接手时安装到不同实现。
- 历史验证：8 项定向检查、严格类型检查和 V2EX 真实 pi fixture 配合结果沿用前述记录，本轮未重跑。
- 验证边界：本轮未构建预发布产物、执行压缩、请求模型或检查当前安装副本，没有更新配置。
- 继续维护唯一协议入口和既有摘要管线，接口补丁不初始化第二个摘要器，不用 fixture 结果证明真实摘要质量。
- 下一步：真实长会话观察与上游升级分别立项，保持当前 fork 安装来源和预构建入口。
- CI 与发布：此次文档推送后的结果未查询，本轮没有 npm 发布、标签或安装更新。

## 2026-10-15：协议类型入口指向随包产物

- 本轮基线：`v2ex-recovery` 的 `f6c10a1`。
- 问题：`exports["./extension-api"].types` 原先指向 `src/extension-api.ts`。该文件 import 了 `./constants.ts`，而 `files` 只发布 `src/extension-api.ts` 这一个源码文件，消费方直接报 TS2307。V2EX 侧 `npm run typecheck` 因此无法通过，只能靠本地声明桩绕过。
- 修复：按仓库既有构建步骤 `tsc -p tsconfig.json --emitDeclarationOnly` 生成声明，把 `dist/extension-api.d.ts`（含 `.d.ts.map`）与 `dist/*.js` 一样强制入库，`types` 改指该文件。产物自包含，只有一条对 `@earendil-works/pi-coding-agent` 的外部类型 import。
- `src/extension-api.ts` 继续随包发布：source map 的目标指向它，读者也能看到实现。只改类型入口，运行时入口 `dist/extension-api.js` 未动。
- 验证：V2EX 侧把声明与改后的 `package.json` 放进 `node_modules/pi-smart-compact`，对 `src/` 与 `test/` 跑严格 TypeScript 检查通过（此前同一检查报 TS2307）。
- 边界：本次未重跑 Bun 构建与定向测试，未改动 `dist/*.js`，未发布 npm。`dist/index.d.ts`（包根入口的 `types`）仍缺 —— 它的声明会带上 `.ts` 后缀的相对导入，而 `files` 不发布整个 `src`，补它需要另立一项，不在本次范围。

## 2026-10-15：补齐声明树，包根类型入口可用

- 本轮基线：`v2ex-recovery` 的 `18c7942`（上一轮的协议类型入口修复）。
- 问题：包根 `types: ./dist/index.d.ts` 一直缺文件。只补 `index.d.ts` 不够 —— 它的相对导入带 `.ts` 后缀，消费方要靠 `dist/` 里同名的 `.d.ts` 做扩展名替换，所以声明必须镜像 `src/` 的目录结构整棵提交。
- 修复：按仓库既有构建步骤生成整棵声明树（80 个 `.d.ts` + 80 个 `.d.ts.map`），与 `dist/*.js` 一样强制入库。`dist/*.js` 未重新打包，逐字节比对未变。
- 顺带修好本机依赖映射：`node_modules/@earendil-works/*` 与 `node_modules/typebox` 三个软链原先指向已不存在的 `AppData/Roaming/npm` 旧位置，现指向托管 pi 1.2.0 的安装目录。这处不影响仓库内容，但会让 `types` 里的包解析不到。
- 验证：消费方（Pi-V2EX-Quota）把整棵树放进 `node_modules/pi-smart-compact/dist` 后，同时导入包根默认导出与 `pi-smart-compact/extension-api` 子路径，`tsc` 在**关掉 `skipLibCheck`** 时零错误（`skipLibCheck` 会掩盖声明文件内部的解析失败，必须关掉才算验过）；再用 `@ts-expect-error` 反证默认导出是有类型的，不是退化成 `any`。
- 边界与偏差：声明用本机 TypeScript 5.9.3 生成（fork devDependencies 声明的是 7.0.2，本机没有 Bun 工具链），命令为 `tsc -p tsconfig.json --emitDeclarationOnly --types node`。`--types node` 覆盖了 tsconfig 里的 `["node","bun"]`：`@types/bun` 本机没有，而 `src/` 不使用 `Bun.` 全局（已核对），去掉它不影响产物。未重跑 Bun 构建、定向测试与 `release:check`，未发布 npm。
- 一处需要记住的坑：`types` 里列出的包解析不到时，tsc 报 TS2688 之后**会跳过后续语义检查**，只输出声明、不报模块解析错误 —— 那种产物看着正常但没有被真正检查过。所以生成声明前必须先确认依赖映射是活的。

## 2026-11-01：放宽自动压缩的三处硬上限，格式偏差不再丢弃摘要

- 本轮基线：`v2ex-recovery` 的 `4e4936d`。
- 起因：拼音项目长会话（`01a1406f`，84 次压缩）里，钩子接管的 32 次压缩**全部**落到 `method: "heuristic"`，`generationFallbacks` 只有两类：`call budget reserved for final assembly` + `assembly generation failed`（22 次），`N synthesis batch budget fallback(s)` + `assembly generation failed`（8 次）。84 条摘要里 18 条 Goal 退化成「继续下一步」「开始」这类空话，全部集中在钩子那批；Pi 原生那 52 条一条没退化。
- 三处硬上限（自动触发路径的实际约束）：
  - `AUTO_TRIGGER_TIMEOUT_CAP_MS` 60_000 → 600_000。270k 上下文要切多个 batch，一分钟根本不够，中途 abort 会把已完成的 batch 全部丢掉。
  - `AUTO_TRIGGER_MAX_LLM_CALLS` 4 → 12。原值低于「每 batch 一次 + 一次 assembly」，导致 batch 在尝试前就被推给确定性兜底。
  - `MODE_POLICIES[*].maxInputTokens`：fast 100k→400k、balanced 200k→600k、thorough 300k→900k。该上限是**累计**输入（`BudgetGuard` 累加），270k 上下文在 thorough 下只剩 30k 余量。
- 摘要接受规则：`singlePassCompact` 与 assembly 原先都以 `startsWith("##")` 为准，不满足就 throw，整轮结果作废换成确定性骨架。新增 `normalizeSummaryHeadings`：已是 `##` 开头原样返回；纯散文补一个 `## Goal` 头；`# 标题` + 后续小节则丢掉标题保留正文；空输出才报错。`verify.ts` 的 `!patched.startsWith("##")` 未动 —— 它失败时 `return summary`（原摘要），属于安全路径。
- 验证：`node --check` 语法通过；用 6 个样例单测 `normalizeSummaryHeadings`，纯散文、H1+小节、只有 H1、多段落四类均保留正文，空输入返回空串；`pi -p` 正常加载改动后的扩展（`reply exactly: ok` → `ok`）。
- 边界与偏差：本机无 Bun / esbuild / tsc（`node_modules` 里只有空目录），**`dist/index.js` 是手工改的**，与 `src/` 逐处对齐（`grep` 核对过两处判定点与三处常量），但没有重跑 Bun 构建、`bun test`、`release:check`。下次在有工具链的机器上应先 `bun run build` 重新生成 dist，再比对是否只剩预期差异。
- 配套的本机配置（不在本仓库）：`~/.pi/agent/settings.json` 的 `compaction.modelOverrides` 全量补齐到 270k 触发点（zen 两个模型保持 20000 不变）；`smartCompact` 改为 `mode: thorough` + `profile: light` + `summaryModel: magpie/workbuddy-ai/deepseek-v4.1-flash`，`minContextPercent` 从 60 降到 10 —— 1M 窗口下 270k 只占 27%，保持 60 会让钩子永不启动。

## 2026-11-01（续）：修掉「目标保留量超过实际上下文」导致的计划不可行

- 现象：上一轮把触发点降到 270k 后，压缩时报 `Smart compact skipped: the safe plan cannot meet its target; using native compaction instead.`
- 根因：`targetContextPercent` 是**窗口百分比**（fast 30 / balanced 40 / thorough 50）。1M 窗口下 50% 即 511,788，而 270k 触发时整个上下文只有 270k —— 目标保留量比全部内容还大。`planCompactionWindow` 的向后遍历以 `rawRetained + next > rawRetentionCeiling` 为终止条件，该条件永不成立，循环走到 `i = 0`，`keepFrom = 0`，判定落到 `no-eligible-prefix`，钩子放弃并交回原生压缩。
- 复刻验证（按源码公式重算）：1M 窗口 @182k 与 @270k 均 `no-eligible-prefix`；186k 窗口 @166k 与 372k 窗口 @270k 均 `viable`。即只有「大窗口 + 提前触发」这一组合被打破，正好是本轮 270k 改动引入的。
- 修复：`retentionCeiling` 在 `targetRetainedTokens >= totalTokens` 时退化为 `adaptiveKeepTokens`（与 force 同义）。保留比实际还多的内容没有意义，此时改用最小尾部。修复后复算：1M @182k 释放 70.2%、1M @270k 释放 79.8%、976k @270k 释放 80.9%，全部 `viable`；186k @166k（44.0%）与 372k @270k（31.1%）行为不变。
- 附带：非 force 分支的跳过警告改为带上 `compactionPlanReasonText(plan.reason)`。原先只说「计划不可行」，无法从会话日志判断是哪条判定失败，这次排查就只能靠复刻源码重算。
- 边界：`dist/index.js` 仍是手工修改（本机无 Bun），已 `node --check` 通过并与 `src/` 逐处对齐；未重跑 `bun build`、`bun test`。

## 2026-11-01（再续）：校验闸门不再丢弃可用的摘要

- 现象：`Smart compact stopped safely in 72.8s · no summary applied · Pi fallback continues`。
- 定位：`~/.pi/agent/.cache/compact-metrics.jsonl` 里 `2026-11-01T07:08:38.460Z` 一条，`failureKind: verification`、`verificationStage: post-synthesis`、`method: single-pass`、`verificationScore: 80`、`remainingVerificationGaps: 1`、`verificationGapKinds: ["inconsistency"]`、`totalCalls: 2`。即摘要生成成功（输入 135,946 / 输出 7,743），失败在校验，不是 LLM 调用。
- 这不是本轮改动引入的：同一 failureKind 从 2026-10-19 起累计 21 次，是长期系统性失败。
- 根因：`verifySummary` 的通过条件是 `gaps.length === 0 && score >= 85`，任何单个缺口都直接失败；失败后先试确定性兜底摘要，兜底也不过关就 `throw VerificationGateError`，整个运行判为失败，交回 Pi 原生压缩。
- 关键判断：原生压缩产出的是**同样未经校验**的模型摘要，结构化程度更低。所以「校验不过就丢弃」并没有换来安全，只是把一份 80/100 的摘要换成一份未校验的摘要。失败即丢弃不成立。
- 修复：新增 `isSummaryAcceptable`，两档结果。`ok`（严格）继续用于展示与 `verified` 标记；`acceptable`（score >= 70 且不含 `fabricated-file`）决定是否丢弃。只有「会让 agent 去打开不存在路径」这一类缺口才真正丢弃。两道闸门（`post-synthesis`、`post-state`）都改用该判定，警告只在最后一道输出一次，带出剩余缺口内容。
- 验证：判定单测四例——本次真实失败（80 + inconsistency）接受；95 + inconsistency 接受；90 + fabricated-file 丢弃；60 + 两缺口丢弃；全通过接受。`node --check` 通过，`src/` 与 `dist/` 两处闸门位置一致。
- 已知次要问题（未修）：verify/patch 调用的输出被 `DEFAULT_CAPS.maxOutputTokens` 截到 8192，本次 verify 输出正好 8192，补丁很可能被截断而无法消除缺口。magpie 实际输出上限更高（workbuddy-ai 为 24000）。闸门放宽后截断不再导致整轮丢失，但补丁成功率仍受此限制，可另立一项。
- 边界：`dist/index.js` 仍为手工修改，未跑 `bun build` 与测试。

## 2026-11-01（工具链）：装上 Bun，dist 改为真正构建产物

- 起因：评估上游 10.7.3 升级时发现两个硬阻塞——上游不入库 `dist/`（`git ls-tree v10.7.3 dist/` 为空），而本机没有 Bun/esbuild/tsc，此前 `dist/index.js` 全是手工改的。先验证工具链，再谈合并。
- 安装：`npm install -g bun` → **Bun 1.4.4**，与上游 10.7.1 记录的 CI 工具链版本一致。
- 构建：`bun run build` 成功。`dist/index.js` 0.63 MB、`dist/extension-api.js` 13.31 KB，外加三个 scripts bundle。产物逐项核对包含本轮全部源码改动（`AUTO_TRIGGER_TIMEOUT_CAP_MS=600000`、`normalizeSummaryHeadings`、`isSummaryAcceptable`、`targetRetainedTokens >= totalTokens`、`maxInputTokens: 900000`）。**`dist/index.js` 自此是构建产物，不再是手改文件。**
- 声明生成仍不可用：`bun x tsc --emitDeclarationOnly` 报 TS2688（缺 `@types/node`、`@types/bun`），正是本文档 2026-10-15 记过的那个坑——tsc 报 TS2688 后跳过语义检查、只输出声明。已用 `git checkout -- 'dist/**/*.d.ts'` 还原已提交的声明树。公开契约（包根 `types` 与 `./extension-api`）本轮未变，还原安全；新加的两个函数都是内部导出，不在 `exports` 里。
- 测试：`bun test` → 772 个测试 / 83 个文件，**60 个失败**。在 `4e4936d` 建临时 worktree 跑同一套做基线，失败集合**逐条一致**：无新增、无修掉。失败均为环境性（Windows `umask 000`、git root 过期、sqlite FTS、lease 目录不可创建），不是代码缺陷。临时 worktree 与备份已删除。
- 测试抓到一个真实回归：把 `AUTO_TRIGGER_MAX_LLM_CALLS` 提到 12 会抹掉「自动运行的调用数低于手动默认值」这条设计约束（12 ≥ 全部模式默认），该常量从此永不生效。改为 **8**：仍容纳 2–3 个 batch + assembly + 一次补丁，且仍把 thorough 从 12 压到 8。`test/mode-policy.test.ts` 的断言按新策略更新。
- 对下一步的意义：构建链路已通，10.7.3 合并的两个阻塞去掉一个（另一个是 extension-api 协议需在 10.x 钩子上重新实现）。

## 2026-11-01（升级）：fork 升到上游 v10.7.3

- 范围：上游 9.7.1 → v10.7.3，52 个提交、274 个文件（+59,484 / −14,806）。合并结果 383 个文件变更。
- 工具链前置：本机装了 Bun 1.4.4（与上游 CI 同版本），并 `bun install` 装上上游钉住的 141 个开发依赖，声明生成与类型检查才真正可用。此前 `node_modules` 里只有空目录，`tsc` 报 TS2688 后跳过语义检查——那种「声明看着正常但没被检查过」的产物不再出现。
- 冲突处理原则：上游已修同类问题就用上游。据此**撤销**了本轮早些时候的四个临时补丁中的三个：
  - `isSummaryAcceptable` 校验放宽整个删除。上游 10.1.2（兜底摘要不再无法通过自己的校验）、10.1.3（post-state 闸门不再拒绝已通过 post-synthesis 的摘要）已从根上修掉，并各有回归测试；`test/state-step-continuity.test.ts` 明确要求真正矛盾必须被拒绝，我们的放宽会削弱它。
  - `AUTO_TRIGGER_TIMEOUT_CAP_MS` 用上游 300s（比最初的 60s 已提升 5 倍）。
  - `AUTO_TRIGGER_MAX_LLM_CALLS` 用上游 4，`MODE_POLICIES` 的调用数与输入预算一并回归上游。上游有意让自动运行低于手动默认值，三处 pipeline 测试守住该约束；批量饥饿的根因已由 profile 的 chunk 尺寸与 single-pass 路径解决，不需要更多调用数。
- 保留的 fork 改动：extension-api 协议与 `index.ts` 的 `nativeApplyRuns` 守卫（适配 10.x 重构后的钩子）、`normalizeSummaryHeadings`（上游 single-pass/assembly 仍以 `startsWith("##")` 为准）、`window.ts` 的 `retentionCeiling` 修复（目标保留量超过实际上下文时退化为最小尾部）、`package.json` 同时导出 `./extension-api` 与上游新增的 `./rtk`。
- 适配 10.x 的两处必要修正：`SessionRunLock.isRunning` → `isSessionActive`；`registerExtensionApi` 在宿主没有 `events` 总线时跳过注册（与上游 `hindsight-tracking.ts`、`compaction-delivery.ts` 同样的 `typeof` 判断），否则整个扩展会在缺少该能力的宿主上构造失败——这一条不修会让 30 多个上游测试整片失败。
- 验证：`bun run typecheck` 0 错误；`bun test` 2061 个测试，失败集合与纯净 v10.7.3 逐条对齐，唯一差异是 Windows 文件锁导致的偶发 `EBUSY`（单跑 3/3 通过，上游同样偶发）；`bun run build` 完整通过，产物 4 个 bundle（index 1.14 MB / extension-api 15.69 KB / rtk 27 KB / mnemopi-worker 7.39 KB）+ 129 个声明文件。
- 与 9.7.1 的差异提醒：10.x 新增 Hindsight、Mnemopi、rtk、Home 界面等子系统，`/smart-compact` 的交互与设置项有变化；本机 `settings.json` 的 `smartCompact` 配置继续沿用，但 `singlePassMaxTokens` 已下调到 300000 —— 上游 thorough 的输入预算是 300k，原来的 450000 会让 single-pass 阈值（×0.9 = 405k）超过输入预算而触发 BudgetExceeded。
