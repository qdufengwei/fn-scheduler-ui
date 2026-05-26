import { defineEventHandler } from 'h3';

import { useResponseSuccess } from '~/utils/response';

export default defineEventHandler(() => {
  return useResponseSuccess({
    stats: {
      total: 96,
      allocated: 72,
      available: 24,
    },
    list: [
      { id: 1, name: 'vgpu-pool-01', gpuModel: 'NVIDIA H100', totalCards: 8, allocatedCards: 6, vgpuInstances: 12, status: '运行中', region: '集群A' },
      { id: 2, name: 'vgpu-pool-02', gpuModel: 'NVIDIA H100', totalCards: 8, allocatedCards: 8, vgpuInstances: 16, status: '运行中', region: '集群A' },
      { id: 3, name: 'vgpu-pool-03', gpuModel: 'NVIDIA A100', totalCards: 8, allocatedCards: 4, vgpuInstances: 8, status: '运行中', region: '集群B' },
      { id: 4, name: 'vgpu-pool-04', gpuModel: 'NVIDIA H100', totalCards: 8, allocatedCards: 5, vgpuInstances: 10, status: '运行中', region: '集群A' },
      { id: 5, name: 'vgpu-pool-05', gpuModel: 'NVIDIA A100', totalCards: 8, allocatedCards: 7, vgpuInstances: 14, status: '运行中', region: '集群B' },
    ],
    whitelist: [
      { id: 1, tenant: 'test-01', namespace: 'ns-test-01', gpuLimit: 4, status: '已启用' },
      { id: 2, tenant: 'test-02', namespace: 'ns-test-02', gpuLimit: 8, status: '已启用' },
      { id: 3, tenant: 'demo', namespace: 'ns-demo', gpuLimit: 2, status: '已禁用' },
    ],
    total: 5,
  });
});
