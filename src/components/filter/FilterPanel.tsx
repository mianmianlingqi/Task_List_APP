/**
 * 筛选面板组件
 * @description 多维度筛选：按状态、优先级、分类筛选任务
 */
import React from 'react';
import { Box, Chip, Typography } from '@mui/material';
import { TaskStatus, TaskPriority } from '@/types/task';
import type { TaskFilter } from '@/types/filter';
import { STATUS_LABELS, PRIORITY_LABELS } from '@/constants/app.constants';
import { useCategoryStore } from '@/stores/category.store';
import { colors } from '../../../design-tokens/tokens';

interface FilterPanelProps {
  /** 当前筛选条件 */
  filter: TaskFilter;
  /** 筛选变更回调 */
  onFilterChange: (filter: Partial<TaskFilter>) => void;
}

/**
 * 多维筛选面板
 */
export const FilterPanel: React.FC<FilterPanelProps> = ({ filter, onFilterChange }) => {
  const categories = useCategoryStore((s) => s.categories);

  /** 切换状态筛选 */
  const toggleStatus = (status: TaskStatus) => {
    const current = filter.statuses || [];
    const next = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onFilterChange({ statuses: next.length > 0 ? next : undefined });
  };

  /** 切换优先级筛选 */
  const togglePriority = (priority: TaskPriority) => {
    const current = filter.priorities || [];
    const next = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    onFilterChange({ priorities: next.length > 0 ? next : undefined });
  };

  /** 切换分类筛选 */
  const toggleCategory = (categoryId: string) => {
    onFilterChange({
      categoryId: filter.categoryId === categoryId ? undefined : categoryId,
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* 状态筛选 */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          状态
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {Object.values(TaskStatus).map((status) => (
            <Chip
              key={status}
              label={STATUS_LABELS[status]}
              size="small"
              variant={filter.statuses?.includes(status) ? 'filled' : 'outlined'}
              onClick={() => toggleStatus(status)}
              sx={{
                ...(filter.statuses?.includes(status) && {
                  backgroundColor: colors.status[status],
                  color: '#fff',
                }),
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 优先级筛选 */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
          优先级
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {Object.values(TaskPriority).map((priority) => (
            <Chip
              key={priority}
              label={PRIORITY_LABELS[priority]}
              size="small"
              variant={filter.priorities?.includes(priority) ? 'filled' : 'outlined'}
              onClick={() => togglePriority(priority)}
              sx={{
                ...(filter.priorities?.includes(priority) && {
                  backgroundColor: colors.priority[priority],
                  color: '#fff',
                }),
              }}
            />
          ))}
        </Box>
      </Box>

      {/* 分类筛选（仅在有分类时展示） */}
      {categories.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            分类
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                variant={filter.categoryId === cat.id ? 'filled' : 'outlined'}
                onClick={() => toggleCategory(cat.id)}
                sx={{
                  ...(filter.categoryId === cat.id && {
                    backgroundColor: cat.color,
                    color: '#fff',
                  }),
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
