/**
 * 任务列表容器组件
 * @description 遍历渲染 TaskCard，处理空状态
 */
import React from 'react';
import { Box } from '@mui/material';
import type { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../shared/EmptyState';

interface TaskListProps {
  /** 已过滤排序的任务列表 */
  tasks: Task[];
  /** 切换状态回调 */
  onToggleStatus: (id: string) => void;
  /** 编辑回调 */
  onEdit: (task: Task) => void;
  /** 删除回调 */
  onDelete: (id: string) => void;
}

/**
 * 渲染任务列表或空状态
 */
export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onToggleStatus={onToggleStatus}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
};
