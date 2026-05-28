import { message } from 'ant-design-vue';

/**
 * 格式化日期时间
 * @returns 格式：YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * 生成唯一ID
 * @param existingIds 已有ID数组
 * @returns 新的唯一ID
 */
export function generateUniqueId(existingIds: number[]): number {
  const maxId = Math.max(0, ...existingIds);
  return maxId + 1;
}

/**
 * 安全复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function safeCopyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    message.success('已复制镜像地址到剪贴板');
  } catch {
    message.error('复制失败，请手动复制');
  }
}

/**
 * 显示成功通知
 * @param text 通知文本
 */
export function showNotify(text: string): void {
  message.success(text);
}

/**
 * 防抖函数
 * @param fn 要执行的函数
 * @param delay 延迟时间（毫秒）
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: null | ReturnType<typeof setTimeout> = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
