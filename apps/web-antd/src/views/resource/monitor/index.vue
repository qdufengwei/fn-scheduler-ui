<script setup lang="ts">
import type { Dayjs } from 'dayjs';

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Card, DatePicker, Select, Space } from 'ant-design-vue';
import dayjs from 'dayjs';

import { showNotify } from '#/utils/notify';

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

const nodes = ref<any[]>([
  { id: 1, name: 'gpu-node-01', ipAddress: '10.0.1.101', status: '运行中' },
  { id: 2, name: 'gpu-node-02', ipAddress: '10.0.1.102', status: '运行中' },
  { id: 3, name: 'gpu-node-03', ipAddress: '10.0.1.103', status: '运行中' },
  { id: 4, name: 'gpu-node-04', ipAddress: '10.0.1.104', status: '停止' },
  { id: 5, name: 'gpu-node-05', ipAddress: '10.0.1.105', status: '运行中' },
  { id: 6, name: 'gpu-node-06', ipAddress: '10.0.1.106', status: '运行中' },
  { id: 7, name: 'gpu-node-07', ipAddress: '10.0.1.107', status: '运行中' },
  { id: 8, name: 'gpu-node-08', ipAddress: '10.0.1.108', status: '停止' },
]);
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

function fetchNodeList() {
  nodesLoading.value = true;
  // 模拟数据，直接使用本地 mock
  if (!selectedNode.value && nodes.value.length > 0) {
    selectedNode.value = nodes.value[0].id;
  }
  nodesLoading.value = false;
}

function fetchMetricHistory() {
  if (!selectedNode.value) {
    metricHistory.value = [];
    return;
  }
  metricsLoading.value = true;
  // 模拟数据，生成随机指标历史
  const now = Date.now();
  const node = nodes.value.find((n) => n.id === selectedNode.value);
  const nodeName = node?.name ?? '未知节点';
  const isRunning = node?.status === '运行中';
  const generatePoints = (base: number, variance: number) =>
    Array.from({ length: 12 }, (_, i) => ({
      timestamp: new Date(now - (11 - i) * 300_000).toISOString(),
      value: isRunning
        ? Math.round((base + (Math.random() - 0.5) * variance) * 10) / 10
        : 0,
    }));
  metricHistory.value = [
    {
      data: generatePoints(320, 40),
      metricKey: 'gpuPower',
      nodeId: selectedNode.value,
      nodeName,
      unit: 'W',
    },
    {
      data: generatePoints(72, 10),
      metricKey: 'gpuTemperature',
      nodeId: selectedNode.value,
      nodeName,
      unit: '°C',
    },
    {
      data: generatePoints(80, 20),
      metricKey: 'nvLinkBandwidth',
      nodeId: selectedNode.value,
      nodeName,
      unit: 'GB/s',
    },
    {
      data: generatePoints(500, 100),
      metricKey: 'nvLinkTxBytes',
      nodeId: selectedNode.value,
      nodeName,
      unit: 'GB',
    },
    {
      data: generatePoints(450, 80),
      metricKey: 'nvLinkRxBytes',
      nodeId: selectedNode.value,
      nodeName,
      unit: 'GB',
    },
    {
      data: generatePoints(78, 20),
      metricKey: 'gpuUtilization',
      nodeId: selectedNode.value,
      nodeName,
      unit: '%',
    },
    {
      data: generatePoints(65, 15),
      metricKey: 'gpuMemoryUtilization',
      nodeId: selectedNode.value,
      nodeName,
      unit: '%',
    },
    {
      data: generatePoints(70, 15),
      metricKey: 'gpuSmUtilization',
      nodeId: selectedNode.value,
      nodeName,
      unit: '%',
    },
    {
      data: generatePoints(52, 10),
      metricKey: 'gpuMemoryUsed',
      nodeId: selectedNode.value,
      nodeName,
      unit: 'GB',
    },
    {
      data: generatePoints(60, 20),
      metricKey: 'tensorCoreUtilization',
      nodeId: selectedNode.value,
      nodeName,
      unit: '%',
    },
    {
      data: generatePoints(45, 20),
      metricKey: 'cpuUtilization',
      nodeId: selectedNode.value,
      nodeName,
      unit: '%',
    },
    {
      data: generatePoints(62, 15),
      metricKey: 'memoryUtilization',
      nodeId: selectedNode.value,
      nodeName,
      unit: '%',
    },
  ];
  metricsLoading.value = false;
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
  showNotify('报表下载已触发（原型）');
}

onMounted(() => {
  fetchNodeList();
  fetchMetricHistory();
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
            <Select
              v-model:value="selectedNode"
              style="width: 220px"
              placeholder="请选择节点"
              :options="nodeOptions"
              @change="fetchMetricHistory"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">时间范围</span>
            <RangePicker
              v-model:value="timeRange"
              :presets="presets"
              @change="fetchMetricHistory"
              style="width: 320px"
            />
          </div>
          <Button @click="onDownloadReport" :disabled="metricsLoading">
            <template #icon>
              <IconifyIcon
                icon="lucide:download"
                class="size-4 inline-block align-middle"
              />
            </template>
            报表下载
          </Button>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-gray-500">自动刷新</span>
          <Select
            v-model:value="refreshInterval"
            style="width: 100px"
            :options="refreshOptions"
            @change="resetAutoRefresh"
          />
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
          <template #icon>
            <IconifyIcon
              icon="lucide:layout-grid"
              class="size-4 inline-block align-middle"
            />
          </template>
        </Button>
        <Button
          :type="viewMode === 'large' ? 'primary' : 'default'"
          @click="viewMode = 'large'"
        >
          <template #icon>
            <IconifyIcon
              icon="lucide:layout-list"
              class="size-4 inline-block align-middle"
            />
          </template>
        </Button>
      </Space>
    </div>

    <!-- 指标卡片网格（每个指标单独一个卡片） -->
    <MetricCardGroup
      :metrics="metricHistory"
      :view-mode="viewMode"
      :loading="metricsLoading"
    />
  </div>
</template>
