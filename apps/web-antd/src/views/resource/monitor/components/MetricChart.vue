<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { computed, onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

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
  metricKey: string;
  title: string;
  data?: MetricHistoryData | null;
  size?: 'large' | 'small';
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  data: null,
  size: 'small',
  loading: false,
});

const chartRef = ref<EchartsUIType>();
const { renderEcharts, updateData } = useEcharts(chartRef);

const themeColor = ref('#1677ff');

const getThemeColor = () => {
  if (typeof window === 'undefined') return '#1677ff';
  const rootStyle = getComputedStyle(document.documentElement);
  const primaryVal = rootStyle.getPropertyValue('--primary').trim();
  if (primaryVal) {
    if (/^\d+(\s+|,\s*)\d+%\s+(\s+|,\s*)\d+%/.test(primaryVal)) {
      return `hsl(${primaryVal.split(/\s+/).join(', ')})`;
    }
    if (/^\d+\s+\d+%\s+\d+%/.test(primaryVal)) {
      return `hsl(${primaryVal})`;
    }
    return primaryVal.startsWith('#') || primaryVal.startsWith('rgb') || primaryVal.startsWith('hsl')
      ? primaryVal
      : `hsl(${primaryVal})`;
  }
  const antPrimary = rootStyle.getPropertyValue('--ant-primary-color').trim();
  return antPrimary || '#1677ff';
};

const colorWithOpacity = (color: string, opacity: number) => {
  if (color.startsWith('hsl')) {
    return color.replace('hsl', 'hsla').replace(')', `, ${opacity})`);
  }
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

const chartHeight = computed(() =>
  props.size === 'large' ? '280px' : '160px',
);

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

const getChartOption = (): any => {
  if (!props.data?.data?.length) {
    return {};
  }

  const primary = themeColor.value;
  const timeData = props.data.data.map((d) => formatTime(d.timestamp));
  const valueData = props.data.data.map((d) => d.value);

  return {
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter: (params: any) => {
        const point = params[0];
        return `
          <div style="padding: 4px 8px;">
            <div style="font-weight: 500; margin-bottom: 4px;">${point.axisValue}</div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${primary};"></span>
              <span>${props.title}: ${point.value}${props.data?.unit || ''}</span>
            </div>
          </div>
        `;
      },
    },
    grid: {
      left: props.size === 'large' ? 50 : 40,
      right: 16,
      top: 16,
      bottom: props.size === 'large' ? 30 : 20,
    },
    xAxis: {
      type: 'category' as const,
      boundaryGap: false,
      data: timeData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        color: '#999',
        interval: props.size === 'large' ? ('auto' as const) : 4,
      },
    },
    yAxis: {
      type: 'value' as const,
      name: props.data.unit,
      nameTextStyle: {
        fontSize: 10,
        color: '#999',
        padding: [0, 0, 0, -20],
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          type: 'dashed' as const,
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        fontSize: 10,
        color: '#999',
      },
    },
    series: [
      {
        type: 'line' as const,
        data: valueData,
        smooth: true,
        symbol: props.size === 'large' ? 'circle' : 'none',
        symbolSize: 4,
        lineStyle: {
          width: 2,
          color: primary,
        },
        areaStyle: {
          color: {
            type: 'linear' as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: colorWithOpacity(primary, 0.25) },
              { offset: 1, color: colorWithOpacity(primary, 0.02) },
            ],
          },
        },
      },
    ],
  };
};

watch(
  () => props.data,
  () => {
    if (props.data?.data?.length) {
      updateData(getChartOption());
    }
  },
  { deep: true },
);

onMounted(() => {
  themeColor.value = getThemeColor();
  if (props.data?.data?.length) {
    renderEcharts(getChartOption());
  }
});
</script>

<template>
  <div
    class="metric-chart"
    :class="{ 'metric-chart--large': size === 'large' }"
  >
    <div v-if="loading" class="metric-chart__loading">
      <span>加载中...</span>
    </div>
    <template v-else-if="data?.data?.length">
      <div class="metric-chart__header">
        <span class="metric-chart__title">{{ title }}</span>
        <span class="metric-chart__unit">{{ data.unit }}</span>
      </div>
      <EchartsUI ref="chartRef" :height="chartHeight" />
    </template>
    <div v-else class="metric-chart__empty">
      <span>暂无数据</span>
    </div>
  </div>
</template>

<style scoped>
.metric-chart {
  padding: 12px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.metric-chart:hover {
  box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
}

.metric-chart--large {
  padding: 16px;
}

.metric-chart__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.metric-chart__title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.metric-chart__unit {
  font-size: 12px;
  color: #999;
}

.metric-chart__loading,
.metric-chart__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 160px;
  font-size: 14px;
  color: #999;
}

.metric-chart--large .metric-chart__loading,
.metric-chart--large .metric-chart__empty {
  height: 280px;
}
</style>
