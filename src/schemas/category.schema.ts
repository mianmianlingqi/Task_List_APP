/**
 * 分类校验 Schema
 * @description 使用 Zod 定义分类创建的输入校验规则
 */

import { z } from 'zod';

/** 分类创建输入校验 Schema */
export const categoryCreateSchema = z.object({
  name: z
    .string()
    .min(1, '分类名称不能为空')
    .max(20, '分类名称不能超过 20 个字符'),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, '颜色必须是有效的 HEX 值'),
});

/** 分类创建 Schema 推导类型 */
export type CategoryCreateSchemaType = z.infer<typeof categoryCreateSchema>;
