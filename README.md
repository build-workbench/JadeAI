<div align="center">

# JadeAI

**AI 驱动的简历与求职工作台**

拖拽编辑、AI 优化、版本历史、模拟面试、多格式导出，一站式完成简历制作与求职准备。

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org/)

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-222?logo=githubpages)](https://lessup.github.io/JadeAI)


[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed)](https://hub.docker.com/r/twwch/jadeai)
[![Powered by OrcaRouter](https://img.shields.io/badge/Powered_by-OrcaRouter-2563eb)](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17)


[更新日志](./changelog/)

</div>

---

> 仓库首页：https://lessup.github.io/JadeAI  
> GitHub Pages 只承载项目主页与说明文档；完整应用需要服务端运行环境来支持 API、认证、数据库和导出能力。

## JadeAI 是什么

JadeAI 是一个面向简历编辑、AI 优化和求职准备的全栈应用。它把传统“文档编辑器 + 模板网站 + AI 工具”的体验整合成一个工作流：

- 在可视化画布里拖拽、编辑、排序简历模块
- 用 AI 生成内容、润色经历、分析 JD、翻译简历、生成求职信
- 在模拟面试里按岗位要求练习，并生成评估报告
- 导出 PDF / DOCX / HTML / TXT / JSON，或生成分享链接

## 最近更新

### v0.5.0 · 桌面客户端首发
- **[桌面客户端](#桌面客户端)** 正式发布：macOS（Apple Silicon / Intel）与 Windows x64 安装包，零配置、无需账号、数据全在本机
- 客户端内置更新提示，可直接下载对应架构的安装包
- Web 与客户端统一发版：同一个 tag 同时产出 Docker 镜像与三平台安装包
- 修复导出功能在容器中运行一段时间后失效（#95）
- 简历子项支持上移 / 下移 / 在上方插入（#89，感谢 @Silas-Zhu）

### v0.3.4 · 主题色系统与配色切换
- 引入语义化 `--brand-*` CSS token，下线全站 60+ 文件硬编码 `pink-*`
- 用户菜单新增主题色切换器，三套预设：**薄荷**（默认）、**经典蓝**、**玫粉**
- SSR 安全的防闪烁初始化；老版本 `localStorage` 值自动迁移
- 简历主题编辑器新增「薄荷」预设
- 导出通道（PDF / HTML / DOCX）统一读取 `src/lib/brand-constants.ts`

## 核心能力

### 简历编辑

- **拖拽式编辑器**：模块、条目与顺序可直接调整
- **行内编辑**：点击任意字段，直接在画布上编辑
- **50 套模板**：覆盖通用、创意、技术、金融、学术等风格
- **主题定制**：颜色、字体、间距、页边距实时预览
- **Markdown 支持**：摘要、经历、项目等文本支持 Markdown 排版
- **撤销 / 重做**：完整编辑历史（最多 50 步）
- **自动保存**：可配置保存间隔（0.3s–5s），支持手动保存
- **多简历管理**：支持创建、复制、重命名、搜索和排序

### Markdown 格式支持

以下简历模块支持 Markdown 语法：

| 模块 | 支持字段 |
|------|---------|
| 个人简介（Summary） | 正文内容 |
| 工作经历 | 描述、亮点（Highlights） |
| 教育背景 | 亮点（Highlights） |
| 项目经历 | 描述、亮点（Highlights） |
| 自定义模块 | 描述 |
| 语言能力 | 描述 |
| GitHub | 描述 |

**支持的语法：**

```
**加粗文字**    → 粗体
`代码文字`      → 行内代码
- 列表项        → 无序列表
```

> 技能、证书、个人信息等字段暂不支持 Markdown。

### AI 求职能力

- **AI 聊天助手**：在编辑器中对话式修改简历
- **AI 生成简历**：根据职位、技能和经历快速生成初稿
- **AI 简历解析**：上传 PDF / 图片自动抽取内容
- **JD 匹配分析**：关键词匹配、ATS 分析与改进建议
- **语法与写作检查**：识别弱表达、语法问题与可优化内容
- **多语言翻译**：跨语言转换并保留技术术语
- **AI 求职信**：结合简历和 JD 生成定制求职信
- **灵活 AI 供应商**：支持 OpenAI、Anthropic 及任意兼容 OpenAI 的 API 端点（例如 [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17)，一个 Key 即可调用 200+ 模型）；用户在应用内自行配置密钥

### 版本与恢复

- **完整草稿级撤销 / 重做**：覆盖标题、模板、主题、语言和模块内容
- **本地版本历史**：自动保存后保留浏览器本地版本记录
- **历史恢复**：可以从本地版本列表中恢复到先前状态

### 模拟面试

- **基于 JD 的面试模拟**：按岗位描述生成面试流程
- **多角色面试官**：HR、技术、行为、项目深挖、Leader 等
- **自定义面试官**：创建自定义面试官，设定考察维度和风格
- **追问与提示**：根据回答质量动态追问
- **面试控制**：跳过问题、请求提示、标记复习、暂停 / 继续
- **面试报告**：评分、维度分析、建议与导出（支持 PDF 与 Markdown）
- **历史对比**：追踪评分趋势和能力维度变化

### 导出与分享

- **多格式导出**：PDF、智能一页 PDF、DOCX、HTML、TXT、JSON
- **JSON 导入**：可恢复现有简历或创建新简历
- **分享链接**：支持密码保护与访问统计
- **浏览统计**：追踪分享简历的查看次数
- **本地 PDF 渲染依赖**：优先使用系统 Chrome / Chromium。生产环境建议设置 `CHROME_PATH` 指向已安装的浏览器；如确实需要运行时下载 bundled Chromium，必须显式设置 `ALLOW_CHROMIUM_DOWNLOAD=true`。
- **PDF 分页引擎**：`fit-one-page` 与 `prevent-blank-page` 现在共用同一个分页策略入口，并可在 `node --import tsx scripts/benchmark-pdf-layout.ts` 中输出分页 telemetry，便于比较不同渲染引擎与压缩效果。

### 简历管理

- **多简历仪表盘**：网格和列表视图、搜索、排序（按日期、名称）
- **JSON 导入创建**：在仪表盘直接通过 JSON 文件创建新简历
- **复制与重命名**：快捷简历管理操作
- **新手引导**：交互式分步引导，帮助新用户快速上手

### 其他

- **双语界面**：完整的中文（zh）和英文（en）界面
- **暗色模式**：浅色、深色、跟随系统三种主题
- **灵活认证**：Google OAuth 或浏览器指纹（零配置即用）
- **本地 SQLite 存储**：零配置的文件型数据库

## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | Next.js 16、React 19、Tailwind CSS 4、shadcn/ui、Radix UI |
| 状态管理 | Zustand |
| AI | Vercel AI SDK v6、OpenAI、Anthropic |
| 数据库 | Drizzle ORM、SQLite / PostgreSQL |
| 认证 | NextAuth.js v5、FingerprintJS |
| 导出 | Puppeteer Core、Chromium、DOCX |
| 国际化 | next-intl |

## 桌面客户端

**欢迎试用桌面客户端** —— 不用部署、不用注册、不用联网，下载装上就能写简历。

[![下载客户端](https://img.shields.io/badge/下载客户端-macOS%20%7C%20Windows-2ea44f?style=for-the-badge)](https://github.com/LingyiChen-AI/JadeAI/releases/latest)

它跑的是和 Web 版**完全相同**的应用——50 套模板、AI 润色、JD 匹配、模拟面试、多格式导出，一个都不少。区别只在于服务跑在你自己的电脑上：

- **零配置** —— 装完打开就能用，不需要 Docker、不需要数据库、不需要 `AUTH_SECRET`
- **不需要账号** —— 本机单用户，没有登录，没有指纹识别
- **数据只在本机** —— 简历存在你电脑上的一个 SQLite 文件里，不经过任何服务器
- **AI 用你自己的 Key** —— 在应用内「设置 → AI」里填，请求直连你配置的服务商
- **自动提示更新** —— 有新版时右下角弹个小条，点一下就下载好对应你机器的安装包

> 唯一的对外网络请求是启动时问 GitHub 有没有新版本，可以关掉（见下文「更新」）。

### 下载

从 **[最新 Release](https://github.com/LingyiChen-AI/JadeAI/releases/latest)** 下载对应你系统的包：

| 平台 | 文件 |
|---|---|
| macOS（Apple Silicon，M 系列芯片） | `JadeAI-*-mac-arm64.dmg` |
| macOS（Intel） | `JadeAI-*-mac-x64.dmg` |
| Windows（x64） | `JadeAI-*-win-x64-setup.exe` |

### 首次打开

安装包带的是 **ad-hoc 签名**——有效，但匿名。没有 Apple Developer ID，也没有公证，所以系统会拦下第一次启动。这是预期行为。

**macOS。** 在终端跑一次这条，然后正常双击打开：

```bash
xattr -dr com.apple.quarantine /Applications/JadeAI.app
```

也可以走图形界面：被拦下后打开 **系统设置 → 隐私与安全性**，拉到底点**仍要打开**。

> 不要依赖“右键 → 打开”。macOS 15 起 Apple 移除了这个绕过方式，对未公证的应用不再生效。

如果提示的是 **“JadeAI 已损坏，无法打开”** 而不是“无法验证”，说明下载不完整或文件被改动过，重新下载即可。正常构建的版本提示的是“无法验证”，那个是可以放行的。

**Windows。** SmartScreen 提示时点**更多信息 → 仍要运行**。

### 数据存在哪

| 平台 | 路径 |
|---|---|
| macOS | `~/Library/Application Support/JadeAI/` |
| Windows | `%APPDATA%\JadeAI\` |

`jade.db` 是 SQLite 数据库，`jade-settings.json` 存窗口状态和偏好。**卸载应用不会删除它们**，要清空数据请手动删除该目录。

### 更新

启动时应用会向 GitHub 查一次有没有新版本。有的话会在窗口右下角出现一个小提示条——不是弹窗——点「立即下载」它会**自动下载匹配你这台机器的那个安装包**，不用在三个文件里挑。进度显示在提示条里，下完可以直接打开安装包或在文件夹中显示。提示条可以收起、关闭，或者对这个版本不再提示。

到此为止：安装仍需你手动完成（拖进「应用程序」，或运行 `.exe`）。静默安装要走 Squirrel，而它不接受 ad-hoc 签名的应用。更新不影响本机数据。

**这是本应用唯一的对外网络请求。** 想关掉的话，在上面那个目录的 `jade-settings.json` 里设 `"updateCheckEnabled": false`，然后重启。

## 快速开始

### Docker（推荐）

```bash
cp .env.example .env.local
# 至少设置 AUTH_SECRET；如需容器内直接启用 AI，设置 OPENAI_API_KEY / ANTHROPIC_API_KEY / GOOGLE_GENERATIVE_AI_API_KEY

pnpm docker:run
```

默认会：

- 按 `package.json` 的版本号构建 `jadeai-local:v<version>` 与 `jadeai-local:latest`
- 使用名为 `jadeai-data` 的 Docker volume 持久化 SQLite 数据
- 在本机 `3003` 端口启动容器，访问 [http://localhost:3003](http://localhost:3003)

如果你想只构建镜像，不启动容器：

```bash
pnpm docker:build
```

如果你想在发布前做一次完整但可选的容器冒烟检查：

```bash
pnpm docker:smoke
```

该命令会构建镜像、使用临时 Docker volume 启动容器，并检查应用可访问、SQLite 数据库已创建、Chromium 可执行以及 `/api/ai/models` API 可达。它不会并入 `pnpm release:check`，因此不会拖慢常规发布检查。

> **AI 配置：** 无需服务端 AI 环境变量。每位用户在应用内的 **设置 > AI** 中自行配置 API Key、Base URL 和模型。还没有模型密钥的话，[OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) 一个 Key 就能调用 200+ 模型，详见 [AI 模型配置](#ai-模型配置)。

镜像现在基于 Debian slim 构建，而不是 Alpine，这样安装 Chromium 与 CJK / Emoji 字体时不会再依赖 `apk`，能规避部分代理环境下的 TLS / 超时问题。

如果你在中国大陆构建时遇到 `apt-get install chromium fonts-noto-cjk fonts-noto-color-emoji` 下载中断、`unexpected EOF` 或 `Connection failed`，可以显式指定 Debian 镜像源：

```bash
DEBIAN_MIRROR=http://mirrors.tuna.tsinghua.edu.cn/debian \
DEBIAN_SECURITY_MIRROR=http://mirrors.tuna.tsinghua.edu.cn/debian-security \
pnpm docker:build
```

如果你的网络对国际站点“可访问但不稳定”，建议直接在构建时启用代理（脚本已支持透传大小写两套代理变量）：

```bash
HTTP_PROXY=http://127.0.0.1:7890 \
HTTPS_PROXY=http://127.0.0.1:7890 \
NO_PROXY=127.0.0.1,localhost \
pnpm docker:build
```

如果你使用的是本机 SOCKS5 代理（例如 `socks5://127.0.0.1:10808`），可以直接这样传入，脚本会自动改写为容器可访问地址（`host.docker.internal`）并自动注入 `--add-host host.docker.internal:host-gateway`：

```bash
HTTP_PROXY=socks5://127.0.0.1:10808 \
HTTPS_PROXY=socks5://127.0.0.1:10808 \
NO_PROXY=127.0.0.1,localhost \
pnpm docker:build
```

如果仍然会在大包（如 `chromium` / `fonts-noto-cjk`）阶段失败，可临时跳过系统 Chromium 安装，让镜像先构建成功（仅建议排障时使用，不建议作为生产默认方案）：

```bash
INSTALL_CHROMIUM=false \
INSTALL_CJK_FONTS=false \
ALLOW_CHROMIUM_DOWNLOAD=true \
pnpm docker:build
```

以上参数含义：

- `INSTALL_CHROMIUM=false`：跳过 `apt install chromium`
- `INSTALL_CJK_FONTS=false`：跳过 `fonts-noto-cjk`（会影响 CJK PDF 字体完整性）
- `ALLOW_CHROMIUM_DOWNLOAD=true`：运行时允许回退到 bundled Chromium 下载

`docker:run`、`docker:publish`、`docker:smoke` 同样支持 `DEBIAN_MIRROR` / `DEBIAN_SECURITY_MIRROR`、代理变量（`HTTP_PROXY` / `HTTPS_PROXY` / `NO_PROXY` 与小写形式）以及上述 3 个开关；Dockerfile 也内置了更激进的 apt 重试与超时配置。

默认值是 `INSTALL_CHROMIUM=true`、`INSTALL_CJK_FONTS=true`、`ALLOW_CHROMIUM_DOWNLOAD=false`，即默认优先构建期安装系统 Chromium，不依赖运行时首次下载。

如果你想改为宿主机目录持久化数据库：

```bash
DATA_DIR="$(pwd)/jadeai-data" pnpm docker:run
```

> `AUTH_SECRET` 是必填项，可使用 `openssl rand -base64 32` 生成。
>
> 如果你希望容器启动后所有用户都能直接使用 AI，而不是分别在浏览器里填写 Key，请在 `.env.local` 里配置服务端 AI 环境变量，例如：
>
> ```bash
> AI_PROVIDER=openai
> OPENAI_API_KEY=sk-...
> AI_MODEL=gpt-4o
> ```
>
> 也支持 `ANTHROPIC_API_KEY` 与 `GOOGLE_GENERATIVE_AI_API_KEY`；若未设置 `AI_PROVIDER`，应用会自动选择第一个已配置的服务端模型提供商。
>
> 镜像内应用默认以非 root 用户运行；如果你使用 `DATA_DIR=...` 绑定宿主机目录并遇到 SQLite 权限问题，请确保该目录对容器内 uid `1000` 可写。

### Docker Hub 发布与版本号规范

Docker 镜像版本现在统一以 `package.json` 的 `version` 为唯一来源：

- Git tag / Release note / Docker tag 统一使用 `v<version>`，例如 `v0.3.7`
- 发布脚本会同时推送 `v<version>`、`<version>`，稳定版本额外推送 `latest`
- 预发布版本（如 `0.4.0-rc.1`）不会覆盖 `latest`

建议发布流程：

```bash
pnpm version patch --no-git-tag-version
# 然后补一份 changelog/YYYY-MM-DD-vX.Y.Z-release.md

pnpm release:check
docker login
IMAGE_REPOSITORY=shuai0/jadeai pnpm docker:publish
```

发布脚本默认使用 `docker buildx` 生成 `linux/amd64,linux/arm64` 多架构镜像；如需先本地演练，可执行：

```bash
PUSH=false PLATFORMS=linux/amd64 IMAGE_REPOSITORY=shuai0/jadeai pnpm docker:publish
```

### 本地开发

```bash
git clone https://github.com/LessUp/JadeAI.git
cd JadeAI

pnpm install
cp .env.example .env.local
```

#### 配置环境变量

编辑 `.env.local`：

```bash
# 认证（默认指纹模式，无需额外配置）
AUTH_ENABLED=false
```

> **AI 配置：** 无需服务端环境变量。每位用户在应用内的 **设置 > AI** 中自行配置 API Key、Base URL 和模型。用 [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) 一个 Key 调用 200+ 模型的方式见 [AI 模型配置](#ai-模型配置)。

查看 `.env.example` 了解所有可用选项（Google OAuth、自定义 SQLite 路径等）。

#### 初始化数据库并启动

```bash
# 生成并执行迁移

pnpm db:generate
pnpm db:migrate
pnpm dev
```

默认数据库为 SQLite；如需 PostgreSQL，请在 `.env.local` 中设置：

```bash
DB_TYPE=postgresql
DATABASE_URL=postgresql://user:pass@host:5432/jadeai
```

## 部署视频

在 Bilibili 观看完整部署教程：

[![部署视频](https://i0.hdslb.com/bfs/archive/deployment-preview.jpg)](https://www.bilibili.com/video/BV1h7wQzSEYe/)

> [前往 Bilibili 观看 →](https://www.bilibili.com/video/BV1h7wQzSEYe/)

## AI 模型配置

所有 AI 功能（对话、简历生成、JD 匹配、模拟面试、翻译……）都需要一个 API Key。JadeAI 不在服务端保存密钥——你在应用内的 **设置 > AI** 中填写，密钥只存在浏览器的 localStorage 里。

任何兼容 OpenAI 协议的端点都能用：OpenAI、Anthropic、自建网关，或者模型路由服务。

### 使用 OrcaRouter（一个 Key 调用 200+ 模型）

[OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) 是一个兼容 OpenAI 协议的 AI 网关：一个 Key 即可调用 200+ 模型（OpenAI、Anthropic、Gemini、DeepSeek、Qwen 等），按供应商原价计费、不加价，并在供应商故障时自动切换。适合不想逐家注册、或者想在 JadeAI 里随时换模型又不用换 Key 的场景。

1. 在 [orcarouter.ai](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) 注册（有免费额度，无需信用卡），创建一个 API Key。
2. 打开 JadeAI 的 **设置 > AI**，填写：

| 配置项 | 填写内容 |
|--------|----------|
| Base URL | `https://api.orcarouter.ai/v1` |
| API Key | 你的 OrcaRouter 密钥（`sk-...`） |
| 模型 | [模型列表](https://www.orcarouter.ai/models)中的任意模型 ID |

3. 保存后即可在编辑器里使用所有 AI 功能。

如果想直连 OpenAI 或 Anthropic，在同一个面板里换成对应的 Base URL、Key 和模型 ID 即可。

## 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `AUTH_SECRET` | 是 | — | 会话加密密钥 |
| `SQLITE_PATH` | 否 | `./data/jade.db` | SQLite 数据库文件路径 |
| `AUTH_ENABLED` | 否 | `false` | 启用 Google OAuth（`true`）或使用指纹模式（`false`） |
| `JADE_RUNTIME` | 否 | — | 设为 `desktop` 时切换到单本地用户模式（跳过指纹与 NextAuth，数据库只有一个 id 为 `local` 的用户） |
| `GOOGLE_CLIENT_ID` | OAuth 时 | — | Google OAuth 客户端 ID |
| `GOOGLE_CLIENT_SECRET` | OAuth 时 | — | Google OAuth 客户端密钥 |
| `APP_NAME` | 否 | `JadeAI` | 应用显示名称 |
| `DEFAULT_LOCALE` | 否 | `zh` | 默认语言：`zh` 或 `en` |

## 项目结构

```
src/
├── app/                        # Next.js App Router
│   ├── [locale]/               # 国际化路由 (/zh/..., /en/...)
│   │   ├── dashboard/          # 简历列表与管理
│   │   ├── editor/[id]/        # 简历编辑器
│   │   ├── preview/[id]/       # 全屏预览
│   │   ├── templates/          # 模板画廊
│   │   └── share/[token]/      # 公开分享简历查看
│   └── api/
│       ├── ai/                 # AI 接口
│       │   ├── chat/           #   流式对话 + 工具调用
│       │   ├── generate-resume/#   AI 生成简历
│       │   ├── jd-analysis/    #   JD 匹配分析
│       │   ├── grammar-check/  #   语法与写作检查
│       │   ├── cover-letter/   #   求职信生成
│       │   ├── translate/      #   简历翻译
│       │   └── models/         #   可用 AI 模型列表
│       ├── resume/             # 简历 CRUD、导出、解析、分享
│       ├── share/              # 公开分享访问
│       ├── user/               # 用户信息与设置
│       └── auth/               # NextAuth 认证
├── components/
│   ├── ui/                     # shadcn/ui 基础组件
│   ├── editor/                 # 编辑器画布、区块、字段、弹窗
│   ├── ai/                     # AI 对话面板与气泡
│   ├── preview/templates/      # 50 套简历模板
│   ├── dashboard/              # 仪表盘卡片、网格、弹窗
│   └── layout/                 # 头部、主题、语言切换
├── lib/
│   ├── db/                     # Schema、仓库、迁移、适配器
│   ├── auth/                   # 认证配置
│   └── ai/                     # AI 提示词、工具、模型配置
├── hooks/                      # 自定义 React Hooks（7 个）
├── stores/                     # Zustand 状态仓库（简历、编辑器、设置、UI、引导）
└── types/                      # TypeScript 类型定义
```

数据库选择规则：

| 配置 | 结果 |
|---|---|
| `DB_TYPE=postgresql` + `DATABASE_URL` | 使用 PostgreSQL |
| 未设置 `DB_TYPE`，但设置了 `DATABASE_URL` | 使用 PostgreSQL，并输出提示要求显式设置 `DB_TYPE=postgresql` |
| `DB_TYPE=sqlite` | 使用 SQLite；如同时设置 `DATABASE_URL`，会提示该 URL 被忽略 |
| 生产环境未设置 `DB_TYPE` 且无 `DATABASE_URL` | 为兼容已有安装继续使用 SQLite，并输出提示 |

## 常用命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查 |
| `pnpm db:generate` | 生成 SQLite 迁移 |
| `pnpm db:generate:pg` | 生成 PostgreSQL 迁移 |
| `pnpm db:migrate` | 执行迁移 |
| `pnpm db:seed` | 填充示例数据 |

## 截图

| 模板画廊 | 简历编辑器 |
|:---:|:---:|
| ![模板画廊](images/template-list.png) | ![简历编辑器](images/resume-edit.png) |

| AI 优化 | JD 匹配分析 |
|:---:|:---:|
| ![AI 优化](images/ai%20优化.png) | ![JD 匹配分析](images/JD%20匹配分析.png) |

| 模拟面试 | 面试报告 |
|:---:|:---:|
| ![模拟面试](images/模拟面试.png) | ![面试报告](images/面试报告.png) |

## 文档与发布记录

- 版本更新请查看 [`changelog/`](./changelog/)
- 架构说明请查看 [`ARCHITECTURE.md`](./ARCHITECTURE.md)
- 功能想法请查看 [`FEATURE-IDEAS.md`](./FEATURE-IDEAS.md)

## 社区

- [Linux.do](https://linux.do/)

---

如果你想把 JadeAI 部署到自己的服务器，建议先用本地 Docker 流程验证，再迁移到正式环境。

## 参与贡献

欢迎贡献代码！请按照以下步骤：

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feat/your-feature`
3. 提交更改：`git commit -m 'feat: add your feature'`
4. 推送分支：`git push origin feat/your-feature`
5. 提交 Pull Request

## 常见问题

<details>
<summary><b>AI 配置是如何工作的？</b></summary>

JadeAI 不需要在服务端配置 AI API 密钥。每位用户在应用内的 **设置 > AI** 中自行配置 AI 供应商（OpenAI、Anthropic 或任意兼容 OpenAI 协议的端点）、API Key 和模型。API 密钥仅存储在浏览器的 localStorage 中，不会发送到服务端存储。

想用一个 Key 覆盖 200+ 模型，可以用 [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17)，Base URL 填 `https://api.orcarouter.ai/v1`。完整步骤见 [AI 模型配置](#ai-模型配置)。

</details>

<details>
<summary><b>不使用 OAuth 时认证如何工作？</b></summary>

当 `AUTH_ENABLED=false`（默认）时，JadeAI 使用 FingerprintJS 进行浏览器指纹识别。系统为每个浏览器生成唯一的指纹 ID 作为用户标识。无需登录界面 — 用户可以直接开始创建简历。

</details>

<details>
<summary><b>PDF 导出是如何实现的？</b></summary>

PDF 导出使用 Puppeteer Core + @sparticuz/chromium。50 套模板各有独立的服务端导出处理器，将简历渲染为高保真 PDF。同时支持 DOCX、HTML、TXT 和 JSON 格式导出。

</details>

## Star History

<a href="https://www.star-history.com/?repos=LingyiChen-AI%2FJadeAI&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=LingyiChen-AI/JadeAI&type=date&theme=dark&legend=top-left&sealed_token=LemjPqjrjM3gQ-PUAAFWkzoN8CiA06qE0dBVrf0gWA53oH1U0deeDwrP9rzreUm25934qefo8M1gzGe0kYTl1nrj60_Y_NLxCg4rXOXKtduiRyu2LO1qZA" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=LingyiChen-AI/JadeAI&type=date&legend=top-left&sealed_token=LemjPqjrjM3gQ-PUAAFWkzoN8CiA06qE0dBVrf0gWA53oH1U0deeDwrP9rzreUm25934qefo8M1gzGe0kYTl1nrj60_Y_NLxCg4rXOXKtduiRyu2LO1qZA" />
    <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=LingyiChen-AI/JadeAI&type=date&legend=top-left&sealed_token=LemjPqjrjM3gQ-PUAAFWkzoN8CiA06qE0dBVrf0gWA53oH1U0deeDwrP9rzreUm25934qefo8M1gzGe0kYTl1nrj60_Y_NLxCg4rXOXKtduiRyu2LO1qZA" />
  </picture>
</a>

## 许可证

[Apache License 2.0](LICENSE)
