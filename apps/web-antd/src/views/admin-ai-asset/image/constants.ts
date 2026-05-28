import type { SelectOption } from './types';

// 默认项目
export const DEFAULT_PROJECT = 'kubesphereio';

// 分页默认值
export const DEFAULT_PAGE_SIZE = 10;

// 构建方式选项
export const BUILD_TYPES = {
  Dockerfile: 'Dockerfile' as const,
  DevBox: 'DevBox' as const,
  Task: 'Task' as const,
};

// 下拉选项
export const PROJECT_OPTIONS: SelectOption[] = [
  { label: 'kubesphereio', value: 'kubesphereio' },
  { label: 'test01', value: 'test01' },
  { label: 'library', value: 'library' },
];

export const DEVBOX_OPTIONS: SelectOption[] = [
  { label: 'devbox-qwen2.5-coder', value: 'devbox-qwen2.5-coder' },
  { label: 'devbox-pytorch-2.1', value: 'devbox-pytorch-2.1' },
];

export const TASK_NAME_OPTIONS: SelectOption[] = [
  { label: 'qwen2.5-inference-01', value: 'qwen2.5-inference-01' },
  { label: 'deepseek-v3-infer-task', value: 'deepseek-v3-infer-task' },
];

export const INSTANCE_OPTIONS: SelectOption[] = [
  { label: 'pod-01 (Ready)', value: 'pod-01' },
  { label: 'pod-02 (Running)', value: 'pod-02' },
];

export const CONTAINER_OPTIONS: SelectOption[] = [
  { label: 'main-container', value: 'main-container' },
  { label: 'sidecar-container', value: 'sidecar-container' },
];
