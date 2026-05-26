<script setup lang="ts">
import { Button, Card, DatePicker, Select, Space, message } from 'ant-design-vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { IconifyIcon } from '@vben/icons';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';

import { getNodeList } from '#/api/node';
import { getNodeMetricHistory } from '#/api/monitor';

import MetricCardGroup from './components/MetricCardGroup.vue';

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

interface MetricHistoryData {
  data: MetricDataPoint[];
  metricKey: string;
  nodeId: number;
  nodeName: string;
  unit: string;
}

const { RangePicker } = DatePicker;

const nodes = ref<any[]>([]);
const selectedNode = ref<number>();
const nodesLoading = ref(false);
const metricsLoading = ref(false);
const metricHistory = ref<MetricHistoryData[]>([]);
const timeRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(1, 'hour'), dayjs()]);
const refreshInterval = ref(30);
const viewMode = ref<'large' | 'small'>('small');
let refreshTimer: null | ReturnType<typeof setInterval> = null;

const presets = computed(() => [
  { label: '最近1小时', value: [dayjs().subtract(1, 'hour'), dayjs()] },
  { label: '最近24小时', value: [dayjs().subtract(24, 'hour'), dayjs()] },
  { label: '最近7天', value: [dayjs().subtract(7, 'day'), dayjs()] },
]);

const refreshOptions = [
  { label: '关闭', value: 0 },
  { label: '10秒', value: 10 },
  { label: '30秒', value: 30 },
  { label: '60秒', value: 60 },
  { label: '120秒', value: 120 },
];

const nodeOptions = computed(() =>
  nodes.value.map((node) => ({
    label: `${node.name} (${node.ipAddress})`,
    value: node.id,
  })),
);

function resolveTimeRange() {
  if (timeRange.value && timeRange.value.length === 2) {
    return {
      startTime: timeRange.value[0].toISOString(),
      endTime: timeRange.value[1].toISOString(),
    };
  }
  return {
    startTime: dayjs().subtract(1, 'hour').toISOString(),
    endTime: dayjs().toISOString(),
  };
}

async function fetchNodeList() {
  nodesLoading.value = true;
  try {
    const res: any = await getNodeList();
    const payload = res?.data ?? res ?? {};
    nodes.value = Array.isArray(payload.list) ? payload.list : [];
    if (!selectedNode.value && nodes.value.length > 0) {
      selectedNode.value = nodes.value[0].id;
    }
  } catch {
    message.error('节点列表加载失败');
    nodes.value = [];
  } finally {
    nodesLoading.value = false;
  }
}

async function fetchMetricHistory() {
  if (!selectedNode.value) {
    metricHistory.value = [];
    return;
  }
  metricsLoading.value = true;
  try {
    const timeRangeParams = resolveTimeRange();
    const res: any = await getNodeMetricHistory({
      nodeId: selectedNode.value,
      ...timeRangeParams,
    });
    const payload = res?.data ?? res ?? {};
    metricHistory.value = Array.isArray(payload) ? payload : [];
  } catch {
    message.error('节点指标加载失败');
    metricHistory.value = [];
  } finally {
    metricsLoading.value = false;
  }
}

function resetAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  if (refreshInterval.value > 0) {
    refreshTimer = setInterval(() => {
      fetchMetricHistory();
    }, refreshInterval.value * 1000);
  }
}

function onDownloadReport() {
  message.success('报表下载已触发（原型）');
}

onMounted(async () => {
  await fetchNodeList();
  await fetchMetricHistory();
  resetAutoRefresh();
});

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer);
});
</script>

<template>
  <div class="p-4 space-y-4">
    <!-- 筛选条件卡片（独立卡片） -->
    <Card :loading="nodesLoading">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-gray-500">节点</span>
            <Select v-model:value="selectedNode" style="width: 220px" placeholder="请选择节点" :options="nodeOptions" @change="fetchMetricHistory" />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">时间范围</span>
            <RangePicker v-model:value="timeRange" :presets="presets" @change="fetchMetricHistory" style="width: 320px" />
          </div>
          <Button @click="onDownloadReport" :disabled="metricsLoading">
            <template #icon><IconifyIcon icon="lucide:download" class="size-4 inline-block align-middle" /></template>
            报表下载
          </Button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-gray-500">自动刷新</span>
          <Select v-model:value="refreshInterval" style="width: 100px" :options="refreshOptions" @change="resetAutoRefresh" />
        </div>
      </div>
    </Card>

    <!-- 指标区域头部：左标题 + 右展示方式图标 -->
    <div class="flex items-center justify-between">
      <span class="text-base font-medium">监控指标</span>
      <Space role="group" class="view-mode">
        <Button
          :type="viewMode === 'small' ? 'primary' : 'default'"
          @click="viewMode = 'small'"
        >
          <template #icon><IconifyIcon icon="lucide:layout-grid" class="size-4 inline-block align-middle" /></template>
        </Button>
        <Button
          :type="viewMode === 'large' ? 'primary' : 'default'"
          @click="viewMode = 'large'"
        >
          <template #icon><IconifyIcon icon="lucide:layout-list" class="size-4 inline-block align-middle" /></template>
        </Button>
      </Space>
    </div>

    <!-- 指标卡片网格（每个指标单独一个卡片） -->
    <MetricCardGroup :metrics="metricHistory" :view-mode="viewMode" :loading="metricsLoading" />
  </div>
</template>