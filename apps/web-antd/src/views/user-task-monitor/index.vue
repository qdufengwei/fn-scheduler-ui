<script setup lang="ts">
import type { Dayjs } from 'dayjs';

import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { IconifyIcon } from '@vben/icons';

import { Button, Card, DatePicker, Select, Space, Tag, Tooltip, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import MetricChart from '../resource/monitor/components/MetricChart.vue';

interface MetricItem {
  key: string;
  points: number[];
  title: string;
  unit: string;
}

interface TaskItem {
  id: string;
  name: string;
  runTime: string;
  status: '排队中' | '运行中' | '已停止';
  type: string;
}

const RangePicker = DatePicker.RangePicker;

const tasks: TaskItem[] = [
  { id: 'user-train-test1', name: '测试1', runTime: '7h 18m 26s', status: '运行中', type: '训练任务' },
  { id: 'user-devbox-a10', name: '开发机-a10', runTime: '2h 06m 11s', status: '运行中', type: '开发机' },
  { id: 'user-finetune-demo', name: '微调任务-demo', runTime: '0h 42m 08s', status: '排队中', type: '模型微调' },
];

const metrics: MetricItem[] = [
  { key: 'cpu', title: 'CPU使用量', unit: '%', points: [8, 12, 15, 18, 17, 22, 24] },
  { key: 'memory', title: '内存使用量', unit: 'GB', points: [10, 10.4, 10.9, 11.2, 11.8, 12.1, 12] },
  { key: 'gpu', title: 'GPU利用率', unit: '%', points: [42, 48, 51, 57, 55, 60, 64] },
  { key: 'gpuMemory', title: 'GPU显存使用量', unit: 'GB', points: [16, 17, 17.4, 18.1, 18.5, 19, 19.2] },
  { key: 'networkIn', title: '网络入流量', unit: 'MB/s', points: [34, 39, 42, 37, 45, 48, 46] },
  { key: 'networkOut', title: '网络出流量', unit: 'MB/s', points: [22, 24, 23, 27, 31, 29, 32] },
  { key: 'diskRead', title: '磁盘读取', unit: 'MB/s', points: [72, 76, 80, 84, 82, 88, 91] },
  { key: 'diskWrite', title: '磁盘写入', unit: 'MB/s', points: [38, 40, 43, 41, 46, 49, 48] },
  { key: 'gpuTemp', title: 'GPU温度', unit: '℃', points: [52, 54, 55, 57, 56, 58, 59] },
];

const taskType = ref(tasks[0]?.type);
const taskId = ref(tasks[0]?.id);
const aggregation = ref<'avg' | 'max' | 'median' | 'min' | 'raw'>('avg');
const autoRefresh = ref(40);
const viewMode = ref<'large' | 'small'>('small');
const timeRange = ref<[Dayjs, Dayjs]>([dayjs().subtract(1, 'hour'), dayjs()]);
let refreshTimer: null | ReturnType<typeof setInterval> = null;

const aggregationOptions = [
  { label: '原始值', value: 'raw' },
  { label: '平均值', value: 'avg' },
  { label: '中位数', value: 'median' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
];

const refreshOptions = [
  { label: '关闭', value: 0 },
  { label: '10s', value: 10 },
  { label: '30s', value: 30 },
  { label: '40s', value: 40 },
  { label: '60s', value: 60 },
  { label: '120s', value: 120 },
];

const taskTypeOptions = computed(() =>
  Array.from(new Set(tasks.map((task) => task.type))).map((type) => ({
    label: type,
    value: type,
  })),
);

const taskNameOptions = computed(() =>
  tasks
    .filter((task) => !taskType.value || task.type === taskType.value)
    .map((task) => ({
      label: task.name,
      value: task.id,
    })),
);

const currentTask = computed<TaskItem>(() => tasks.find((task) => task.id === taskId.value) ?? tasks[0]!);
const metricGridClass = computed(() => (viewMode.value === 'small' ? 'user-task-monitor__metrics--small' : 'user-task-monitor__metrics--large'));

function toMetricChartData(metric: MetricItem) {
  return {
    data: metric.points.map((value, index) => ({
      timestamp: dayjs()
        .subtract(metric.points.length - index - 1, 'minute')
        .toISOString(),
      value,
    })),
    metricKey: metric.key,
    nodeId: 1,
    nodeName: currentTask.value.name,
    unit: metric.unit,
  };
}

function resetAutoRefresh() {
  if (refreshTimer) clearInterval(refreshTimer);
  if (autoRefresh.value > 0) {
    refreshTimer = setInterval(() => {}, autoRefresh.value * 1000);
  }
}

function onDownloadReport() {
  message.success(`正在按${aggregationOptions.find((item) => item.value === aggregation.value)?.label}生成报表`);
}

watch(taskType, () => {
  taskId.value = taskNameOptions.value[0]?.value;
});

watch(autoRefresh, resetAutoRefresh, { immediate: true });

onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer);
});
</script>

