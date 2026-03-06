/**
 * 已过滤任务列表 Hook
 * @description 基于当前筛选条件和排序方式返回处理后的任务列表
 */
import { useMemo } from 'react';
import { useTaskStore } from '@/stores/task.store';

/**
 * 获取经过筛选和排序的任务列表
 * @returns 已过滤排序的任务数组
 */
export function useFilteredTasks() {
  const tasks = useTaskStore((s) => s.tasks);
  const filter = useTaskStore((s) => s.filter);
  const sortBy = useTaskStore((s) => s.sortBy);
  const sortDirection = useTaskStore((s) => s.sortDirection);
  const getFilteredTasks = useTaskStore((s) => s.getFilteredTasks);

  /** 使用 useMemo 缓存筛选排序结果，避免不必要的重渲染 */
  const filteredTasks = useMemo(
    () => getFilteredTasks(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tasks, filter, sortBy, sortDirection]
  );

  /** 各状态的任务数量统计 */
  const stats = useMemo(
    () => ({
      total: tasks.length,
      filtered: filteredTasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks, filteredTasks]
  );

  return { filteredTasks, stats };
}
