/**
 * 主题模式 Hook
 * @description 封装主题读取与切换操作
 */
import { useAppStore } from '@/stores/app.store';
import type { ThemeMode } from '@/types/config';

export function useThemeMode() {
  const themeMode = useAppStore((s) => s.themeMode);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setTheme = useAppStore((s) => s.setTheme);

  return {
    themeMode,
    toggleTheme,
    setTheme: (mode: ThemeMode) => setTheme(mode),
    /** 当前是否为暗色模式 */
    isDark: themeMode === 'dark',
  };
}
