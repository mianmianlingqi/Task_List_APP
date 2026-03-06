/**
 * 任务操作 Hook
 * @description 封装任务 CRUD 操作，对组件提供简洁 API
 */
import { useCallback } from 'react';
import { useTaskStore } from '@/stores/task.store';
import type { TaskCreateInput, TaskUpdateInput } from '@/types/task';

/**
 * 提供任务 CRUD 操作方法
 * @returns 任务操作集合
 */
export function useTaskActions() {
  const addTask = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const toggleTaskStatus = useTaskStore((s) => s.toggleTaskStatus);
  const clearCompletedTasks = useTaskStore((s) => s.clearCompletedTasks);
  const importTasks = useTaskStore((s) => s.importTasks);

  return {
    /** 新增任务 */
    addTask: useCallback((input: TaskCreateInput) => addTask(input), [addTask]),
    /** 更新任务 */
    updateTask: useCallback((input: TaskUpdateInput) => updateTask(input), [updateTask]),
    /** 删除任务 */
    deleteTask: useCallback((id: string) => deleteTask(id), [deleteTask]),
    /** 切换任务状态 */
    toggleStatus: useCallback((id: string) => toggleTaskStatus(id), [toggleTaskStatus]),
    /** 清除已完成任务 */
    clearCompleted: useCallback(() => clearCompletedTasks(), [clearCompletedTasks]),
    /** 导入任务 */
    importTasks: useCallback(
      (tasks: Parameters<typeof importTasks>[0], mode: Parameters<typeof importTasks>[1]) =>
        importTasks(tasks, mode),
      [importTasks]
    ),
  };
}
