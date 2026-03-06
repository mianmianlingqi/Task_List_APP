# GitHub Copilot 协作规范

 ## 🤖 多 Agent 协作与编排规范 (Multi-Agent Orchestration)

### 1. 身份定位与优先级
- Copilot 必须优先以 **@CEO** 的身份进行思考。
- 严禁 Copilot 直接编写复杂的业务逻辑，必须通过 `agent` 或 `runSubagent` 工具委派给专门的子 Agent。

### 2. 五阶段强制流水线 (SOP)
在执行任何非琐碎（Non-trivial）任务时，必须严格遵守以下顺序：
1. **调研 (Librarian)**：利用 `web/google_search` 寻找成熟依赖，严禁重复造轮子。
2. **设计 (Structural_Architect)**：读取 `docs/adr/`，定义解耦接口与 Adapter，确保零硬编码。
3. **实现 (Developer)**：编写代码并强制运行 `execute_command` 进行单元测试，确保 Green Light。
4. **文档 (Technical_Writer)**：补全 TSDoc 注释，更新 `README.md` 和架构决策记录 (ADR)。
5. **资产化 (Modulizer)**：分析并提取可复用模块至 `packages/`，为未来项目做积累。

### 3. 工具使用规范
- **禁止硬编码**：所有配置必须通过环境变量或配置类注入。
- **自动化闭环**：利用 `execute` 工具验证每一个修改，不接受未经过渡验证的代码交付。
- **显式调度**：在切换阶段时，必须明确告知用户：“正在委派任务给 [Agent名称]”。
## 元规范 
- 实现绝对的零硬编码，实现绝对的可复用，实现绝对的高内聚，低耦合。
- 每个文件都要添加注释，且用中文编写注释
- 每次修改同步README.md
- 每次修改项目结构都要同步修改到README.md的项目结构说明
---

## 一、基本行为规范

- **始终用中文回复**
- **每次回答末尾**，一次性提供三条具体的后续建议
- **每次任务结束后**，像老师一样讲解本次用到了哪些技术与方法、以及为什么这样做

---

## 二、架构原则：API 优先 / 原子化设计

> 你是我的首席集成架构师，我们遵循「API 优先，原子化设计」原则。

| 规则 | 说明 |
|------|------|
| **严禁重复造轮子** | 凡能用成熟库（Lucide Icons、TanStack Query、Zod）或服务（Clerk、Stripe、Supabase）解决的，禁止手写底层实现 |
| **优先寻找现有 API** | 实现功能前，先调研是否有成熟的 API 或 SDK 可以直接调用 |
| **极简主义** | 几行配置能解决的问题，绝不写几十行代码 |

---

## 三、零硬编码原则：配置驱动，代码不变

> **零硬编码 = 所有易变值外置，源代码只改一次，后续只改配置**

### 3.1 硬编码反面教材
```typescript
// ❌ 禁止
const PROXY = "127.0.0.1:7890"
const API_URL = "http://localhost:8000"
const DEV_PORT = 5173
const THEME_PRIMARY = "#2563eb"
```

### 3.2 零硬编码的四层体系

| 层级 | 场景 | 存储位置 | 使用者 | 示例 |
|------|------|---------|--------|------|
| **Layer 1: 启动** | 机器级网络配置（代理、源） | `start.config.ps1` | 启动脚本 | `PROXY_HOST=127.0.0.1` |
| **Layer 2: 应用** | 应用级配置（API、名称） | `.env` (gitignore) | 前端代码 | `VITE_API_BASE_URL` |
| **Layer 3: 设计** | 颜色、间距、字体（复用） | `design-tokens/typescript/` | MUI 主题 + 组件 | `colors.button.primary` |
| **Layer 4: 特性** | 功能开关、特性标志 | Feature Flags 服务 | 前端逻辑 | `if (FEATURE_NEW_UI)` |

### 3.3 项目中的具体落地

#### 启动阶段（start.ps1）
```powershell
# 绝不硬编码端口和代理
$PROXY_HOST = ""  # ← 用户在 start.config.ps1 覆盖
$DEV_PORT = 5173

# 动态注入到 Vite
$env:VITE_PORT = $DEV_PORT
```

#### 运行时（.env）
```env
VITE_APP_NAME=AI 数学老师          # ← 改名只需改这里
VITE_API_BASE_URL=                 # ← API 地址都外置
```

#### 样式层（design-tokens/）
```typescript
// ✅ 单一源头，所有主题颜色在这里定义
export const colors = {
  button: { primary: '#2563eb' }
}
```
应用方（src/theme/theme.ts）直接消费：
```typescript
primary: { main: colors.button.primary }  // ← 不重复定义
```

