/**
 * 任务实体类型定义
 * @description 定义任务状态、优先级枚举及任务数据结构
 */

/** 任务状态枚举 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

/** 优先级枚举 */
export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/** 任务实体接口 */
export interface Task {
  readonly id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  categoryId?: string;
  dueDate?: string;
  readonly createdAt: string;
  updatedAt: string;
  order: number;
}

/** 创建任务输入类型 */
export type TaskCreateInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>;

/** 更新任务输入类型 */
export type TaskUpdateInput = Partial<Omit<Task, 'id' | 'createdAt'>> & { id: string };
