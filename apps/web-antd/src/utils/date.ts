/**
 * 格式化当前日期时间
 * @returns 格式：YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(): string {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}
