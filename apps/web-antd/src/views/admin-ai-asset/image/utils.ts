export { safeCopyText } from '#/utils/clipboard';
export { formatDateTime } from '#/utils/date';
export { showNotify } from '#/utils/notify';

export function generateUniqueId(existingIds: number[]): number {
  const maxId = Math.max(0, ...existingIds);
  return maxId + 1;
}

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
