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
