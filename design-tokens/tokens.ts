/**
 * 设计令牌 — 颜色、间距、圆角、字体的单一源头
 * @description 所有样式值都从此处导出，组件和主题层消费此文件，禁止硬编码
 */

/* ====== 颜色令牌 ====== */
export const colors = {
  /** 主色调 — 偏蓝紫科技感 */
  primary: {
    main: '#6366f1',
    light: '#818cf8',
    dark: '#4f46e5',
    contrastText: '#ffffff',
  },
  /** 次要色 — 青绿 */
  secondary: {
    main: '#06b6d4',
    light: '#22d3ee',
    dark: '#0891b2',
    contrastText: '#ffffff',
  },
  /** 成功色 */
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  /** 警告色 */
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
  },
  /** 错误色 */
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
  },

  /** 暗色主题背景 */
  background: {
    dark: {
      default: '#0f172a',
      paper: '#1e293b',
      elevated: '#334155',
    },
    light: {
      default: '#f8fafc',
      paper: '#ffffff',
      elevated: '#f1f5f9',
    },
  },

  /** 优先级颜色映射 */
  priority: {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  },

  /** 任务状态颜色映射 */
  status: {
    todo: '#94a3b8',
    in_progress: '#6366f1',
    done: '#10b981',
  },
} as const;

/* ====== 间距令牌（8px 网格系统） ====== */
export const spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 16px */
  md: 16,
  /** 24px */
  lg: 24,
  /** 32px */
  xl: 32,
  /** 48px */
  xxl: 48,
} as const;

/* ====== 圆角令牌 ====== */
export const borderRadius = {
  /** 4px — 按钮、输入框 */
  sm: 4,
  /** 8px — 卡片 */
  md: 8,
  /** 12px — 对话框 */
  lg: 12,
  /** 9999px — 圆形 Chip */
  full: 9999,
} as const;

/* ====== 字体令牌 ====== */
export const typography = {
  fontFamily: '"Inter", "Noto Sans SC", -apple-system, BlinkMacSystemFont, sans-serif',
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    xxl: '1.5rem',
  },
} as const;

/* ====== 窗口尺寸令牌 ====== */
export const layout = {
  /** 应用窗口默认最小宽度 */
  minWidth: 480,
  /** 应用窗口默认最小高度 */
  minHeight: 640,
  /** 侧边栏宽度（预留） */
  sidebarWidth: 280,
} as const;
