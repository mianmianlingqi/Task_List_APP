/**
 * 导入导出服务
 * @description 提供任务和分类数据的 JSON 序列化导出与反序列化导入能力
 */

import type { Task } from '@/types/task';
import type { Category } from '@/types/category';

/**
 * 导出数据结构
 */
export interface ExportData {
  version: string;
  exportedAt: string;
  tasks: Task[];
  categories: Category[];
}

/**
 * 将任务和分类序列化为 JSON 字符串
 * @param tasks 任务列表
 * @param categories 分类列表
 * @returns 格式化的 JSON 字符串
 */
export function exportToJson(tasks: Task[], categories: Category[]): string {
  const data: ExportData = {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    tasks,
    categories,
  };
  return JSON.stringify(data, null, 2);
}

/**
 * 解析 JSON 字符串为导入数据
 * @param jsonString JSON 字符串
 * @returns 解析后的 ExportData
 * @throws 解析或格式校验失败时抛出错误
 */
export function parseFromJson(jsonString: string): ExportData {
  try {
    const data = JSON.parse(jsonString) as ExportData;
    if (!data.tasks || !Array.isArray(data.tasks)) {
      throw new Error('导入数据格式错误：缺少 tasks 字段或格式不正确');
    }
    if (!data.categories || !Array.isArray(data.categories)) {
      // 兼容没有 categories 的旧版数据
      data.categories = [];
    }
    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('导入失败：文件不是有效的 JSON 格式');
    }
    throw error;
  }
}
