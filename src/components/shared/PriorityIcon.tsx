/**
 * 优先级图标组件
 * @description 根据优先级枚举渲染对应颜色的图标
 */
import React from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import { TaskPriority } from '@/types/task';
import { colors } from '../../../design-tokens/tokens';

/** 优先级颜色映射 */
const PRIORITY_COLOR_MAP: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: colors.priority.high,
  [TaskPriority.MEDIUM]: colors.priority.medium,
  [TaskPriority.LOW]: colors.priority.low,
};

interface PriorityIconProps {
  /** 优先级 */
  priority: TaskPriority;
  /** 图标尺寸 */
  fontSize?: 'small' | 'medium' | 'large';
}

/**
 * 渲染对应优先级颜色的旗帜图标
 */
export const PriorityIcon: React.FC<PriorityIconProps> = ({ priority, fontSize = 'small' }) => (
  <FlagIcon sx={{ color: PRIORITY_COLOR_MAP[priority] }} fontSize={fontSize} />
);
