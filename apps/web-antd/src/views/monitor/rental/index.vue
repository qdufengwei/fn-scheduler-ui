<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Select,
  Space,
} from 'ant-design-vue';
import { Download } from '@vben/icons';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import type { EchartsUIType } from '@vben/plugins/echarts';

const { RangePicker } = DatePicker;

// 自动刷新配置
const autoRefresh = ref('40s');
const refreshOptions = [
  { label: '40s', value: '40s' },
  { label: '60s', value: '60s' },
  { label: '关闭', value: 'off' },
];

const refreshInterval = computed(() => {
  if (autoRefresh.value === 'off') return 0;
  return parseInt(autoRefresh.value.replace('s', ''), 10);
});

// GPU使用率趋势数据 (响应式历史列表)
const gpuUsageHistory = ref<
  { time: string; cluster1: number; cluster2: number; cluster3: number }[]
>([]);

function generateInitialData() {
  const data = [];
  const now = new Date();
  const count = 10;
  const interval = refreshInterval.value > 0 ? refreshInterval.value : 40;
  for (let i = count - 1; i >= 0; i--) {
    const timeObj = new Date(now.getTime() - i * interval * 1000);
    data.push({
      time: `${timeObj.getHours().toString().padStart(2, '0')}:${timeObj.getMinutes().toString().padStart(2, '0')}:${timeObj.getSeconds().toString().padStart(2, '0')}`,
      cluster1: Math.floor(75 + Math.random() * 20),
      cluster2: Math.floor(65 + Math.random() * 25),
      cluster3: Math.floor(60 + Math.random() * 30),
    });
  }
  gpuUsageHistory.value = data;
}

function addDataPoint() {
  const now = new Date();
  const newPoint = {
    time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
    cluster1: Math.floor(75 + Math.random() * 20),
    cluster2: Math.floor(65 + Math.random() * 25),
    cluster3: Math.floor(60 + Math.random() * 30),
  };
  gpuUsageHistory.value.push(newPoint);
  if (gpuUsageHistory.value.length > 15) {
    gpuUsageHistory.value.shift();
  }
}

let refreshTimer: ReturnType<typeof setInterval> | null = null;

function resetTimer() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
  if (refreshInterval.value === 0) return;
  refreshTimer = setInterval(() => {
    addDataPoint();
  }, refreshInterval.value * 1000);
}

// GPU 租售率静态分布数据
const gpuRentalData = ref({
  cluster1: { singleCard: 12, fullMachine: 8, notRented: 4 },
  cluster2: { singleCard: 15, fullMachine: 10, notRented: 6 },
  cluster3: { singleCard: 8, fullMachine: 5, notRented: 3 },
});

// Chart 实例化
const lineChartRef = ref<EchartsUIType>();
const barChartRef = ref<EchartsUIType>();

const { renderEcharts: renderLineChart, updateData: updateLineChart } =
  useEcharts(lineChartRef);
const { renderEcharts: renderBarChart } = useEcharts(barChartRef);

// ECharts options
const getLineChartOption = (): any => {
  const timeData = gpuUsageHistory.value.map((d) => d.time);
  return {
    tooltip: {
      trigger: 'axis',
      confine: true,
    },
    legend: {
      data: ['集群1', '集群2', '集群3'],
      bottom: 0,
      icon: 'circle',
    },
    grid: {
      left: 45,
      right: 16,
      top: 20,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timeData,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        color: '#999',
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 10,
        color: '#999',
      },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        name: '集群1',
        type: 'line',
        smooth: true,
        data: gpuUsageHistory.value.map((d) => d.cluster1),
        showSymbol: false,
        lineStyle: { width: 2, color: '#3b82f6' },
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: '集群2',
        type: 'line',
        smooth: true,
        data: gpuUsageHistory.value.map((d) => d.cluster2),
        showSymbol: false,
        lineStyle: { width: 2, color: '#10b981' },
        itemStyle: { color: '#10b981' },
      },
      {
        name: '集群3',
        type: 'line',
        smooth: true,
        data: gpuUsageHistory.value.map((d) => d.cluster3),
        showSymbol: false,
        lineStyle: { width: 2, color: '#8b5cf6' },
        itemStyle: { color: '#8b5cf6' },
      },
    ],
  };
};

