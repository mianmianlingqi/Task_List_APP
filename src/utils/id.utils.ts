/**
 * ID 生成适配器
 * @description 封装 nanoid 生成唯一标识符，方便未来替换实现
 */

import { nanoid } from 'nanoid';

/**
 * 生成唯一标识符
 * @param size - ID 长度，默认 12
 * @returns 唯一的 URL 安全字符串
 */
export const generateId = (size = 12): string => nanoid(size);