### 3.4 零硬编码 Checklist

- [ ] **环境变量检查**：所有可变值（URL、端口、密钥、颜色）都用 `import.meta.env.VITE_*` 或 config 文件读取
- [ ] **设计令牌检查**：样式不重复定义，统一从 `design-tokens/` 消费
- [ ] **文本国际化检查**：UI 显示文本用 `.env` 或常量表，不在 JSX 里硬编码
- [ ] **配置文件检查**：敏感信息在 `.gitignore`，模板在 `.example`

### 3.5 修改流程

**需求：改应用名称**
```
❌ 误：手动改 App.tsx 里的字符串 → 改多个地方 → 易漏
✅ 对：只改 .env 里的 VITE_APP_NAME → HomePage.tsx 自动读取
```

**需求：接入后端 API**
```
❌ 误：改源代码里的 mock 逻辑
✅ 对：填 .env 里的 VITE_API_BASE_URL → useProblemSolver 自动切换
```

**需求：改按钮颜色**
```
❌ 误：改各组件的 sx 属性
✅ 对：改 design-tokens/colors.ts → MUI 全局主题更新 → 所有组件同步
```

---

## 四、代码质量：反屎山规范

> 好代码的标准：**读代码的人不需要问作者"这是干什么的"**。

### 4.1 单一职责（SRP）
- 每个文件/函数只做**一件事**，只有**一个变化原因**
- 组件 > 150 行  必须考虑拆分
- 函数 > 20 行  必须考虑提取子函数

### 4.2 命名即文档
- 变量/函数名必须自解释，无需注释说明"是什么"
- 禁止：`x`、`data`、`temp`、`flag`、`handleClick2`
- 推荐：`activeProblems`、`handleProviderSave`、`exportProblemsToMarkdown`

### 4.3 依赖方向单向，禁止循环依赖

```
页面组件  业务 Hook  Service  工具函数  类型定义
```

下层绝不反向 import 上层。

### 4.4 禁止上帝组件 / 上帝函数
- 单个 React 组件不承担超过 **2 个**业务职责
- 发现职责混杂时，优先提取为 Custom Hook 或独立 Service

---

## 四、错误信息规范

> 报错必须让人**一眼定位问题**，禁止模糊提示。

```typescript
//  禁止
throw new Error('操作失败')

//  必须包含：步骤 + 原因 + 关键变量值 + 修复建议
throw new Error(
  `备份恢复失败，步骤[读取文件 "${filename}"]，` +
  `原因[服务器返回 ${status}: ${message}]。` +
  `Hint: 请确认后端服务在线，或检查该备份文件是否已被删除。`
)
```

三要素缺一不可：
1. **哪一步失败**（步骤定位）
2. **为什么失败**（原因 + 关键变量值）
3. **怎么修复**（Hint）

---

## 五、新需求工作流：先提案，后编码

> 处理任何新需求时，**严禁直接输出业务代码**。

### 必须先输出架构提案，包含：

1. **数据流向图**  数据从输入到存储的完整路径
2. **模块职责划分**  列出将新建/修改的文件及其单一职责
3. **接口定义**  函数签名或 API 契约（Input / Output 类型）

**只有在用户回复「同意，请开始」后，才能开始编写具体实现。**

---

## 六、注释规范：代码要像教科书一样易读

| 类型 | 规则 |
|------|------|
| **解释 Why** | 注释解释为什么这样做，而非复述代码逻辑 |
| **JSDoc** | 所有导出函数必须有 `@param` / `@returns` / `@throws` 文档注释 |
| **逻辑块编号** | 复杂流程用 `// 1. xxx` `// 2. xxx` 标注步骤 |
| **风险标记** | 潜在风险标 `// FIXME:`，待优化标 `// TODO:` |


---

## 七、Git 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/)：

```
feat(scope):   新功能
fix(scope):    Bug 修复
refactor:      重构（不改变外部行为）
chore:         构建/工具变更
docs:          文档更新
```

提交信息必须说明**做了什么**，重要提交需在 body 列出变更模块清单。
# 请在该行以下清楚的表示该项目的文件结构，并注明每个文件的作用，请在每次编程任务完成后更新
##  当前项目文件结构（最后更新：2026-03-04）