const getBarChartOption = (): any => {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['单卡（已出租）', '整机独占（已出租）', '未出租'],
      bottom: 0,
      icon: 'rect',
    },
    grid: {
      left: 45,
      right: 16,
      top: 20,
      bottom: 40,
    },
    xAxis: {
      type: 'category',
      data: ['集群1', '集群2', '集群3'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        color: '#999',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 10,
        color: '#999',
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#f0f0f0',
        },
      },
    },
    series: [
      {
        name: '单卡（已出租）',
        type: 'bar',
        data: [
          gpuRentalData.value.cluster1.singleCard,
          gpuRentalData.value.cluster2.singleCard,
          gpuRentalData.value.cluster3.singleCard,
        ],
        itemStyle: { color: '#3b82f6' },
      },
      {
        name: '整机独占（已出租）',
        type: 'bar',
        data: [
          gpuRentalData.value.cluster1.fullMachine,
          gpuRentalData.value.cluster2.fullMachine,
          gpuRentalData.value.cluster3.fullMachine,
        ],
        itemStyle: { color: '#10b981' },
      },
      {
        name: '未出租',
        type: 'bar',
        data: [
          gpuRentalData.value.cluster1.notRented,
          gpuRentalData.value.cluster2.notRented,
          gpuRentalData.value.cluster3.notRented,
        ],
        itemStyle: { color: '#f97316' },
      },
    ],
  };
};

onMounted(() => {
  generateInitialData();
  renderLineChart(getLineChartOption());
  renderBarChart(getBarChartOption());
  resetTimer();
});

watch(
  gpuUsageHistory,
  () => {
    updateLineChart(getLineChartOption());
  },
  { deep: true },
);

watch(refreshInterval, () => {
  generateInitialData();
  updateLineChart(getLineChartOption());
  resetTimer();
});

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer);
  }
});
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-4">
      <!-- 筛选条件背景框 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <RangePicker style="width: 320px" />
            <Button type="primary" ghost>
              <template #icon><Download class="size-4" /></template>
              报表下载
            </Button>
          </div>
          <Space>
            <span class="text-sm text-gray-500">自动刷新</span>
            <Select
              v-model:value="autoRefresh"
              style="width: 100px"
              :options="refreshOptions"
            />
          </Space>
        </div>
      </Card>

      <!-- GPU使用率和GPU租售率一左一右，各占1/2 -->
      <Row :gutter="16">
        <!-- 左侧：GPU使用率趋势图（折线图） -->
        <Col :span="12">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <span class="font-semibold text-base">GPU使用率</span>
            </template>
            <EchartsUI ref="lineChartRef" height="400px" />
          </Card>
        </Col>

        <!-- 右侧：GPU单卡与GPU租售率 (两个独立卡片) -->
        <Col :span="12">
          <!-- 卡片 1: GPU单卡 -->
          <Card :bordered="false" class="shadow-sm">
            <template #title>
              <span class="font-semibold text-base">GPU单卡</span>
            </template>
            <Row :gutter="16">
              <Col :span="8">
                <div
                  class="text-center p-3 bg-blue-50/50 border border-blue-100 rounded-lg"
                >
                  <div class="text-2xl font-bold text-blue-600">44</div>
                  <div class="text-xs text-gray-500 mt-1">总数</div>
                </div>
              </Col>
              <Col :span="8">
                <div
                  class="text-center p-3 bg-green-50/50 border border-green-100 rounded-lg"
                >
                  <div class="text-2xl font-bold text-green-600">0</div>
                  <div class="text-xs text-gray-500 mt-1">已出租</div>
                </div>
              </Col>
              <Col :span="8">
                <div
                  class="text-center p-3 bg-orange-50/50 border border-orange-100 rounded-lg"
                >
                  <div class="text-2xl font-bold text-orange-600">32</div>
                  <div class="text-xs text-gray-500 mt-1">未出租</div>
                </div>
              </Col>
            </Row>
          </Card>

          <!-- 卡片 2: GPU租售率 -->
          <Card :bordered="false" class="shadow-sm">
            <template #title>
              <span class="font-semibold text-base">GPU租售率</span>
            </template>
            <EchartsUI ref="barChartRef" height="260px" />
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>
