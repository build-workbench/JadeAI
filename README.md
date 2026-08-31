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


[English](./README.en.md) · [更新日志](./changelog/)

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

## 核心能力


### 简历编辑


### v0.5.0 · Desktop Client
- **[Desktop client](#desktop-client)** released: macOS (Apple Silicon / Intel)
  and Windows x64 installers — zero config, no account, data stays local
- Built-in update notice that downloads the installer for your machine
- Web and desktop now ship together: one tag produces both the Docker image and
  all three installers
- Fixed PDF export failing after the container had been up for a while (#95)
- Resume items can be moved up/down and inserted above (#89, thanks @Silas-Zhu)

### v0.3.4 · Brand Color System & Theme Switching
- Introduced semantic `--brand-*` CSS tokens; replaced hardcoded `pink-*` across 60+ files
- New brand switcher in the user menu with three presets: **Mint** (default), **Blue**, **Pink**
- SSR-safe anti-flicker hydration; legacy values auto-migrated via `localStorage`
- Added a Mint resume preset to the theme editor
- Export pipelines (PDF / HTML / DOCX) now read from `src/lib/brand-constants.ts`


- **拖拽式编辑器**：模块、条目与顺序可直接调整
- **50 套模板**：覆盖通用、创意、技术、金融、学术等风格
- **主题定制**：颜色、字体、间距、页边距实时预览
- **Markdown 支持**：摘要、经历、项目等文本支持 Markdown 排版
- **多简历管理**：支持创建、复制、重命名、搜索和排序

### AI 求职能力

- **AI 聊天助手**：在编辑器中对话式修改简历
- **AI 生成简历**：根据职位、技能和经历快速生成初稿
- **AI 简历解析**：上传 PDF / 图片自动抽取内容
- **JD 匹配分析**：关键词匹配、ATS 分析与改进建议
- **语法与写作检查**：识别弱表达、语法问题与可优化内容
- **多语言翻译**：跨语言转换并保留技术术语
- **AI 求职信**：结合简历和 JD 生成定制求职信

### 版本与恢复

- **完整草稿级撤销 / 重做**：覆盖标题、模板、主题、语言和模块内容
- **本地版本历史**：自动保存后保留浏览器本地版本记录
- **历史恢复**：可以从本地版本列表中恢复到先前状态

### 模拟面试

- **基于 JD 的面试模拟**：按岗位描述生成面试流程
- **多角色面试官**：HR、技术、行为、项目深挖、Leader 等
- **追问与提示**：根据回答质量动态追问
- **面试报告**：评分、维度分析、建议与导出

### 导出与分享

- **多格式导出**：PDF、智能一页 PDF、DOCX、HTML、TXT、JSON
- **JSON 导入**：可恢复现有简历或创建新简历
- **分享链接**：支持密码保护与访问统计
- **本地 PDF 渲染依赖**：优先使用系统 Chrome / Chromium。生产环境建议设置 `CHROME_PATH` 指向已安装的浏览器；如确实需要运行时下载 bundled Chromium，必须显式设置 `ALLOW_CHROMIUM_DOWNLOAD=true`。
- **PDF 分页引擎**：`fit-one-page` 与 `prevent-blank-page` 现在共用同一个分页策略入口，并可在 `node --import tsx scripts/benchmark-pdf-layout.ts` 中输出分页 telemetry，便于比较不同渲染引擎与压缩效果。

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

## 快速开始


### Docker（推荐）


| Interview List | Interview Report |
|:---:|:---:|
| ![Interview List](images/面试列表.png) | ![Interview Report](images/面试报告.png) |

## Deployment Video

Watch the full deployment walkthrough on Bilibili:

[![Deployment Video](https://i0.hdslb.com/bfs/archive/deployment-preview.jpg)](https://www.bilibili.com/video/BV1h7wQzSEYe/)

> [Watch on Bilibili →](https://www.bilibili.com/video/BV1h7wQzSEYe/)

## Features

### Resume Editing

- **Drag & Drop Editor** — Visually arrange and reorder resume sections and items
- **Inline Editing** — Click any field to edit directly on the canvas
- **50 Professional Templates** — Classic, Modern, Minimal, Creative, ATS-Friendly, Timeline, Nordic, Swiss, and more
- **Theme Customization** — Colors, fonts, spacing, and margins with live preview
- **Undo / Redo** — Full edit history (up to 50 steps)
- **Auto Save** — Configurable interval (0.3s–5s), with manual save option
- **Markdown Support** — Use Markdown syntax in text fields to format content (e.g., `**bold**` for **bold text**)

### Markdown Formatting

The following resume sections support Markdown syntax:

| Section | Supported Fields |
|---------|-----------------|
| Summary | Content text |
| Work Experience | Description, Highlights |
| Education | Highlights |
| Projects | Description, Highlights |
| Custom Section | Description |
| Languages | Description |
| GitHub | Description |

**Supported syntax:**

```
**bold text**    → bold
`code text`      → inline code
- item           → bullet list
```

> Skills, Certifications, and Personal Info fields do not support Markdown.

### AI Capabilities

- **AI Chat Assistant** — Conversational AI integrated in the editor, with multi-session support and persistent history
- **AI Resume Generation** — Generate a complete resume from job title, experience, and skills
- **Resume Parsing** — Upload an existing PDF or image, AI extracts all content automatically
- **JD Match Analysis** — Compare resume against a job description: keyword matching, ATS score, and improvement suggestions
- **Cover Letter Generation** — AI-tailored cover letter based on resume and JD, with tone selection (formal / friendly / confident)
- **Grammar & Writing Check** — Detect weak verbs, vague descriptions, and grammar issues; returns a quality score
- **Translation** — Translate resume content across 10 languages while preserving technical terms
- **Flexible AI Provider** — Supports OpenAI, Anthropic, and any OpenAI-compatible endpoint (such as [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17), which exposes 200+ models behind one key); each user configures their own key in-app

### Mock Interview

- **JD-Based Interview Simulation** — Paste a job description, AI plays different interviewer roles in sequence
- **6 Preset Interviewers** — HR, Technical, Scenario, Behavioral, Project Deep Dive, Leader — each with unique personality and questioning style
- **Custom Interviewers** — Create your own interviewer with custom focus areas and style
- **Smart Follow-ups** — AI adapts questions based on answer quality, probing deeper when needed
- **Interview Controls** — Skip questions, request hints, mark for review, pause/resume
- **Detailed Report** — Per-question scoring, competency radar chart, improvement plan with resources
- **History Comparison** — Track score trends and dimension progress across interviews
- **PDF & Markdown Export** — Export interview reports for offline review

### Export & Sharing

- **Multi-Format Export** — PDF (Puppeteer + Chromium), Smart One-Page PDF (auto-fit to single page), DOCX, HTML, TXT, JSON
- **JSON Import** — Import a previously exported JSON file to restore or create a resume; supported both in the editor (overwrite current) and on the dashboard (create new)
- **Link Sharing** — Token-based shareable links with optional password protection
- **View Counter** — Track how many times a shared resume has been viewed

### Management

- **Multi-Resume Dashboard** — Grid and list views, search, sort (by date, name)
- **Import from JSON** — Create a new resume from a JSON export directly on the dashboard
- **Duplicate & Rename** — Quick resume management actions
- **Interactive Tours** — Step-by-step onboarding for first-time users

### Other

- **Bilingual UI** — Full Chinese (zh) and English (en) interface
- **Dark Mode** — Light, dark, and system theme support
- **Flexible Auth** — Google OAuth or browser fingerprint (zero-config)
- **Local SQLite Storage** — Zero-config, file-based database

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Drag & Drop | @dnd-kit |
| State | Zustand |
| Database | Drizzle ORM (SQLite) |
| Auth | NextAuth.js v5 + FingerprintJS |
| AI | Vercel AI SDK v6 + OpenAI / Anthropic |
| PDF | Puppeteer Core + @sparticuz/chromium |
| i18n | next-intl |
| Validation | Zod v4 |

## Desktop Client

**Try the desktop app** — nothing to deploy, no account, no network. Download,
install, start writing.

[![Download](https://img.shields.io/badge/Download-macOS%20%7C%20Windows-2ea44f?style=for-the-badge)](https://github.com/LingyiChen-AI/JadeAI/releases/latest)

It runs the **same** application as the web version — all 50 templates, AI
polish, JD matching, mock interviews, every export format. The difference is
only where it runs:

- **Zero config** — no Docker, no database, no `AUTH_SECRET`. Install and open.
- **No account** — one local user, no sign-in, no fingerprinting
- **Your data stays put** — resumes live in a SQLite file on your machine and
  never reach a server
- **Your own AI key** — set it in Settings → AI; requests go straight to the
  provider you configured
- **Update notices** — a small panel appears when a new version is out and
  downloads the installer built for your machine

> The only outbound request it makes is asking GitHub whether a newer version
> exists, and that can be turned off (see Updates below).

### Download

Grab the build for your system from the **[latest release](https://github.com/LingyiChen-AI/JadeAI/releases/latest)**:

| Platform | File |
|---|---|
| macOS (Apple Silicon) | `JadeAI-*-mac-arm64.dmg` |
| macOS (Intel) | `JadeAI-*-mac-x64.dmg` |
| Windows (x64) | `JadeAI-*-win-x64-setup.exe` |

### First launch

The installers carry an **ad-hoc signature** — valid, but anonymous. There is no
Apple Developer ID and no notarization, so the OS blocks the first launch. This
is expected.

**macOS.** Run this once, then open the app normally:

```bash
xattr -dr com.apple.quarantine /Applications/JadeAI.app
```

Or via the GUI: after the launch is blocked, open **System Settings → Privacy &
Security** and click **Open Anyway** near the bottom.

> Do not rely on right-click → Open. macOS 15 removed that bypass for
> un-notarized apps; it no longer does anything.

If you see **"JadeAI is damaged and can't be opened"** rather than "cannot be
verified", the download is incomplete or was tampered with — re-download it.
A correctly built release reports "cannot be verified", which is clearable.

**Windows.** On the SmartScreen prompt, click **More info → Run anyway**.

### Where your data lives

| Platform | Path |
|---|---|
| macOS | `~/Library/Application Support/JadeAI/` |
| Windows | `%APPDATA%\JadeAI\` |

`jade.db` is the SQLite database; `jade-settings.json` holds window state and
preferences. Uninstalling the app does not delete either — remove the folder to
erase your data.

### Updates

On launch the app asks GitHub once whether a newer version exists. If
there is one, a small panel appears in the corner of the window — not a modal
dialog — offering to **download the installer built for your machine**, so you
don't pick between three files. Progress shows in the panel; when it finishes
you can open the installer or reveal it in your file manager. It can be
collapsed, dismissed, or silenced for that version.

It stops there: installing is still a manual step (drag to Applications, or run
the `.exe`). Silent install would need Squirrel, which refuses an ad-hoc signed
app. Your data is untouched by an update.

**This is the only outbound request the app makes.** To turn it off, set
`"updateCheckEnabled": false` in `jade-settings.json` (see the paths above) and
restart.

## Getting Started

### Docker (Recommended)


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


> **AI Configuration:** No server-side AI env vars needed. Each user configures their own API Key, Base URL, and Model in **Settings > AI** within the app. If you don't have a provider key yet, [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) gives you 200+ models through a single OpenAI-compatible endpoint — see [AI provider setup](#ai-provider-setup).

<details>
<summary>With Google OAuth</summary>


```bash
pnpm docker:smoke
```

该命令会构建镜像、使用临时 Docker volume 启动容器，并检查应用可访问、SQLite 数据库已创建、Chromium 可执行以及 `/api/ai/models` API 可达。它不会并入 `pnpm release:check`，因此不会拖慢常规发布检查。

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

#### Configure Environment

Edit `.env.local`:

```bash
# Auth (defaults to fingerprint mode, no config needed)
AUTH_ENABLED=false
```

> **AI Configuration:** No server-side env vars needed. Each user configures their own API Key, Base URL, and Model in **Settings > AI** within the app. See [AI provider setup](#ai-provider-setup) for using [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) to access 200+ models with one key.

See `.env.example` for all available options (Google OAuth, custom SQLite path, etc.).

#### Initialize Database & Run

```bash
# Generate and run migrations

pnpm db:generate
pnpm db:migrate
pnpm dev
```

默认数据库为 SQLite；如需 PostgreSQL，请在 `.env.local` 中设置：


```bash
DB_TYPE=postgresql
DATABASE_URL=postgresql://user:pass@host:5432/jadeai


## AI Provider Setup

All AI features (chat, resume generation, JD matching, mock interview, translation…) need an API key. JadeAI never stores keys on the server — you fill them in under **Settings > AI** in the app, and they stay in your browser's local storage.

Any OpenAI-compatible endpoint works. Point it at OpenAI, Anthropic, a self-hosted gateway, or a router.

### Using OrcaRouter (200+ models, one key)

[OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) is an OpenAI-compatible AI gateway: one key gives you access to 200+ models (OpenAI, Anthropic, Gemini, DeepSeek, Qwen and more) at provider pricing with no per-token markup, plus automatic failover between providers. Handy if you'd rather not sign up with every vendor separately, or want to switch models inside JadeAI without swapping keys.

1. Register at [orcarouter.ai](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) (free tier, no credit card) and create an API key.
2. In JadeAI, open **Settings > AI** and fill in:

| Field | Value |
|-------|-------|
| Base URL | `https://api.orcarouter.ai/v1` |
| API Key | your OrcaRouter key (`sk-...`) |
| Model | any model ID from the [model list](https://www.orcarouter.ai/models) |

3. Save, then use any AI feature in the editor.

To use OpenAI or Anthropic directly instead, just fill in that provider's base URL, key, and model ID in the same panel.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTH_SECRET` | Yes | — | Secret key for session encryption |
| `SQLITE_PATH` | No | `./data/jade.db` | SQLite database file path |
| `AUTH_ENABLED` | No | `false` | Enable Google OAuth (`true`) or use fingerprint mode (`false`) |
| `JADE_RUNTIME` | No | — | Set to `desktop` for single local-user mode (skips fingerprint and NextAuth; the database has a single user with id `local`) |
| `GOOGLE_CLIENT_ID` | When OAuth | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | When OAuth | — | Google OAuth client secret |
| `APP_NAME` | No | `JadeAI` | Application display name |
| `DEFAULT_LOCALE` | No | `zh` | Default language: `zh` or `en` |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | TypeScript type checking |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Execute database migrations |
| `pnpm db:studio` | Open Drizzle Studio (database GUI) |
| `pnpm db:seed` | Seed database with sample data |

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── [locale]/               # i18n routes (/zh/..., /en/...)
│   │   ├── dashboard/          # Resume list & management
│   │   ├── editor/[id]/        # Resume editor
│   │   ├── preview/[id]/       # Full-screen preview
│   │   ├── templates/          # Template gallery
│   │   └── share/[token]/      # Public shared resume viewer
│   └── api/
│       ├── ai/                 # AI endpoints
│       │   ├── chat/           #   Streaming chat with tool calls
│       │   ├── generate-resume/#   AI resume generation
│       │   ├── jd-analysis/    #   JD match analysis
│       │   ├── grammar-check/  #   Grammar & writing check
│       │   ├── cover-letter/   #   Cover letter generation
│       │   ├── translate/      #   Resume translation
│       │   └── models/         #   List available AI models
│       ├── resume/             # Resume CRUD, export, parse, share
│       ├── share/              # Public share access
│       ├── user/               # User profile & settings
│       └── auth/               # NextAuth handlers
├── components/
│   ├── ui/                     # shadcn/ui base components
│   ├── editor/                 # Editor canvas, sections, fields, dialogs
│   ├── ai/                     # AI chat panel & bubble
│   ├── preview/templates/      # 50 resume templates
│   ├── dashboard/              # Dashboard cards, grid, dialogs
│   └── layout/                 # Header, theme provider, locale switcher
├── lib/
│   ├── db/                     # Schema, repositories, migrations, adapters
│   ├── auth/                   # Auth configuration
│   └── ai/                     # AI prompts, tools, model config
├── hooks/                      # Custom React hooks (7 hooks)
├── stores/                     # Zustand stores (resume, editor, settings, UI, tour)
└── types/                      # TypeScript type definitions

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


### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user` | Get current user profile |
| `PUT` | `/api/user` | Update user profile |
| `GET` | `/api/user/settings` | Get user settings |
| `PUT` | `/api/user/settings` | Update user settings |

</details>

## Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feat/your-feature`
5. Open a Pull Request

## FAQ

<details>
<summary><b>How does AI configuration work?</b></summary>

JadeAI does not require server-side AI API keys. Each user configures their own AI provider (OpenAI, Anthropic, or any OpenAI-compatible endpoint), API key, and model in **Settings > AI** within the app. API keys are stored in the browser's local storage and are never sent to the server for storage.

If you want a single key that covers 200+ models, use [OrcaRouter](https://www.orcarouter.ai/ref/ref_1f47b025a90949564e17) with Base URL `https://api.orcarouter.ai/v1`. Full steps in [AI provider setup](#ai-provider-setup).

</details>

<details>
<summary><b>How does authentication work without OAuth?</b></summary>

When `AUTH_ENABLED=false` (default), JadeAI uses browser fingerprinting via FingerprintJS. A unique fingerprint ID is generated for each browser and used as the user identifier. No login screen is shown — users can start building resumes immediately.

</details>

<details>
<summary><b>How is PDF export implemented?</b></summary>

PDF export uses Puppeteer Core with @sparticuz/chromium. Each of the 50 templates has a dedicated server-side export handler that renders the resume to high-fidelity PDF. DOCX, HTML, TXT, and JSON exports are also supported.

</details>

## Star History

<a href="https://www.star-history.com/?repos=LingyiChen-AI%2FJadeAI&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=LingyiChen-AI/JadeAI&type=date&theme=dark&legend=top-left&sealed_token=LemjPqjrjM3gQ-PUAAFWkzoN8CiA06qE0dBVrf0gWA53oH1U0deeDwrP9rzreUm25934qefo8M1gzGe0kYTl1nrj60_Y_NLxCg4rXOXKtduiRyu2LO1qZA" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=LingyiChen-AI/JadeAI&type=date&legend=top-left&sealed_token=LemjPqjrjM3gQ-PUAAFWkzoN8CiA06qE0dBVrf0gWA53oH1U0deeDwrP9rzreUm25934qefo8M1gzGe0kYTl1nrj60_Y_NLxCg4rXOXKtduiRyu2LO1qZA" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=LingyiChen-AI/JadeAI&type=date&legend=top-left&sealed_token=LemjPqjrjM3gQ-PUAAFWkzoN8CiA06qE0dBVrf0gWA53oH1U0deeDwrP9rzreUm25934qefo8M1gzGe0kYTl1nrj60_Y_NLxCg4rXOXKtduiRyu2LO1qZA" />
 </picture>
</a>

## License

[Apache License 2.0](LICENSE)

