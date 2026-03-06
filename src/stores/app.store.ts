/**
 * 应用全局配置 Store
 * @description 管理主题模式等全局配置，自动持久化
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types/config';
import { STORAGE_KEYS } from '@/constants/app.constants';

/** 应用 Store 接口 */
interface AppStore {
  /** 当前主题模式 */
  themeMode: ThemeMode;
  /** 切换主题（明暗互换） */
  toggleTheme: () => void;
  /** 设置指定主题 */
  setTheme: (mode: ThemeMode) => void;
}

/** 从环境变量读取默认主题，回退为暗色 */
const DEFAULT_THEME: ThemeMode =
  (import.meta.env.VITE_DEFAULT_THEME as ThemeMode) || 'dark';

/**
 * 应用全局 Zustand Store
 * @description 管理主题等全局配置，通过 persist 中间件自动持久化到 localStorage
 */
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      themeMode: DEFAULT_THEME,

      /** 切换主题：dark ↔ light */
      toggleTheme: () => {
        set((state) => ({
          themeMode: state.themeMode === 'dark' ? 'light' : 'dark',
        }));
      },

      /** 设置指定的主题模式 */
      setTheme: (mode) => {
        set({ themeMode: mode });
      },
    }),
    {
      name: STORAGE_KEYS.APP_CONFIG,
    }
  )
);
