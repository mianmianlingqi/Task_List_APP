/**
 * 任务状态管理 Store
 * @description 基于 Zustand 的任务 CRUD 状态管理，含 persist 中间件自动持久化
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';
import { TaskStatus } from '@/types/task';
import type { TaskFilter, SortDirection } from '@/types/filter';
import { TaskSortBy } from '@/types/filter';
import { generateId } from '@/utils/id.utils';
import { now, isOverdue, getDaysUntilDue } from '@/utils/date.utils';
import { STORAGE_KEYS, PRIORITY_WEIGHT } from '@/constants/app.constants';

/** 任务 Store 状态接口 */
interface TaskState {
  /** 全量任务列表 */
  tasks: Task[];
  /** 当前筛选条件 */
  filter: TaskFilter;
  /** 排序方式 */
  sortBy: TaskSortBy;
  /** 排序方向 */
  sortDirection: SortDirection;
}

/** 任务 Store 动作接口 */
interface TaskActions {
  /** 新增任务 */
  addTask: (input: TaskCreateInput) => Task;
  /** 更新任务 */
  updateTask: (input: TaskUpdateInput) => void;
  /** 删除任务 */
  deleteTask: (taskId: string) => void;
  /** 切换任务状态（todo → in_progress → done → todo） */
  toggleTaskStatus: (taskId: string) => void;
  /** 批量删除已完成任务 */
  clearCompletedTasks: () => void;
  /** 更新排序顺序 */
  reorderTasks: (taskIds: string[]) => void;
  /** 设置筛选条件 */
  setFilter: (filter: Partial<TaskFilter>) => void;
  /** 重置筛选条件 */
  resetFilter: () => void;
  /** 设置排序方式 */
  setSortBy: (sortBy: TaskSortBy, direction?: SortDirection) => void;
  /** 导入任务 */
  importTasks: (tasks: Task[], mode: 'merge' | 'overwrite') => void;
  /** 获取已过滤并排序的任务列表 */
  getFilteredTasks: () => Task[];
}

/** 状态循环映射表 */
const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  [TaskStatus.TODO]: TaskStatus.IN_PROGRESS,
  [TaskStatus.IN_PROGRESS]: TaskStatus.DONE,
  [TaskStatus.DONE]: TaskStatus.TODO,
};

/** 筛选条件初始值 */
const INITIAL_FILTER: TaskFilter = {};

/**
 * 对任务列表进行筛选
 * @param tasks - 原始任务列表
 * @param filter - 筛选条件对象
 * @returns 筛选后的任务子集
 */
function filterTasks(tasks: Task[], filter: TaskFilter): Task[] {
  return tasks.filter((task) => {
    // 1. 关键字筛选：匹配标题或描述
    if (filter.keyword) {
      const kw = filter.keyword.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(kw);
      const matchDesc = task.description?.toLowerCase().includes(kw);
      if (!matchTitle && !matchDesc) return false;
    }
    // 2. 状态筛选
    if (filter.statuses?.length && !filter.statuses.includes(task.status)) {
      return false;
    }
    // 3. 优先级筛选
    if (filter.priorities?.length && !filter.priorities.includes(task.priority)) {
      return false;
    }
    // 4. 分类筛选
    if (filter.categoryId && task.categoryId !== filter.categoryId) {
      return false;
    }
    // 5. 仅显示过期任务
    if (filter.overdueOnly && !isOverdue(task.dueDate)) {
      return false;
    }
    return true;
  });
}

/**
 * 对任务列表进行排序
 * @param tasks - 待排序的任务列表
 * @param sortBy - 排序字段
 * @param direction - 排序方向（升序/降序）
 * @returns 排序后的新数组（不修改原数组）
 */