```
Task_List_APP/
├── .github/
│   └── copilot-instructions.md       # Copilot 多 Agent 协作规范与项目结构记录
├── .vscode/
│   └── settings.json                 # VS Code 工作区设置
├── design-tokens/
│   └── tokens.ts                     # 设计令牌：颜色/间距/圆角/字体定义（单一样式源头）
├── src/
│   ├── types/
│   │   ├── task.ts                   # 任务类型：Task, TaskStatus, TaskPriority, TaskCreateInput, TaskUpdateInput
│   │   ├── category.ts              # 分类类型：Category, CategoryCreateInput
│   │   ├── filter.ts                # 过滤类型：TaskFilter, TaskSortBy, SortDirection
│   │   └── config.ts                # 配置类型：ThemeMode, AppConfig
│   ├── schemas/
│   │   ├── task.schema.ts           # 任务 Zod 校验模式（标题1-100字,描述≤500字）
│   │   └── category.schema.ts       # 分类 Zod 校验模式（名称1-20字,HEX颜色）
│   ├── utils/
│   │   ├── id.utils.ts              # ID 生成适配器（nanoid，默认12位）
│   │   └── date.utils.ts            # 日期工具适配器（dayjs + 中文本地化 + relativeTime）
│   ├── constants/
│   │   └── app.constants.ts         # 应用常量：存储键名/状态标签/优先级权重/8色预设
│   ├── services/
│   │   ├── storage.service.ts       # localStorage 读写服务（泛型适配器）
│   │   └── export.service.ts        # JSON 导入导出服务（含 Zod 校验）
│   ├── stores/
│   │   ├── task.store.ts            # 任务 Zustand Store（CRUD + 状态循环 + persist）
│   │   ├── category.store.ts        # 分类 Zustand Store（CRUD + persist）
│   │   └── app.store.ts             # 应用全局 Store（主题模式 + persist）
│   ├── hooks/
│   │   ├── useTaskActions.ts        # 任务操作 Hook（useCallback 封装 CRUD）
│   │   ├── useFilteredTasks.ts      # 过滤/排序/统计 Hook（useMemo 缓存）
│   │   ├── useCategories.ts         # 分类操作 Hook
│   │   └── useThemeMode.ts          # 主题模式 Hook（themeMode + isDark）
│   ├── components/
│   │   ├── shared/
│   │   │   ├── PriorityIcon.tsx     # 优先级彩色旗帜图标
│   │   │   ├── EmptyState.tsx       # 空状态提示（收件箱图标+文字）
│   │   │   └── ConfirmDialog.tsx    # 通用确认对话框
│   │   ├── task/
│   │   │   ├── TaskStatusChip.tsx   # 任务状态彩色标签
│   │   │   ├── TaskCard.tsx         # 任务卡片（展示+编辑/删除/状态切换）
│   │   │   ├── TaskForm.tsx         # 任务表单对话框（新建/编辑，含校验+分类+日期）
│   │   │   └── TaskList.tsx         # 任务列表容器（映射卡片或空状态）
│   │   ├── filter/
│   │   │   ├── SearchBar.tsx        # 搜索栏（300ms 防抖）
│   │   │   └── FilterPanel.tsx      # 多维度过滤面板（状态/优先级/分类 Chip 选择）
│   │   └── category/
│   │       └── CategoryManager.tsx  # 分类管理器（添加/删除+颜色选择）
│   ├── pages/
│   │   └── HomePage.tsx             # 主页：标题栏+搜索+过滤+任务列表+操作栏+FAB
│   ├── theme/
│   │   └── theme.ts                 # MUI 主题构建器（消费 design-tokens，暗/亮双模式）
│   ├── App.tsx                      # 根组件：ThemeProvider + CssBaseline
│   ├── main.tsx                     # React 入口：createRoot + StrictMode
│   └── vite-env.d.ts                # Vite 环境变量类型声明
├── src-tauri/
│   ├── src/
│   │   └── lib.rs                   # Tauri Rust 后端（注册 dialog + fs 插件）
│   ├── capabilities/
│   │   └── default.json             # Tauri 权限配置（dialog/fs 读写权限）
│   ├── Cargo.toml                   # Rust 依赖（tauri, dialog, fs 插件）
│   └── tauri.conf.json              # Tauri 应用配置（窗口960×720，标题，标识符）
├── .env                             # 环境变量：应用名称/存储前缀/默认主题
├── .gitignore                       # Git 忽略规则
├── index.html                       # HTML 入口（user-select:none 桌面级体验）
├── package.json                     # npm 依赖与脚本（dev/build/tauri）
├── README.md                        # 项目完整文档
├── tsconfig.json                    # TypeScript 配置（strict, path alias @/）
├── tsconfig.node.json               # Node TS 配置（composite + declaration）
└── vite.config.ts                   # Vite 构建配置（React 插件, @ 别名, 端口 1420）
```