<template>
  <div class="user-task-monitor">
    <Card :bordered="false" class="user-task-monitor__panel">
      <section class="user-task-monitor__top">
        <div class="user-task-monitor__summary">
          <div class="user-task-monitor__title-row">
            <span class="user-task-monitor__name">{{ currentTask.name }}</span>
            <Tag :color="currentTask.status === '运行中' ? 'success' : currentTask.status === '排队中' ? 'warning' : 'default'">
              {{ currentTask.status }}
            </Tag>
            <Tag>{{ currentTask.type }}</Tag>
            <span class="user-task-monitor__runtime">
              <IconifyIcon icon="lucide:clock-3" class="size-4" />
              <span>已运行: {{ currentTask.runTime }}</span>
            </span>
          </div>
        </div>
        <div class="user-task-monitor__task-switch">
          <span class="user-task-monitor__label">切换任务</span>
          <Select v-model:value="taskType" class="user-task-monitor__select" :options="taskTypeOptions" />
          <Select v-model:value="taskId" class="user-task-monitor__name-select" :options="taskNameOptions" />
        </div>
      </section>
    </Card>

    <Card :bordered="false" class="user-task-monitor__panel">
      <section class="user-task-monitor__filters">
        <div class="user-task-monitor__filter-left">
          <Space>
            <span class="user-task-monitor__label">筛选条件</span>
            <Select v-model:value="aggregation" class="user-task-monitor__short-select" :options="aggregationOptions" />
          </Space>
          <Space>
            <span class="user-task-monitor__label">自动刷新</span>
            <Select v-model:value="autoRefresh" class="user-task-monitor__short-select" :options="refreshOptions" />
          </Space>
          <Space>
            <span class="user-task-monitor__label">时间范围</span>
            <RangePicker v-model:value="timeRange" class="user-task-monitor__range" />
          </Space>
          <Button type="primary" @click="onDownloadReport">
            <template #icon><IconifyIcon icon="lucide:download" class="size-4" /></template>
            报表下载
          </Button>
        </div>
        <Space align="center" class="user-task-monitor__view-switch">
          <span class="user-task-monitor__label">展示方式</span>
          <Tooltip title="小卡片">
            <Button :type="viewMode === 'small' ? 'primary' : 'default'" @click="viewMode = 'small'">
              <template #icon><IconifyIcon icon="lucide:layout-grid" class="size-4" /></template>
            </Button>
          </Tooltip>
          <Tooltip title="大卡片">
            <Button :type="viewMode === 'large' ? 'primary' : 'default'" @click="viewMode = 'large'">
              <template #icon><IconifyIcon icon="lucide:list" class="size-4" /></template>
            </Button>
          </Tooltip>
        </Space>
      </section>
    </Card>

    <section class="user-task-monitor__metrics" :class="metricGridClass">
      <MetricChart v-for="metric in metrics" :key="metric.key" :data="toMetricChartData(metric)" :metric-key="metric.key" :size="viewMode" :title="metric.title" />
    </section>
  </div>
</template>

<style scoped>
.user-task-monitor {
  min-height: 100%;
  padding: 12px;
  background:
    radial-gradient(circle at 92% -10%, rgb(214 225 255 / 72%), transparent 24%),
    linear-gradient(180deg, #f5f9ff 0%, #eef4fb 100%);
}

.user-task-monitor__panel {
  margin-bottom: 12px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 4%);
}

:global(.user-task-monitor__panel > .ant-card-body) {
  padding: 0;
}

.user-task-monitor__top,
.user-task-monitor__filters {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.user-task-monitor__top {
  padding: 20px 28px;
}

.user-task-monitor__filters {
  flex-wrap: wrap;
  padding: 16px 28px;
}

.user-task-monitor__summary,
.user-task-monitor__title-row,
.user-task-monitor__runtime,
.user-task-monitor__task-switch,
.user-task-monitor__filter-left,
.user-task-monitor__filter-right {
  display: flex;
  align-items: center;
}

.user-task-monitor__summary {
  flex: 1;
  gap: 16px;
  justify-content: space-between;
  min-width: 0;
}

.user-task-monitor__title-row,
.user-task-monitor__task-switch,
.user-task-monitor__filter-left {
  gap: 10px;
  min-width: 0;
}

.user-task-monitor__name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 22px;
  font-weight: 700;
  color: #1f2329;
  white-space: nowrap;
}

.user-task-monitor__runtime {
  flex-shrink: 0;
  gap: 6px;
  font-size: 13px;
  color: #4e5969;
}

.user-task-monitor__task-switch,
.user-task-monitor__filter-right {
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-end;
}

.user-task-monitor__filter-left {
  flex: 1;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}

.user-task-monitor__view-switch {
  flex-shrink: 0;
}

.user-task-monitor__label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.user-task-monitor__select {
  width: 132px;
}

.user-task-monitor__name-select {
  width: 220px;
}

.user-task-monitor__short-select {
  width: 100px;
}

.user-task-monitor__range {
  width: 280px;
}

.user-task-monitor__metrics {
  display: grid;
  gap: 16px;
  margin-top: 12px;
}

.user-task-monitor__metrics--small {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.user-task-monitor__metrics--large {
  grid-template-columns: minmax(0, 1fr);
}

@media (max-width: 1200px) {
  .user-task-monitor__metrics--small {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .user-task-monitor__top,
  .user-task-monitor__summary,
  .user-task-monitor__task-switch,
  .user-task-monitor__filter-left,
  .user-task-monitor__filter-right,
  .user-task-monitor__view-switch {
    flex-direction: column;
    align-items: stretch;
  }

  .user-task-monitor__filters,
  .user-task-monitor__filter-right {
    justify-content: flex-start;
  }

  .user-task-monitor__select,
  .user-task-monitor__name-select,
  .user-task-monitor__short-select,
  .user-task-monitor__range {
    width: 100%;
  }

  .user-task-monitor__metrics--small {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
