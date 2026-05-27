<script setup lang="ts">
import type { Dayjs } from 'dayjs';

import { computed, onBeforeUnmount, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Button, Card, DatePicker, Select, Space, Tag, Tooltip, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import MetricChart from '../../resource/monitor/components/MetricChart.vue';

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
  { id: 'train-qwen-0527', name: 'qwen2-7b-train-0527', runTime: '88h 7m 59s', status: '运行中', type: '训练任务' },
  { id: 'infer-chatglm-prod', name: 'chatglm3-infer-prod', runTime: '36h 12m 04s', status: '运行中', type: '推理服务' },
  { id: 'devbox-cuda', name: 'cuda-devbox-test', runTime: '5h 42m 31s', status: '已停止', type: '开发机' },
  { id: 'finetune-baichuan', name: 'baichuan-finetune-admin', runTime: '11h 26m 45s', status: '排队中', type: '模型微调' },
];

const metrics: MetricItem[] = [
  { key: 'cpu', title: 'CPU使用量', unit: '%', points: [12, 18, 21, 19, 26, 31, 28] },
  { key: 'memory', title: '内存使用量', unit: 'GB', points: [18, 18.4, 19.1, 20.2, 20.7, 21.3, 21.1] },
  { key: 'gpu', title: 'GPU利用率', unit: '%', points: [55, 63, 68, 72, 70, 76, 74] },
  { key: 'gpuMemory', title: 'GPU显存使用量', unit: 'GB', points: [28, 30, 31, 32, 31.5, 33, 34] },
  { key: 'networkIn', title: '网络入流量', unit: 'MB/s', points: [85, 92, 96, 88, 102, 110, 108] },
  { key: 'networkOut', title: '网络出流量', unit: 'MB/s', points: [41, 44, 39, 47, 52, 50, 55] },
  { key: 'diskRead', title: '磁盘读取', unit: 'MB/s', points: [120, 132, 128, 145, 151, 149, 156] },
  { key: 'diskWrite', title: '磁盘写入', unit: 'MB/s', points: [64, 70, 73, 69, 78, 82, 80] },
  { key: 'gpuTemp', title: 'GPU温度', unit: '℃', points: [58, 60, 61, 63, 62, 64, 65] },
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
const metricGridClass = computed(() => (viewMode.value === 'small' ? 'task-monitor__metrics--small' : 'task-monitor__metrics--large'));

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
  <Page auto-content-height content-class="task-monitor-page">
    <div class="task-monitor">
      <Card :bordered="false" class="task-monitor__panel">
        <section class="task-monitor__top">
          <div class="task-monitor__summary">
            <div class="task-monitor__title-row">
              <span class="task-monitor__name">{{ currentTask.name }}</span>
              <Tag :color="currentTask.status === '运行中' ? 'success' : currentTask.status === '排队中' ? 'warning' : 'default'">
                {{ currentTask.status }}
              </Tag>
              <Tag>{{ currentTask.type }}</Tag>
              <span class="task-monitor__runtime">
                <IconifyIcon icon="lucide:clock-3" class="size-4" />
                <span>已运行: {{ currentTask.runTime }}</span>
              </span>
            </div>
          </div>
          <div class="task-monitor__task-switch">
            <span class="task-monitor__label">切换任务</span>
            <Select v-model:value="taskType" class="task-monitor__select" :options="taskTypeOptions" />
            <Select v-model:value="taskId" class="task-monitor__name-select" :options="taskNameOptions" />
          </div>
        </section>
      </Card>

      <Card :bordered="false" class="task-monitor__panel">
        <section class="task-monitor__filters">
          <div class="task-monitor__filter-left">
            <Space>
              <span class="task-monitor__label">筛选条件</span>
              <Select v-model:value="aggregation" class="task-monitor__short-select" :options="aggregationOptions" />
            </Space>
            <Space>
              <span class="task-monitor__label">自动刷新</span>
              <Select v-model:value="autoRefresh" class="task-monitor__short-select" :options="refreshOptions" />
            </Space>
            <Space>
              <span class="task-monitor__label">时间范围</span>
              <RangePicker v-model:value="timeRange" class="task-monitor__range" />
            </Space>
            <Button type="primary" @click="onDownloadReport">
              <template #icon><IconifyIcon icon="lucide:download" class="size-4" /></template>
              报表下载
            </Button>
          </div>
          <Space align="center" class="task-monitor__view-switch">
            <span class="task-monitor__label">展示方式</span>
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

      <section class="task-monitor__metrics" :class="metricGridClass">
        <MetricChart v-for="metric in metrics" :key="metric.key" :data="toMetricChartData(metric)" :metric-key="metric.key" :size="viewMode" :title="metric.title" />
      </section>
    </div>
  </Page>
</template>

<style scoped>
:global(.task-monitor-page) {
  padding: 0 !important;
}

.task-monitor {
  min-height: 100%;
  padding: 12px;
  background:
    radial-gradient(circle at 92% -10%, rgb(214 225 255 / 72%), transparent 24%),
    linear-gradient(180deg, #f5f9ff 0%, #eef4fb 100%);
}

.task-monitor__panel {
  margin-bottom: 12px;
  border: 1px solid #edf1f7;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgb(15 23 42 / 4%);
}

:global(.task-monitor__panel > .ant-card-body) {
  padding: 0;
}

.task-monitor__top,
.task-monitor__filters {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.task-monitor__top {
  padding: 20px 28px;
}

.task-monitor__filters {
  flex-wrap: wrap;
  padding: 16px 28px;
}

.task-monitor__summary,
.task-monitor__title-row,
.task-monitor__runtime,
.task-monitor__task-switch,
.task-monitor__filter-left,
.task-monitor__filter-right {
  display: flex;
  align-items: center;
}

.task-monitor__summary {
  justify-content: space-between;
  flex: 1;
  min-width: 0;
  gap: 16px;
}

.task-monitor__title-row,
.task-monitor__task-switch,
.task-monitor__filter-left {
  min-width: 0;
  gap: 10px;
}

.task-monitor__name {
  overflow: hidden;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-monitor__runtime {
  flex-shrink: 0;
  gap: 6px;
  color: #4e5969;
  font-size: 13px;
}

.task-monitor__task-switch,
.task-monitor__filter-right {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 16px;
}

.task-monitor__filter-left {
  flex-wrap: wrap;
  flex: 1;
  gap: 12px;
  min-width: 0;
}

.task-monitor__view-switch {
  flex-shrink: 0;
}

.task-monitor__label {
  color: #6b7280;
  font-size: 13px;
  white-space: nowrap;
}

.task-monitor__select {
  width: 132px;
}

.task-monitor__name-select {
  width: 220px;
}

.task-monitor__short-select {
  width: 100px;
}

.task-monitor__range {
  width: 280px;
}

.task-monitor__metrics {
  display: grid;
  gap: 16px;
  margin-top: 12px;
}

.task-monitor__metrics--small {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.task-monitor__metrics--large {
  grid-template-columns: minmax(0, 1fr);
}

@media (max-width: 1200px) {
  .task-monitor__metrics--small {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .task-monitor__top,
  .task-monitor__summary,
  .task-monitor__task-switch,
  .task-monitor__filter-left,
  .task-monitor__filter-right,
  .task-monitor__view-switch {
    align-items: stretch;
    flex-direction: column;
  }

  .task-monitor__filters,
  .task-monitor__filter-right {
    justify-content: flex-start;
  }

  .task-monitor__select,
  .task-monitor__name-select,
  .task-monitor__short-select,
  .task-monitor__range {
    width: 100%;
  }

  .task-monitor__metrics--small {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
