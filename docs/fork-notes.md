# Fork 维护手册：分歧地图与上游同步

本仓库是 [LingyiChen-AI/JadeAI](https://github.com/LingyiChen-AI/JadeAI) 的 fork，由 build-workbench 维护，聚焦 Docker Web 部署（已移除桌面客户端）。本文回答两个问题：**fork 与上游的差异在哪里**、**如何安全地同步上游**。

## 1. 分歧概况

- 上游地址：`https://github.com/LingyiChen-AI/JadeAI`，本地 remote 名为 `upstream`。
- 截至 2026-10-04 同步（v0.7.0）：fork 领先上游约百个提交（精确值用 `git rev-list --count upstream/main..main` 查询）；上游 main 自 2026-09-03 起无新提交。
- fork 自 v0.4.0 起独立版本：`package.json` 的 `version` 为唯一来源，Git tag / Release / Docker tag 统一 `v<version>`；上游 tag 停在 v0.3.x。
- 定位差异：fork 删除 Electron 桌面客户端及 `desktop-release.yml`，新增/重写 Docker 构建运行链、GitHub Pages 站点、CI 工作流、PDF 分页策略与主题系统等。

## 2. 自有模块（零冲突区）

fork 的改动应尽量落在独立的新文件中——以下位置为 fork 自有，上游不会改动，合并时天然无冲突：

- `src/lib/pdf/pagination-strategy.ts` 及配套回归测试
- `src/lib/resume-theme/`、`src/lib/resume-section/`、`src/lib/resume-template-shared/`
- `src/lib/rate-limit.ts`
- `scripts/`（`build-export-css.ts`、`docker-smoke.sh`、`verify-release.sh` 等）
- `.github/workflows/ci.yml`、`pages.yml`、`upstream-sync.yml`（上游为 `publish.yml`、`desktop-release.yml`）
- `Dockerfile`、`docker_run_local.sh`、`docker_publish.sh`、`pages-site/`
- `changelog/`、`docs/`（含本文件）、`AGENTS.md`

**给贡献者的约定**：新增功能优先建新文件/新模块；必须改动上游共享文件时，改动尽量小而集中，并对照第 3 节评估冲突影响。

## 3. 共享热点文件（常驻冲突点与处理策略）

每次合并按下表机械执行，不要临场重新决策：

| 路径 | 上游状态 | fork 状态 | 合并策略 |
| --- | --- | --- | --- |
| `README.md` | 持续更新 | 已完全重写 | 保留 fork（`git checkout --ours`） |
| `README.zh-CN.md` | 存在且仍会改动 | 已删除 | `git rm`，保持删除 |
| `.gitignore` | `.superpowers/*` 写法 | `.superpowers/` 写法 | 保留 fork |
| `electron/` | main 仍在开发，另有 `desktop` 分支 | 已整体删除 | 保持删除；若合并后目录重现，`git rm -r electron` |
| `src/middleware.ts` | 存在 | 已改名 `src/proxy.ts` | 保留改名；上游对 middleware 的实质修改需手工对照移植到 `proxy.ts` |
| `package.json` | `version: 0.1.0` | 独立版本号与仓库元数据 | 保留 fork |
| `pnpm-lock.yaml` | 随上游依赖变化 | 可能双方都变 | 合并后必须 `pnpm install --frozen-lockfile` 校验，失败则按上游语义重新生成并回归测试 |
| `messages/zh.json`、`en.json` | 会新增 key | fork 也频繁修改 | 通常自动合并；合并后用 `node -e "JSON.parse(...)"` 之类校验 JSON 合法 |
| `.github/workflows/issue-spam-guard.yml` | 同名文件 | fork 自有版本 | 保留 fork |

维护者本机 Git 已开启 `git rerere`（`~/.gitconfig` 全局配置；解决方案缓存 `.git/rr-cache` 也只存本机），2026-10-04 的合并已记录 README.md 与 .gitignore 的解决方案，本机重复冲突会自动复用。注意：CI 与其他机器上 rerere **不生效**——需在该环境执行 `git config rerere.enabled true` 并重新积累缓存，或按本表手工处理。

## 4. 已拒绝的上游内容（避免重复评估）

- **LaunchAI 推广徽章**（上游 `ac7bf23`、`9d95236`，及 `ef3e3af` 中 footer 部分）：上游作者为其关联产品导流。徽章硬编码 `#1f2a24`、`#f8f8f6` 等色值，违反本仓库「主题色必须用语义化 `--brand-*` token」的约束，且引入对 `launchai.tools` 的外部图片依赖。合并后如发现 `launchai` 字样一律剔除：`grep -ri launchai src/ messages/ README.md`。
- **`.gitignore` 的 `.superpowers/*` 写法**：与 fork 现有 `.superpowers/` 语义等价，无需采纳。

## 5. 上游 tag 命名空间

fork 与上游的版本号体系独立（fork 从 v0.4.0 起步，上游会继续打 v0.4.0+ 的 tag）。为避免撞名，本地 `upstream` remote 配置了命名空间化的 fetch refspec：

```
+refs/heads/*:refs/remotes/upstream/*
+refs/tags/*:refs/tags/upstream/*
```

之后 `git fetch upstream` 拉到的上游 tag 一律落在 `refs/tags/upstream/*`（如 `upstream/v0.4.0`），不会覆盖本 fork 自己的 tag。早期同步拉取的上游 tag（v0.0.1–v0.3.4）仍留在全局命名空间，均指向 fork 历史内的祖先提交，无风险；`upstream/*` 命名空间内是权威副本。

上游 tag 为轻量 tag（直接指向 commit），日常 `git push` / `--follow-tags` 不会把它们推到 origin；但**不要**对 origin 使用 `git push --tags`——那会把整个 `upstream/*` 命名空间推上去（无害但污染 fork 仓库的 tag 列表）。

新克隆仓库后执行一次即可：

```bash
git remote add upstream https://github.com/LingyiChen-AI/JadeAI.git
git config --replace-all remote.upstream.fetch '+refs/heads/*:refs/remotes/upstream/*'
git config --add remote.upstream.fetch '+refs/tags/*:refs/tags/upstream/*'
```

## 6. 标准同步流程

```bash
# 1. 拉取上游，查看落后多少
git fetch upstream
git rev-list --count HEAD..upstream/main
git log --oneline HEAD..upstream/main   # 逐条浏览，先想好采纳/拒绝

# 2. 合并（用 merge，不要 rebase——fork 历史已发布）
git merge upstream/main

# 3. 按第 3 节表格解决冲突；按第 4 节剔除推广内容

# 4. 全量校验（与 CI 一致）
pnpm install --frozen-lockfile
pnpm lint && pnpm type-check && pnpm test
DB_TYPE=sqlite SQLITE_PATH=":memory:" pnpm build

# 5. 确认推广内容未混入
grep -ri launchai src/ messages/ README.md

# 6. 合并提交写明采纳/拒绝了什么；用户可见变化写入 CHANGELOG.md [Unreleased]
```

**本地环境备注**：`.agents/`、`agent/`、`data/` 是 gitignored 的 AI 工具目录，其中的脚本可能触发 `pnpm lint` / `pnpm type-check` 报错（如 prefer-const、TS5097）。CI 全新检出看不到这些目录，属本地噪音，勿据此类报错改动仓库代码。

## 7. 同步检查自动化

`.github/workflows/upstream-sync.yml` 每周一（UTC）自动运行：fetch 上游 → 统计领先提交数 → 若有新提交且不存在未关闭的提醒 issue，则自动创建「上游同步提醒」issue（附新提交清单与本手册链接）；无新提交时不产生任何动静。支持在 Actions 页面手动触发（workflow_dispatch）。

提醒 issue 依赖仓库的 Issues 功能：build-workbench/JadeAI 已于 2026-10-04 开启（GitHub fork 默认关闭 Issues；其他仓库复用本 workflow 前需在 Settings → General → Features 勾选 Issues，否则 `gh issue create` 会失败）。提醒正文由 `printf` 参数生成，上游提交信息即使含反引号等字符也只会按字面渲染，无命令注入风险。
