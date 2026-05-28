// 节点监控历史数据 Mock API
import { defineEventHandler, getQuery } from 'h3';

// 监控指标类型
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

// 生成指定时间范围的历史数据
function generateHistoryData(
  startTime: Date,
  endTime: Date,
  intervalMinutes: number,
  minValue: number,
  maxValue: number,
): MetricDataPoint[] {
  const data: MetricDataPoint[] = [];
  const current = new Date(startTime);

  while (current <= endTime) {
    // 生成带有一定趋势的随机值
    const baseValue = minValue + (maxValue - minValue) * 0.5;
    const variation = (maxValue - minValue) * 0.3;
    const noise = (Math.random() - 0.5) * variation;
    const trend =
      Math.sin((current.getTime() - startTime.getTime()) / 3600000) *
      variation *
      0.5;
    const value = Math.max(
      minValue,
      Math.min(maxValue, baseValue + noise + trend),
    );

    data.push({
      timestamp: current.toISOString(),
      value: Math.round(value * 100) / 100,
    });

    current.setMinutes(current.getMinutes() + intervalMinutes);
  }

  return data;
}

// 指标配置
const metricConfigs: Record<
  string,
  { unit: string; minValue: number; maxValue: number; interval: number }
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

// 节点名称映射
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

export default defineEventHandler((event) => {
  const query = getQuery(event);
  const { nodeId, metricKey, startTime, endTime } = query;

  // 解析时间范围，默认最近1小时
  const end = endTime ? new Date(endTime as string) : new Date();
  const start = startTime
    ? new Date(startTime as string)
    : new Date(end.getTime() - 3600000);

  // 如果指定了单个指标
  if (nodeId && metricKey) {
    const config = metricConfigs[metricKey as string];
    if (!config) {
      return {
        code: 400,
        message: `Unknown metric key: ${metricKey}`,
        data: null,
      };
    }

    const data: NodeMetricHistory = {
      nodeId: Number(nodeId),
      nodeName: nodeNames[Number(nodeId)] || 'unknown',
      metricKey: metricKey as string,
      unit: config.unit,
      data: generateHistoryData(
        start,
        end,
        config.interval,
        config.minValue,
        config.maxValue,
      ),
    };

    return {
      code: 0,
      message: 'success',
      data,
    };
  }

  // 如果指定了节点，返回所有指标
  if (nodeId) {
    const allMetrics: NodeMetricHistory[] = Object.entries(metricConfigs).map(
      ([key, config]) => ({
        nodeId: Number(nodeId),
        nodeName: nodeNames[Number(nodeId)] || 'unknown',
        metricKey: key,
        unit: config.unit,
        data: generateHistoryData(
          start,
          end,
          config.interval,
          config.minValue,
          config.maxValue,
        ),
      }),
    );

    return {
      code: 0,
      message: 'success',
      data: allMetrics,
    };
  }

  // 返回所有节点所有指标（数据量较大，谨慎使用）
  const allNodeMetrics: NodeMetricHistory[] = [];
  for (const [id, name] of Object.entries(nodeNames)) {
    for (const [key, config] of Object.entries(metricConfigs)) {
      allNodeMetrics.push({
        nodeId: Number(id),
        nodeName: name,
        metricKey: key,
        unit: config.unit,
        data: generateHistoryData(
          start,
          end,
          config.interval,
          config.minValue,
          config.maxValue,
        ).slice(-10), // 只返回最近10个点，避免数据量过大
      });
    }
  }

  return {
    code: 0,
    message: 'success',
    data: allNodeMetrics,
  };
});
