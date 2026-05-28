/**
 * 禁用按钮点击防护工具
 *
 * 在某些场景下，禁用按钮的点击事件可能未被正确阻止：
 * 1. 按钮被 Popconfirm/Tooltip 等包裹时，disabled 可能不阻止弹出层
 * 2. 某些自定义样式可能覆盖了 pointer-events: none
 *
 * 使用方式：
 * - 在点击事件处理器中添加禁用检查
 * - 或使用 createDisabledClickHandler 包装处理器
 */

/**
 * 创建带禁用检查的点击处理器
 * @param handler 原始点击处理器
 * @param disabled 禁用状态（可以是 ref 或布尔值）
 * @returns 包装后的处理器，禁用时不会执行
 *
 * @example
 * ```vue
 * <Button :disabled="selectedRowKeys.length === 0" @click="createDisabledClickHandler(handleBatchDelete, selectedRowKeys.length === 0)">
 *   批量删除
 * </Button>
 * ```
 */
export function createDisabledClickHandler<T extends (...args: any[]) => any>(
  handler: T,
  disabled: boolean | (() => boolean),
): T {
  return ((...args: any[]) => {
    const isDisabled = typeof disabled === 'function' ? disabled() : disabled;
    if (isDisabled) {
      return;
    }
    return handler(...args);
  }) as T;
}

/**
 * 检查事件目标是否为禁用元素
 * @param event DOM 事件
 * @returns 如果目标是禁用元素则返回 true
 */
export function isEventTargetDisabled(
  event: Event | MouseEvent | KeyboardEvent,
): boolean {
  const target = event.target as HTMLElement | null;
  if (!target) return false;

  // 检查元素自身或最近的禁用父元素
  const disabledElement = target.closest('[disabled]');
  if (disabledElement) {
    // 对于表单元素，检查 disabled 属性
    if (
      disabledElement instanceof HTMLButtonElement ||
      disabledElement instanceof HTMLInputElement ||
      disabledElement instanceof HTMLSelectElement ||
      disabledElement instanceof HTMLOptionElement ||
      disabledElement instanceof HTMLTextAreaElement
    ) {
      return disabledElement.disabled;
    }
    // 对于自定义组件（如 Vue 组件），检查 disabled attribute
    return disabledElement.hasAttribute('disabled');
  }

  // 检查 aria-disabled 属性（某些组件使用）
  const ariaDisabledElement = target.closest('[aria-disabled="true"]');
  return ariaDisabledElement !== null;
}

/**
 * 阻止禁用元素上的事件
 * 可用于 Popconfirm 等组件的事件处理
 */
export function preventDisabledClick(event: Event): boolean {
  if (isEventTargetDisabled(event)) {
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  return false;
}