import { defineEventHandler } from 'h3';

import { useResponseSuccess } from '~/utils/response';

export default defineEventHandler(() => {
  return useResponseSuccess({
    stats: {
      totalNodes: 12,
      runningNodes: 10,
      totalGpu: 96,
      gpuUtilization: 75,
    },
    nodes: [
      { id: 1, name: 'node-01', ip: '192.168.1.101', status: '运行中', gpuUtilization: 85, gpuMemory: 68, temperature: 72, power: 320, gpuModel: 'NVIDIA H100', gpuTotal: 8, gpuUsed: 6, cpu: '128核', memory: '512GiB', region: '集群A' },
      { id: 2, name: 'node-02', ip: '192.168.1.102', status: '运行中', gpuUtilization: 92, gpuMemory: 75, temperature: 78, power: 345, gpuModel: 'NVIDIA H100', gpuTotal: 8, gpuUsed: 8, cpu: '128核', memory: '512GiB', region: '集群A' },
      { id: 3, name: 'node-03', ip: '192.168.1.103', status: '停止', gpuUtilization: 0, gpuMemory: 0, temperature: 35, power: 50, gpuModel: 'NVIDIA A100', gpuTotal: 8, gpuUsed: 0, cpu: '96核', memory: '256GiB', region: '集群B' },
      { id: 4, name: 'node-04', ip: '192.168.1.104', status: '运行中', gpuUtilization: 78, gpuMemory: 62, temperature: 68, power: 290, gpuModel: 'NVIDIA H100', gpuTotal: 8, gpuUsed: 7, cpu: '128核', memory: '512GiB', region: '集群A' },
      { id: 5, name: 'node-05', ip: '192.168.1.105', status: '运行中', gpuUtilization: 45, gpuMemory: 30, temperature: 58, power: 210, gpuModel: 'NVIDIA A100', gpuTotal: 8, gpuUsed: 5, cpu: '96核', memory: '256GiB', region: '集群B' },
    ],
    total: 12,
  });
});
