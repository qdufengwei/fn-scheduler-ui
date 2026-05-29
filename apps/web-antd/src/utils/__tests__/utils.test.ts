import { message } from 'ant-design-vue';
import { describe, expect, it, vi } from 'vitest';

import { safeCopyText } from '../clipboard';
import { formatDateTime } from '../date';
import { showError, showInfo, showNotify, showWarning } from '../notify';

// Mock ant-design-vue message
vi.mock('ant-design-vue', () => ({
  message: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe('notify utils', () => {
  it('showNotify should call message.success', () => {
    showNotify('操作成功');
    expect(message.success).toHaveBeenCalledWith('操作成功');
  });

  it('showWarning should call message.warning', () => {
    showWarning('请注意');
    expect(message.warning).toHaveBeenCalledWith('请注意');
  });

  it('showError should call message.error', () => {
    showError('操作失败');
    expect(message.error).toHaveBeenCalledWith('操作失败');
  });

  it('showInfo should call message.info', () => {
    showInfo('提示信息');
    expect(message.info).toHaveBeenCalledWith('提示信息');
  });
});

describe('date utils', () => {
  it('formatDateTime should return string in YYYY-MM-DD HH:mm:ss format', () => {
    const result = formatDateTime();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('formatDateTime should return current time', () => {
    const before = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const result = formatDateTime();
    expect(result).toBe(before);
  });
});

describe('clipboard utils', () => {
  it('safeCopyText should call clipboard.writeText and showNotify on success', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    });

    await safeCopyText('test text');

    expect(writeText).toHaveBeenCalledWith('test text');
    expect(message.success).toHaveBeenCalledWith('已复制到剪贴板');

    vi.unstubAllGlobals();
  });

  it('safeCopyText should show error on failure', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('fail'));
    vi.stubGlobal('navigator', {
      clipboard: { writeText },
    });

    await safeCopyText('test text');

    expect(message.error).toHaveBeenCalledWith('复制失败，请手动复制');

    vi.unstubAllGlobals();
  });
});
