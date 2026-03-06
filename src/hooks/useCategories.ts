/**
 * 分类管理 Hook
 * @description 封装分类 CRUD 操作
 */
import { useCallback } from 'react';
import { useCategoryStore } from '@/stores/category.store';
import type { CategoryCreateInput } from '@/types/category';

export function useCategories() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);

  return {
    categories,
    addCategory: useCallback((input: CategoryCreateInput) => addCategory(input), [addCategory]),
    updateCategory: useCallback(
      (id: string, input: Partial<CategoryCreateInput>) => updateCategory(id, input),
      [updateCategory]
    ),
    deleteCategory: useCallback((id: string) => deleteCategory(id), [deleteCategory]),
  };
}
