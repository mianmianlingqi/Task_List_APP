/**
 * 分类状态管理 Store
 * @description 管理任务分类的 CRUD 操作，自动持久化到 localStorage
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, CategoryCreateInput } from '@/types/category';
import { generateId } from '@/utils/id.utils';
import { now } from '@/utils/date.utils';
import { STORAGE_KEYS } from '@/constants/app.constants';

/** 分类 Store 状态与动作接口 */
interface CategoryStore {
  /** 分类列表 */
  categories: Category[];
  /** 新增分类 */
  addCategory: (input: CategoryCreateInput) => Category;
  /** 更新分类（支持部分字段更新） */
  updateCategory: (id: string, input: Partial<CategoryCreateInput>) => void;
  /** 删除分类 */
  deleteCategory: (id: string) => void;
}

/**
 * 分类 Zustand Store
 * @description 提供分类的增删改操作，数据通过 persist 中间件自动同步到 localStorage
 */
export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],

      /** 新增分类，自动生成 ID 和创建时间 */
      addCategory: (input) => {
        const newCategory: Category = {
          ...input,
          id: generateId(),
          createdAt: now(),
        };
        set({ categories: [...get().categories, newCategory] });
        return newCategory;
      },

      /** 按 ID 更新分类的部分字段 */
      updateCategory: (id, input) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...input } : c
          ),
        }));
      },

      /** 按 ID 删除分类 */
      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },
    }),
    {
      name: STORAGE_KEYS.CATEGORIES,
    }
  )
);
