/**
 * 任务卡片组件
 * @description 展示单个任务的完整信息，包括标题、状态、优先级、到期日
 */
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import type { Task } from '@/types/task';
import { isOverdue, formatDate, getDaysUntilDue } from '@/utils/date.utils';
import { useCategoryStore } from '@/stores/category.store';
import { TaskStatusChip } from './TaskStatusChip';
import { PriorityIcon } from '../shared/PriorityIcon';
import { ConfirmDialog } from '../shared/ConfirmDialog';

interface TaskCardProps {
  /** 任务数据 */
  task: Task;
  /** 点击状态切换 */
  onToggleStatus: (id: string) => void;
  /** 点击编辑 */
  onEdit: (task: Task) => void;
  /** 点击删除 */
  onDelete: (id: string) => void;
}

/**
 * 获取截止日期的显示文案和颜色
 */
function getDueDateDisplay(dueDate?: string): { text: string; color: string } | null {
  if (!dueDate) return null;
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return { text: `已过期 ${Math.abs(days)} 天`, color: 'error.main' };
  if (days === 0) return { text: '今天到期', color: 'warning.main' };
  if (days <= 3) return { text: `${days} 天后到期`, color: 'warning.main' };
  return { text: formatDate(dueDate), color: 'text.secondary' };
}

/**
 * 渲染任务卡片
 */
export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  /* 删除确认对话框状态 */
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  /* 查找所属分类 */
  const categories = useCategoryStore((s) => s.categories);
  const category = task.categoryId
    ? categories.find((c) => c.id === task.categoryId)
    : null;

  const dueDateInfo = getDueDateDisplay(task.dueDate);
  const overdue = isOverdue(task.dueDate);
  const isDone = task.status === 'done';

  return (
    <>
      <Card
        sx={{
          mb: 1,
          opacity: isDone ? 0.65 : 1,
          borderLeft: overdue && !isDone ? '3px solid' : 'none',
          borderLeftColor: 'error.main',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: 3,
          },
        }}
      >
        <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
          {/* 第一行：优先级 + 标题 + 操作按钮 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PriorityIcon priority={task.priority} />
            <Typography
              variant="body1"
              sx={{
                flex: 1,
                fontWeight: 500,
                textDecoration: isDone ? 'line-through' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.title}
            </Typography>
            <Tooltip title="编辑">
              <IconButton size="small" onClick={() => onEdit(task)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="删除">
              <IconButton size="small" onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          {/* 第二行：描述（如有） */}
          {task.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* 第三行：状态标签 + 分类标签 + 到期时间 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
            <TaskStatusChip
              status={task.status}
              onClick={() => onToggleStatus(task.id)}
            />
            {category && (
              <Chip
                label={category.name}
                size="small"
                sx={{
                  backgroundColor: category.color,
                  color: '#fff',
                  fontSize: '0.75rem',
                }}
              />
            )}
            {dueDateInfo && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 'auto' }}>
                <ScheduleIcon sx={{ fontSize: 14, color: dueDateInfo.color }} />
                <Typography variant="caption" sx={{ color: dueDateInfo.color }}>
                  {dueDateInfo.text}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="删除任务"
        content={`确定要删除任务「${task.title}」吗？此操作不可撤销。`}
        confirmText="删除"
        onConfirm={() => {
          onDelete(task.id);
          setDeleteDialogOpen(false);
        }}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
};
