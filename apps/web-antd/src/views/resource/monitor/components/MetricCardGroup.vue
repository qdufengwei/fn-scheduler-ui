<script lang="ts" setup>
import { computed } from 'vue';

import MetricChart from './MetricChart.vue';

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

interface MetricHistoryData {
  nodeId: number;
  nodeName: string;
  metricKey: string;
  unit: string;
  data: MetricDataPoint[];
}

interface Props {
  metrics: MetricHistoryData[];
  viewMode: 'large' | 'small';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const metricLabels: Record<string, string> = {
  gpuPower: 'GPU功率',
  gpuTemperature: 'GPU温度',
  nvLinkBandwidth: 'NVLink带宽',
  nvLinkTxBytes: 'NVLink传输字节数',
  nvLinkRxBytes: 'NVLink接收字节数',
  gpuUtilization: 'GPU利用率',
  gpuMemoryUtilization: 'GPU显存利用率',
  gpuSmUtilization: 'GPU SM利用率',
  gpuMemoryUsed: 'GPU显存使用量',
  tensorCoreUtilization: 'GPU Tensor Core利用率',
  cpuUtilization: 'CPU使用量',
  memoryUtilization: '内存使用量',
};

const metricOrder = [
  'gpuPower',
  'gpuTemperature',
  'nvLinkBandwidth',
  'nvLinkTxBytes',
  'nvLinkRxBytes',
  'gpuUtilization',
  'gpuMemoryUtilization',
  'gpuSmUtilization',
  'gpuMemoryUsed',
  'tensorCoreUtilization',
  'cpuUtilization',
  'memoryUtilization',
];

const sortedMetrics = computed(() => {
  const metricMap = new Map(props.metrics.map((m) => [m.metricKey, m]));
  return metricOrder.map((key) => ({
    key,
    data: metricMap.get(key) || null,
    label: metricLabels[key] || key,
  }));
});

const gridClass = computed(() =>
  props.viewMode === 'large' ? 'metric-grid--large' : 'metric-grid--small',
);
</script>

<template>
  <div :class="gridClass">
    <MetricChart
      v-for="metric in sortedMetrics"
      :key="metric.key"
      :metric-key="metric.key"
      :title="metric.label"
      :data="metric.data"
      :size="viewMode"
      :loading="loading"
    />
  </div>
</template>

<style scoped>
div {
  display: grid;
  gap: 16px;
}

.metric-grid--small {
  grid-template-columns: repeat(3, 1fr);
}

.metric-grid--large {
  grid-template-columns: repeat(1, 1fr);
}

@media (max-width: 1200px) {
  .metric-grid--small {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .metric-grid--small {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>