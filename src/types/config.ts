/**
 * 应用配置类型定义
 * @description 定义应用级别的配置项，如主题模式
 */

/** 主题模式类型 */
export type ThemeMode = 'dark' | 'light';

/** 应用配置接口 */
export interface AppConfig {
  themeMode: ThemeMode;
}
