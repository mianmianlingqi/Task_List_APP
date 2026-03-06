# 📋 待办任务清单（Task List APP）

> 一款基于 **Tauri 2.x + React 19 + TypeScript 5 + MUI 6 + Zustand 5** 的桌面端待办任务清单应用。  
> 原生窗口运行，无需浏览器，轻量高效。

---

## 📑 目录

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [前置条件](#-前置条件)
- [快速开始](#-快速开始)
- [开发指南](#-开发指南)
- [构建打包](#-构建打包)
- [项目结构](#-项目结构)
- [架构说明](#-架构说明)
- [环境变量](#-环境变量)
- [设计令牌](#-设计令牌)
- [许可证](#-许可证)

---

## ✨ 功能特性

| # | 功能 | 说明 |
|---|------|------|
| 1 | **任务 CRUD** | 创建、编辑、删除、查看任务 |
| 2 | **状态管理** | 待办 → 进行中 → 已完成 循环切换 |
| 3 | **优先级分级** | 高 / 中 / 低 三级，彩色图标区分 |
| 4 | **分类管理** | 自定义颜色分类，灵活归类任务 |
| 5 | **多维度过滤** | 按状态 / 优先级 / 分类 组合筛选 |
| 6 | **全局搜索** | 标题关键词搜索，300ms 防抖优化 |
| 7 | **排序功能** | 支持按创建时间 / 截止日期 / 优先级 / 标题排序 |
| 8 | **导入 / 导出** | JSON 格式，通过 Tauri 原生文件对话框完成 |
| 9 | **主题切换** | 暗色 / 亮色主题一键切换 |
| 10 | **本地持久化** | localStorage + Zustand persist，数据不丢失 |
| 11 | **清除已完成** | 批量清除所有已完成任务 |
| 12 | **到期提醒** | 截止日期高亮提示，避免遗漏 |

---

## 🛠 技术栈

| 层次 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 桌面框架 | [Tauri](https://v2.tauri.app/) | 2.x | Rust 后端 + WebView2 原生窗口 |
| 前端框架 | [React](https://react.dev/) | 19 | 声明式 UI 构建 |
| 类型系统 | [TypeScript](https://www.typescriptlang.org/) | 5 | 类型安全 |
| 构建工具 | [Vite](https://vitejs.dev/) | 6 | 闪电级 HMR 与打包 |
| UI 组件库 | [MUI (Material UI)](https://mui.com/) | 6 | 企业级 React 组件 |
| 状态管理 | [Zustand](https://zustand-demo.pmnd.rs/) | 5 | 极简状态管理 + persist 中间件 |
| 日期处理 | [dayjs](https://day.js.org/) | 1.x | 轻量日期库（中文本地化） |
| ID 生成 | [nanoid](https://github.com/ai/nanoid) | 5 | 短且安全的唯一 ID |
| 数据校验 | [Zod](https://zod.dev/) | 3 | 运行时类型校验 |
| 设计系统 | Design Tokens | — | 颜色 / 间距 / 圆角单一源头 |

---

## 📦 前置条件

在开始之前，请确保你的开发环境满足以下要求：

| 依赖 | 最低版本 | 说明 |
|------|---------|------|
| **Node.js** | >= 18 | 推荐使用 LTS 版本 |
| **Rust** | >= 1.70 | 通过 [rustup](https://rustup.rs/) 安装 |
| **Visual Studio 2022 Build Tools** | — | 需安装 **C++ 桌面开发** 工作负载 |
| **WebView2 Runtime** | — | Windows 10/11 通常已预装 |

> **提示**：可通过 `node -v`、`rustc --version` 快速检查版本。

---

## 🚀 快速开始

```powershell
# 1. 克隆项目
git clone <仓库地址>
cd Task_List_APP

# 2. 安装前端依赖
npm install

# 3. 启动 Tauri 开发模式（自动启动前端 + 编译 Rust + 打开原生窗口）
npx tauri dev
```

应用窗口将以 **960×720** 居中弹出，标题栏显示「待办任务清单」。

---

## 🔧 开发指南

### 环境配置（Windows）

Tauri 2.x 在 Windows 上依赖 MSVC 链接器。如果遇到编译错误，需先加载 MSVC 环境：

```powershell
# 方式一：在当前 PowerShell 加载 MSVC 环境后再运行
cmd /c "`"C:\Program Files (x86)\Microsoft Visual Studio\2022\BuildTools\VC\Auxiliary\Build\vcvars64.bat`" >nul 2>&1 && npx tauri dev"
```

如果开发环境需要代理，可提前设置：

```powershell
$env:HTTP_PROXY  = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

### 常用命令

| 命令 | 说明 |
|------|------|
| `npx tauri dev` | 启动完整的 Tauri 开发环境（前端 + 桌面窗口） |
| `npx tauri build` | 编译并打包为可分发的安装包 |
| `npm run dev` | 仅启动前端开发服务器（端口 `1420`） |
| `npm run build` | 仅构建前端产物到 `dist/` |
| `npm run preview` | 本地预览前端构建产物 |

### 清理重建

如果 Rust 编译缓存损坏，可清除后重试：

```powershell
Remove-Item -Recurse -Force src-tauri/target
npx tauri dev
```

---

## 📦 构建打包

```powershell
npx tauri build
```

构建完成后，安装包位于 `src-tauri/target/release/bundle/` 目录下，包含：

- **NSIS 安装包**（`.exe`）
- **MSI 安装包**（`.msi`）

> 打包前请确认 `src-tauri/tauri.conf.json` 中的 `productName`、`version`、`identifier` 已正确配置。

---

## 🗂 项目结构

```
Task_List_APP/
├── .github/
│   └── copilot-instructions.md          # Copilot 多Agent协作规范与项目结构记录
├── .vscode/
│   └── settings.json                    # VS Code 工作区设置
├── design-tokens/
│   └── tokens.ts                        # 设计令牌：颜色/间距/圆角/字体定义（样式单一源头）
├── src/
│   ├── types/                           # ── 类型定义层 ──
│   │   ├── task.ts                      #   任务类型：Task, TaskStatus, TaskPriority
│   │   ├── category.ts                 #   分类类型：Category, CategoryCreateInput
│   │   ├── filter.ts                   #   过滤类型：TaskFilter, TaskSortBy, SortDirection
│   │   └── config.ts                   #   配置类型：ThemeMode, AppConfig
│   ├── schemas/                         # ── 校验层 ──
│   │   ├── task.schema.ts              #   任务表单 Zod 校验模式
│   │   └── category.schema.ts          #   分类表单 Zod 校验模式
│   ├── utils/                           # ── 工具层 ──
│   │   ├── id.utils.ts                 #   ID 生成工具（nanoid 适配器）
│   │   └── date.utils.ts              #   日期工具（dayjs 适配器，中文本地化）
│   ├── constants/                       # ── 常量层 ──
│   │   └── app.constants.ts            #   存储键名 / 状态标签 / 优先级权重 / 颜色预设
│   ├── services/                        # ── 服务层 ──
│   │   ├── storage.service.ts          #   localStorage 读写服务
│   │   └── export.service.ts           #   JSON 导入导出服务（调用 Tauri 原生对话框）
│   ├── stores/                          # ── 状态管理层 ──
│   │   ├── task.store.ts               #   任务 Store（Zustand + persist 中间件）
│   │   ├── category.store.ts           #   分类 Store
│   │   └── app.store.ts               #   应用全局 Store（主题模式等）
│   ├── hooks/                           # ── Hook 层 ──
│   │   ├── useTaskActions.ts           #   任务 CRUD 操作封装
│   │   ├── useFilteredTasks.ts         #   过滤 / 排序 / 统计逻辑
│   │   ├── useCategories.ts            #   分类操作封装
│   │   └── useThemeMode.ts             #   主题模式切换
│   ├── components/                      # ── 组件层 ──
│   │   ├── shared/                      #   通用组件
│   │   │   ├── PriorityIcon.tsx        #     优先级彩色图标
│   │   │   ├── EmptyState.tsx          #     空状态提示
│   │   │   └── ConfirmDialog.tsx       #     通用确认对话框
│   │   ├── task/                        #   任务组件
│   │   │   ├── TaskStatusChip.tsx      #     状态标签
│   │   │   ├── TaskCard.tsx            #     任务卡片（展示 + 操作）
│   │   │   ├── TaskForm.tsx            #     任务表单对话框（新建 / 编辑）
│   │   │   └── TaskList.tsx            #     任务列表容器
│   │   ├── filter/                      #   过滤组件
│   │   │   ├── SearchBar.tsx           #     搜索栏（300ms 防抖）
│   │   │   └── FilterPanel.tsx         #     多维度过滤面板
│   │   └── category/                    #   分类组件
│   │       └── CategoryManager.tsx     #     分类管理器
│   ├── pages/                           # ── 页面层 ──
│   │   └── HomePage.tsx                #   主页：整合搜索 / 过滤 / 列表 / 表单
│   ├── theme/                           # ── 主题层 ──
│   │   └── theme.ts                    #   MUI 主题配置（消费 design-tokens）
│   ├── App.tsx                          #   根组件：ThemeProvider 注入
│   ├── main.tsx                         #   React 应用挂载入口
│   └── vite-env.d.ts                    #   Vite 环境变量类型声明
├── src-tauri/                           # ── Tauri / Rust 层 ──
│   ├── src/
│   │   ├── lib.rs                      #   Tauri 后端入口（插件注册）
│   │   └── main.rs                     #   Rust main 入口
│   ├── capabilities/
│   │   └── default.json                #   Tauri 权限与能力配置
│   ├── icons/                           #   应用图标资源
│   ├── Cargo.toml                       #   Rust 依赖配置
│   └── tauri.conf.json                  #   Tauri 应用配置（窗口 / 打包 / 安全策略）
├── .env                                 #   环境变量（应用名称 / 存储前缀 / 默认主题）
├── .gitignore                           #   Git 忽略规则
├── index.html                           #   HTML 入口模板
├── package.json                         #   npm 依赖与脚本
├── tsconfig.json                        #   TypeScript 编译配置
├── tsconfig.node.json                   #   Node 端 TypeScript 配置
└── vite.config.ts                       #   Vite 构建配置
```

---

## 🏗 架构说明

### 单向依赖流

```
页面 (pages)
  ↓
组件 (components)
  ↓
Hook (hooks)
  ↓
Store (stores)
  ↓
Schema / Service (schemas, services)
  ↓
工具 (utils) + 常量 (constants)
  ↓
类型 (types)
```

> **规则**：**下层绝不反向 import 上层**，保证依赖方向始终单向流动。

### 核心设计原则

| 原则 | 实现方式 |
|------|---------|
| **零硬编码** | 所有可变值（颜色、键名、应用名称）从 `.env` / `design-tokens` / `constants` 读取，源码无魔法字符串 |
| **Adapter 模式** | `dayjs`、`nanoid`、`localStorage` 均通过适配器封装（`date.utils.ts`、`id.utils.ts`、`storage.service.ts`），更换底层库只改一处 |
| **设计令牌驱动** | 颜色 / 间距 / 圆角统一在 `design-tokens/tokens.ts` 定义 → MUI 主题消费 → 组件自动同步 |
| **类型先行** | 所有数据结构先在 `types/` 定义，再被 Schema、Store、组件消费 |
| **Zod 校验** | 表单数据通过 Zod Schema 做运行时校验，确保数据完整性 |
| **Zustand persist** | 任务和分类数据自动持久化到 `localStorage`，刷新 / 重启不丢失 |

### 数据流示意

```
用户操作 → 组件事件 → Hook 方法 → Zustand Store 更新
                                         ↓
                                   persist 中间件
                                         ↓
                                   localStorage 持久化
                                         ↓
                                   组件自动重渲染（selector 订阅）
```

---

## ⚙️ 环境变量

项目通过 `.env` 文件管理运行时配置（由 Vite 注入前端）：

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VITE_APP_NAME` | `待办任务清单` | 应用显示名称 |
| `VITE_STORAGE_PREFIX` | `task_list_app` | localStorage 键名前缀（命名空间隔离） |
| `VITE_DEFAULT_THEME` | `dark` | 默认主题模式（`dark` / `light`） |

> 修改 `.env` 后需重启开发服务器才能生效。

---

## 🎨 设计令牌

所有视觉样式的**单一源头**定义在 `design-tokens/tokens.ts`：

```typescript
// 颜色示例
colors.primary.main    // #6366f1 — 蓝紫主色
colors.priority.high   // #ef4444 — 高优先级红色
colors.priority.medium // #f59e0b — 中优先级橙色
colors.priority.low    // #10b981 — 低优先级绿色

// 间距、圆角、字体等也统一在此定义
```

**修改流程**：修改 `tokens.ts` → MUI 主题自动更新 → 所有组件同步生效。

---

## 📄 许可证

本项目基于 [MIT](LICENSE) 许可证开源。

---

> **最后更新**：2026-03-04
