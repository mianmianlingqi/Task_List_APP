/**
 * 根组件
 * @description ThemeProvider 注入 + CssBaseline 全局样式重置
 */
import React, { useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useAppStore } from '@/stores/app.store';
import { buildTheme } from '@/theme/theme';
import { HomePage } from '@/pages/HomePage';

/**
 * 应用根组件 — 提供主题上下文并渲染主页
 */
const App: React.FC = () => {
  const themeMode = useAppStore((s) => s.themeMode);
  const theme = useMemo(() => buildTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
};

export default App;
