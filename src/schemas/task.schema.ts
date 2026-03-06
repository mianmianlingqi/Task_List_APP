/**
 * 任务校验 Schema
 * @description 使用 Zod 定义任务创建和更新的输入校验规则
 */

import { z } from 'zod';
import { TaskStatus, TaskPriority } from '@/types/task';

/** 任务创建输入校验 Schema */
export const taskCreateSchema = z.object({
  title: z
    .string()
    .min(1, '任务标题不能为空')
    .max(100, '任务标题不能超过 100 个字符'),
  description: z
    .string()
    .max(500, '任务描述不能超过 500 个字符')
    .optional(),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.TODO),
  priority: z.nativeEnum(TaskPriority).default(TaskPriority.MEDIUM),
  categoryId: z.string().optional(),
  dueDate: z.string().optional(),
});

/** 任务更新输入校验 Schema */
export const taskUpdateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  categoryId: z.string().optional(),
  dueDate: z.string().optional(),
  order: z.number().optional(),
  updatedAt: z.string().optional(),
});

/** 任务创建 Schema 推导类型 */
export type TaskCreateSchemaType = z.infer<typeof taskCreateSchema>;

/** 任务更新 Schema 推导类型 */
export type TaskUpdateSchemaType = z.infer<typeof taskUpdateSchema>;
