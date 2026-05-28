import { message } from 'ant-design-vue';

export function showNotify(text: string): void {
  message.success(text);
}

export function showWarning(text: string): void {
  message.warning(text);
}

export function showError(text: string): void {
  message.error(text);
}

export function showInfo(text: string): void {
  message.info(text);
}
