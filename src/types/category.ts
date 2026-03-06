/**
 * 分类实体类型定义
 * @description 定义任务分类的数据结构与创建输入类型
 */

/** 分类实体接口 */
export interface Category {
  readonly id: string;
  name: string;
  color: string;
  readonly createdAt: string;
}

/** 创建分类输入类型 */
export type CategoryCreateInput = Omit<Category, 'id' | 'createdAt'>;
