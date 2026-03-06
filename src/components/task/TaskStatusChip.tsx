/**
 * 任务状态标签组件
 * @description 根据任务状态渲染对应颜色的 Chip
 */
import React from 'react';
import { Chip } from '@mui/material';
import { TaskStatus } from '@/types/task';
import { STATUS_LABELS } from '@/constants/app.constants';
import { colors } from '../../../design-tokens/tokens';

/** 状态颜色映射 */
const STATUS_COLOR_MAP: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: colors.status.todo,
  [TaskStatus.IN_PROGRESS]: colors.status.in_progress,
  [TaskStatus.DONE]: colors.status.done,
};

interface TaskStatusChipProps {
  /** 任务状态 */
  status: TaskStatus;
  /** 点击切换回调 */
  onClick?: () => void;
  /** 尺寸 */
  size?: 'small' | 'medium';
}

/**
 * 渲染任务状态 Chip 标签
 */
export const TaskStatusChip: React.FC<TaskStatusChipProps> = ({
  status,
  onClick,
  size = 'small',
}) => (
  <Chip
    label={STATUS_LABELS[status]}
    size={size}
    onClick={onClick}
    sx={{
      backgroundColor: STATUS_COLOR_MAP[status],
      color: '#fff',
      fontWeight: 600,
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': onClick
        ? { opacity: 0.85 }
        : {},
    }}
  />
);
