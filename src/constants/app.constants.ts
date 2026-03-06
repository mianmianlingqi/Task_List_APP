/**
 * 应用常量定义
 * @description 集中管理存储键名、标签映射、排序权重等应用级常量
 */

import { TaskStatus, TaskPriority } from '@/types/task';

// 从环境变量读取存储前缀
const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'task_list_app';

/** 存储键名常量 */
export const STORAGE_KEYS = {
  TASKS: `${STORAGE_PREFIX}_tasks`,
  CATEGORIES: `${STORAGE_PREFIX}_categories`,
  APP_CONFIG: `${STORAGE_PREFIX}_config`,
} as const;

/** 任务状态显示标签映射 */
export const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: '待办',
  [TaskStatus.IN_PROGRESS]: '进行中',
  [TaskStatus.DONE]: '已完成',
};

/** 优先级显示标签映射 */
export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: '高',
  [TaskPriority.MEDIUM]: '中',
  [TaskPriority.LOW]: '低',
};

/** 优先级排序权重（用于排序计算，数值越小越靠前） */
export const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  [TaskPriority.HIGH]: 0,
  [TaskPriority.MEDIUM]: 1,
  [TaskPriority.LOW]: 2,
};

/** 默认分类预设颜色集合 */
export const CATEGORY_COLORS = [
  '#6366f1', '#ec4899', '#f59e0b', '#10b981',
  '#06b6d4', '#8b5cf6', '#f43f5e', '#84cc16',
] as const;
