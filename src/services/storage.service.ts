/**
 * localStorage 存储适配器
 * @description 封装 localStorage 读写，预留替换为 Tauri fs 的能力
 */

/**
 * 从 localStorage 读取并解析数据
 * @param key 存储键名
 * @returns 解析后的值，不存在或解析失败返回 null
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`[StorageService] 读取失败，键="${key}"`, error);
    return null;
  }
}

/**
 * 序列化并写入 localStorage
 * @param key 存储键名
 * @param value 要存储的值
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[StorageService] 写入失败，键="${key}"`, error);
  }
}

/**
 * 从 localStorage 移除指定键
 * @param key 存储键名
 */
export function removeStorageItem(key: string): void {
  localStorage.removeItem(key);
}
