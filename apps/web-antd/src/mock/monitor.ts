export interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export interface NodeMetricHistory {
  nodeId: number;
  nodeName: string;
  metricKey: string;
  unit: string;
  data: MetricDataPoint[];
}

const metricConfigs: Record<
  string,
  { interval: number; maxValue: number; minValue: number; unit: string }
> = {
  gpuPower: { unit: 'W', minValue: 100, maxValue: 400, interval: 5 },
  gpuTemperature: { unit: '°C', minValue: 50, maxValue: 85, interval: 5 },
  nvLinkBandwidth: { unit: 'GB/s', minValue: 0, maxValue: 100, interval: 5 },
  nvLinkTxBytes: { unit: 'GB', minValue: 0, maxValue: 1000, interval: 5 },
  nvLinkRxBytes: { unit: 'GB', minValue: 0, maxValue: 1000, interval: 5 },
  gpuUtilization: { unit: '%', minValue: 0, maxValue: 100, interval: 5 },
  gpuMemoryUtilization: { unit: '%', minValue: 0, maxValue: 100, interval: 5 },
  gpuSmUtilization: { unit: '%', minValue: 0, maxValue: 100, interval: 5 },
  gpuMemoryUsed: { unit: 'GB', minValue: 0, maxValue: 80, interval: 5 },
  tensorCoreUtilization: { unit: '%', minValue: 0, maxValue: 100, interval: 5 },
  cpuUtilization: { unit: '%', minValue: 0, maxValue: 100, interval: 5 },
  memoryUtilization: { unit: '%', minValue: 0, maxValue: 100, interval: 5 },
};

const nodeNames: Record<number, string> = {
  1: 'cpu104',
  2: 'cpu105',
  3: 'cpu106',
  4: 'cpu107',
  5: 'master-service',
  6: 'node023',
  7: 'node201',
  8: 'node-h100-01',
  9: 'node-a100-02',
  10: 'node-vgpu-03',
};

function generateHistoryData(
  startMs: number,
  endMs: number,
  intervalMs: number,
  minValue: number,
  maxValue: number,
): MetricDataPoint[] {
  const data: MetricDataPoint[] = [];
  let currentMs = startMs;

  while (currentMs <= endMs) {
    const baseValue = minValue + (maxValue - minValue) * 0.5;
    const variation = (maxValue - minValue) * 0.3;
    const noise = (Math.random() - 0.5) * variation;
    const trend = Math.sin((currentMs - startMs) / 3_600_000) * variation * 0.5;
    const value = Math.max(
      minValue,
      Math.min(maxValue, baseValue + noise + trend),
    );

    data.push({
      timestamp: new Date(currentMs).toISOString(),
      value: Math.round(value * 100) / 100,
    });

    currentMs += intervalMs;
  }

  return data;
}

export function getMockNodeMetricHistory(params: {
  endTime?: string;
  nodeId: number;
  startTime?: string;
}) {
  const endMs = params.endTime
    ? new Date(params.endTime).getTime()
    : Date.now();
  const startMs = params.startTime
    ? new Date(params.startTime).getTime()
    : endMs - 3_600_000;

  const allMetrics: NodeMetricHistory[] = Object.entries(metricConfigs).map(
    ([key, config]) => ({
      nodeId: params.nodeId,
      nodeName: nodeNames[params.nodeId] || 'unknown',
      metricKey: key,
      unit: config.unit,
      data: generateHistoryData(
        startMs,
        endMs,
        config.interval * 60_000,
        config.minValue,
        config.maxValue,
      ),
    }),
  );

  return allMetrics;
}

export const MOCK_CLUSTER_MONITOR = {
  stats: {
    totalNodes: 12,
    runningNodes: 10,
    totalGpu: 96,
    gpuUtilization: 75,
  },
  nodes: [
    {
      id: 1,
      name: 'node-01',
      ip: '192.168.1.101',
      status: '运行中',
      gpuUtilization: 85,
      gpuMemory: 68,
      temperature: 72,
      power: 320,
      gpuModel: 'NVIDIA H100',
      gpuTotal: 8,
      gpuUsed: 6,
      cpu: '128核',
      memory: '512GiB',
      region: '集群A',
    },
    {
      id: 2,
      name: 'node-02',
      ip: '192.168.1.102',
      status: '运行中',
      gpuUtilization: 92,
      gpuMemory: 75,
      temperature: 78,
      power: 345,
      gpuModel: 'NVIDIA H100',
      gpuTotal: 8,
      gpuUsed: 8,
      cpu: '128核',
      memory: '512GiB',
      region: '集群A',
    },
    {
      id: 3,
      name: 'node-03',
      ip: '192.168.1.103',
      status: '停止',
      gpuUtilization: 0,
      gpuMemory: 0,
      temperature: 35,
      power: 50,
      gpuModel: 'NVIDIA A100',
      gpuTotal: 8,
      gpuUsed: 0,
      cpu: '96核',
      memory: '256GiB',
      region: '集群B',
    },
    {
      id: 4,
      name: 'node-04',
      ip: '192.168.1.104',
      status: '运行中',
      gpuUtilization: 78,
      gpuMemory: 62,
      temperature: 68,
      power: 290,
      gpuModel: 'NVIDIA H100',
      gpuTotal: 8,
      gpuUsed: 7,
      cpu: '128核',
      memory: '512GiB',
      region: '集群A',
    },
    {
      id: 5,
      name: 'node-05',
      ip: '192.168.1.105',
      status: '运行中',
      gpuUtilization: 45,
      gpuMemory: 30,
      temperature: 58,
      power: 210,
      gpuModel: 'NVIDIA A100',
      gpuTotal: 8,
      gpuUsed: 5,
      cpu: '96核',
      memory: '256GiB',
      region: '集群B',
    },
  ],
  total: 12,
};
