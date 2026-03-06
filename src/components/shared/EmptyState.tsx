/**
 * 空状态占位组件
 * @description 当列表为空时展示引导信息
 */
import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
  /** 主标题 */
  title?: string;
  /** 描述文字 */
  description?: string;
}

/**
 * 渲染空状态占位 UI
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title = '暂无任务',
  description = '点击右下角按钮创建第一个任务吧',
}) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      opacity: 0.6,
    }}
  >
    <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.4 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {description}
    </Typography>
  </Box>
);
