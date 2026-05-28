import { showNotify, showError } from '#/utils/notify';

/**
 * 安全复制文本到剪贴板
 * @param text 要复制的文本
 */
export async function safeCopyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    showNotify('已复制到剪贴板');
  } catch {
    showError('复制失败，请手动复制');
  }
}
