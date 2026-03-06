/// <reference types="vite/client" />

/**
 * Vite 环境变量类型声明
 * @description 确保 import.meta.env.VITE_* 具有正确的类型提示
 */
interface ImportMetaEnv {
  /** 应用名称 */
  readonly VITE_APP_NAME: string;
  /** 存储键名前缀 */
  readonly VITE_STORAGE_PREFIX: string;
  /** 默认主题模式 */
  readonly VITE_DEFAULT_THEME: 'dark' | 'light';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
