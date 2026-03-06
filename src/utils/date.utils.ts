/**
 * 日期工具适配器
 * @description 封装 dayjs 提供日期格式化、过期判断、相对时间等工具函数
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 启用相对时间插件和中文本地化
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 获取当前时间 ISO 字符串
 * @returns 当前时间的 ISO 8601 格式字符串
 */
export const now = (): string => dayjs().toISOString();

/**
 * 格式化日期为友好显示
 * @param date - ISO 8601 日期字符串
 * @param format - 格式字符串，默认 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: string, format = 'YYYY-MM-DD'): string =>
  dayjs(date).format(format);

/**
 * 判断日期是否已过期（早于今天）
 * @param date - ISO 8601 日期字符串
 * @returns 是否已过期
 */
export const isOverdue = (date?: string): boolean => {
  if (!date) return false;
  return dayjs(date).isBefore(dayjs(), 'day');
};

/**
 * 获取相对时间描述（如 "2天前"）
 * @param date - ISO 8601 日期字符串
 * @returns 相对时间描述字符串
 */
export const getRelativeTime = (date: string): string => dayjs(date).fromNow();

/**
 * 获取距离截止日期的天数
 * @param dueDate - 截止日期 ISO 字符串
 * @returns 正数=剩余天数，负数=已过期天数，0=今天到期
 */
export const getDaysUntilDue = (dueDate: string): number =>
  dayjs(dueDate).startOf('day').diff(dayjs().startOf('day'), 'day');
