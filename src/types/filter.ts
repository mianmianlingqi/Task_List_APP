/**
 * 筛选与排序类型定义
 * @description 定义任务列表的筛选条件和排序方式
 */

import { TaskStatus, TaskPriority } from './task';

/** 任务筛选条件接口 */
export interface TaskFilter {
  keyword?: string;
  statuses?: TaskStatus[];
  priorities?: TaskPriority[];
  categoryId?: string;
  overdueOnly?: boolean;
}

/** 任务排序字段枚举 */
export enum TaskSortBy {
  MANUAL = 'manual',
  CREATED_AT = 'createdAt',
  DUE_DATE = 'dueDate',
  PRIORITY = 'priority',
}

/** 排序方向类型 */
export type SortDirection = 'asc' | 'desc';