function sortTasks(tasks: Task[], sortBy: TaskSortBy, direction: SortDirection): Task[] {
  const sorted = [...tasks];
  const dir = direction === 'asc' ? 1 : -1;

  sorted.sort((a, b) => {
    switch (sortBy) {
      case TaskSortBy.MANUAL:
        return (a.order - b.order) * dir;
      case TaskSortBy.CREATED_AT:
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      case TaskSortBy.DUE_DATE: {
        // 无截止日期的排到最后
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return (getDaysUntilDue(a.dueDate) - getDaysUntilDue(b.dueDate)) * dir;
      }
      case TaskSortBy.PRIORITY:
        return (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) * dir;
      default:
        return 0;
    }
  });
  return sorted;
}

/** Zustand 任务 Store */
export const useTaskStore = create<TaskState & TaskActions>()(
  persist(
    (set, get) => ({
      /* === 状态 === */
      tasks: [],
      filter: INITIAL_FILTER,
      sortBy: TaskSortBy.MANUAL,
      sortDirection: 'asc' as SortDirection,

      /* === 动作 === */

      /** 新增任务，自动生成 ID、时间戳和排序序号 */
      addTask: (input) => {
        const currentTasks = get().tasks;
        const maxOrder = currentTasks.length > 0
          ? Math.max(...currentTasks.map((t) => t.order))
          : -1;
        const newTask: Task = {
          ...input,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
          order: maxOrder + 1,
        };
        set({ tasks: [...currentTasks, newTask] });
        return newTask;
      },

      /** 更新任务字段，自动刷新 updatedAt */
      updateTask: (input) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === input.id ? { ...t, ...input, updatedAt: now() } : t
          ),
        }));
      },

      /** 按 ID 删除单个任务 */
      deleteTask: (taskId) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
      },

      /** 循环切换任务状态：todo → in_progress → done → todo */
      toggleTaskStatus: (taskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: STATUS_CYCLE[t.status], updatedAt: now() }
              : t
          ),
        }));
      },

      /** 批量删除所有已完成（DONE）的任务 */
      clearCompletedTasks: () => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.status !== TaskStatus.DONE),
        }));
      },

      /** 根据传入的 ID 顺序重新排列任务 order 值 */
      reorderTasks: (taskIds) => {
        set((state) => ({
          tasks: state.tasks.map((t) => {
            const newOrder = taskIds.indexOf(t.id);
            return newOrder !== -1 ? { ...t, order: newOrder, updatedAt: now() } : t;
          }),
        }));
      },

      /** 设置筛选条件（增量合并） */
      setFilter: (filter) => {
        set((state) => ({
          filter: { ...state.filter, ...filter },
        }));
      },

      /** 重置筛选条件为初始值 */
      resetFilter: () => {
        set({ filter: INITIAL_FILTER });
      },

      /** 设置排序字段和可选的排序方向 */
      setSortBy: (sortBy, direction) => {
        set((state) => ({
          sortBy,
          sortDirection: direction ?? state.sortDirection,
        }));
      },

      /** 导入任务：overwrite 清空替换，merge 按 ID 去重合并 */
      importTasks: (tasks, mode) => {
        if (mode === 'overwrite') {
          set({ tasks });
        } else {
          // 合并模式：根据 ID 去重，新数据覆盖旧数据
          set((state) => {
            const existingMap = new Map(state.tasks.map((t) => [t.id, t]));
            tasks.forEach((t) => existingMap.set(t.id, t));
            return { tasks: Array.from(existingMap.values()) };
          });
        }
      },

      /** 获取经过筛选 + 排序后的任务列表（派生数据） */
      getFilteredTasks: () => {
        const { tasks, filter, sortBy, sortDirection } = get();
        const filtered = filterTasks(tasks, filter);
        return sortTasks(filtered, sortBy, sortDirection);
      },
    }),
    {
      name: STORAGE_KEYS.TASKS,
      // 仅持久化数据字段，不持久化筛选/排序等临时状态
      partialize: (state) => ({
        tasks: state.tasks,
      }),
    }
  )
);
