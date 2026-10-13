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
