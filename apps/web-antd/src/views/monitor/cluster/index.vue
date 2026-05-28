<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Empty,
  Row,
  Select,
} from 'ant-design-vue';
import { Download, Grid, List } from '@vben/icons';
import { EchartsUI, useEcharts } from '@vben/plugins/echarts';
import type { EchartsUIType } from '@vben/plugins/echarts';

const resourceSpec = ref<string>();
const autoRefresh = ref('40s');
const viewMode = ref<'grid' | 'list'>('grid');
const timeRange = ref();

// ECharts refs
const chart1Ref = ref<EchartsUIType>();
const chart2Ref = ref<EchartsUIType>();
const chart3Ref = ref<EchartsUIType>();

const { renderEcharts: renderChart1, resize: resizeChart1 } =
  useEcharts(chart1Ref);
const { renderEcharts: renderChart2, resize: resizeChart2 } =
  useEcharts(chart2Ref);
const { renderEcharts: renderChart3, resize: resizeChart3 } =
  useEcharts(chart3Ref);

const timeData = [
  '19:36',
  '19:37',
  '19:38',
  '19:39',
  '19:40',
  '19:41',
  '19:42',
  '19:43',
  '19:44',
  '19:45',
  '19:46',
  '19:47',
  '19:48',
  '19:49',
  '19:50',
  '19:51',
];

function handleViewModeChange(mode: 'grid' | 'list') {
  viewMode.value = mode;
  nextTick(() => {
    // 切换布局后，延迟触发 resize 以确保 ECharts 渲染响应新容器宽度
    setTimeout(() => {
      resizeChart1();
      resizeChart2();
      resizeChart3();
    }, 150);
  });
}

function initCharts() {
  // Chart 1: 集群GPU资源 (柱状 + 折线混搭)
  renderChart1({
    grid: {
      top: '12%',
      left: '3%',
      right: '3%',
      bottom: 50,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#666',
        fontSize: 11,
      },
    },
    xAxis: {
      type: 'category',
      data: timeData,
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
      interval: 2,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#999',
        fontSize: 10,
      },
    },
    series: [
      {
        name: 'GPU在使用',
        type: 'bar',
        stack: 'gpu',
        barWidth: 10,
        itemStyle: {
          color: '#1677ff',
        },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'GPU请求',
        type: 'bar',
        stack: 'gpu',
        barWidth: 10,
        itemStyle: {
          color: '#ffc069',
        },
        data: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      },
      {
        name: '集群GPU数量',
        type: 'line',
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#8c8c8c',
        },
        lineStyle: {
          color: '#8c8c8c',
          width: 2,
        },
        data: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      },
    ],
  });

  // Chart 2: 作业饱和度 (双柱状)
  renderChart2({
    grid: {
      top: '12%',
      left: '3%',
      right: '3%',
      bottom: 50,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#666',
        fontSize: 11,
      },
    },
    xAxis: {
      type: 'category',
      data: timeData,
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
      interval: 2,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#999',
        fontSize: 10,
      },
    },
    series: [
      {
        name: '集群空闲GPU卡',
        type: 'bar',
        stack: 'jobs',
        barWidth: 10,
        itemStyle: {
          color: '#d9d9d9',
        },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: '未调度任务GPU卡需求量',
        type: 'bar',
        stack: 'jobs',
        barWidth: 10,
        itemStyle: {
          color: '#ffa940',
        },
        data: [9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      },
    ],
  });

  // Chart 3: 集群资源碎片情况 (双柱状)
  renderChart3({
    grid: {
      top: '12%',
      left: '3%',
      right: '3%',
      bottom: 50,
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: '0%',
      left: 'center',
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: '#666',
        fontSize: 11,
      },
    },
    xAxis: {
      type: 'category',
      data: timeData,
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        color: '#999',
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1.0,
      interval: 0.2,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#999',
        fontSize: 10,
      },
    },
    series: [
      {
        name: 'GPU满载节点',
        type: 'bar',
        stack: 'nodes',
        barWidth: 10,
        itemStyle: {
          color: '#52c41a',
        },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: 'GPU空闲节点',
        type: 'bar',
        stack: 'nodes',
        barWidth: 10,
        itemStyle: {
          color: '#ff4d4f',
        },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  });
}

onMounted(() => {
  initCharts();
});
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-4">
      <!-- 头部操作栏：包含无标题筛选条件与下载按钮 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between">
          <!-- 左侧平铺所有筛选条件 -->
          <div class="flex items-center gap-4">
            <Select
              v-model:value="resourceSpec"
              allow-clear
              style="width: 220px"
              placeholder="请选择资源规格"
              :options="[
                { label: 'NVIDIA-GPU-HBM2E-80GB', value: 'gpu-80g' },
                { label: 'NVIDIA-H100', value: 'h100' },
              ]"
            />
            <Select
              v-model:value="autoRefresh"
              style="width: 100px"
              placeholder="自动刷新"
              :options="[
                { label: '40s', value: '40s' },
                { label: '60s', value: '60s' },
                { label: '关闭', value: 'off' },
              ]"
            />
            <DatePicker.RangePicker
              v-model:value="timeRange"
              :placeholder="['开始时间', '结束时间']"
              style="width: 260px"
            />
            <!-- 先显示所有筛选条件再显示下载按钮 -->
            <Button type="primary" class="flex items-center gap-1.5 ml-2">
              <template #icon><Download class="size-4" /></template>
              报表下载
            </Button>
          </div>
          <!-- 右侧切换展示方式（移至卡片右上角同一水平线） -->
          <div class="flex items-center gap-2 text-sm text-gray-500">
            <span>展示方式</span>
            <div class="flex border rounded overflow-hidden">
              <button
                class="px-2.5 py-1 flex items-center justify-center hover:bg-gray-100 transition-colors"
                :class="
                  viewMode === 'grid'
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-white text-gray-400'
                "
                @click="handleViewModeChange('grid')"
              >
                <Grid class="size-4" />
              </button>
              <button
                class="px-2.5 py-1 flex items-center justify-center hover:bg-gray-100 transition-colors border-l"
                :class="
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-500'
                    : 'bg-white text-gray-400'
                "
                @click="handleViewModeChange('list')"
              >
                <List class="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>

      <!-- 四个核心看板 动态网格 -->
      <Row :gutter="[16, 16]">
        <!-- 卡片 1 -->
        <Col :span="viewMode === 'grid' ? 12 : 24">
          <Card
            :bordered="false"
            class="shadow-sm h-full hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 pb-4 overflow-hidden"
          >
            <!-- 统一卡片左上角主标题 -->
            <div class="text-base font-semibold text-gray-800 mb-4 text-left">
              集群GPU资源
            </div>

            <div
              :class="
                viewMode === 'grid'
                  ? 'flex flex-col'
                  : 'flex flex-row items-stretch'
              "
            >
              <!-- 小卡片模式下的指标区 -->
              <div
                v-if="viewMode === 'grid'"
                class="border-b pb-2 mb-2 text-center"
              >
                <div class="my-2">
                  <span class="text-4xl font-bold text-blue-600">0.0%</span>
                </div>
                <div class="text-xs text-gray-400">集群GPU资源利用率</div>
              </div>
              <!-- 大卡片模式下的指标区 -->
              <div
                v-else
                class="flex flex-col justify-center items-center text-center pr-8 border-r border-gray-100 min-w-[200px] py-4 mr-8"
              >
                <div class="my-3">
                  <span class="text-5xl font-bold text-blue-600">0.0%</span>
                </div>
                <div class="text-xs text-gray-400">集群GPU资源利用率</div>
              </div>

              <!-- 统一的图表区 -->
              <div class="flex-1 min-w-0">
                <div class="text-gray-700 text-sm font-semibold mb-2">
                  利用率趋势
                </div>
                <div class="h-[240px]">
                  <EchartsUI ref="chart1Ref" />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <!-- 卡片 2 -->
        <Col :span="viewMode === 'grid' ? 12 : 24">
          <Card
            :bordered="false"
            class="shadow-sm h-full hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 pb-4 overflow-hidden"
          >
            <!-- 统一卡片左上角主标题 -->
            <div class="text-base font-semibold text-gray-800 mb-4 text-left">
              集群GPU卡数
            </div>

            <div
              :class="
                viewMode === 'grid'
                  ? 'flex flex-col'
                  : 'flex flex-row items-stretch'
              "
            >
              <!-- 小卡片模式下的指标区 -->
              <div v-if="viewMode === 'grid'" class="border-b pb-2 mb-2">
                <div class="flex items-center justify-around my-2">
                  <div class="text-center flex-1 border-r border-gray-100">
                    <div class="text-4xl font-bold text-gray-800">0</div>
                    <div class="text-xs text-gray-400 mt-1">集群GPU卡数</div>
                  </div>
                  <div class="text-center flex-1">
                    <div class="text-4xl font-bold text-amber-500">51</div>
                    <div class="text-xs text-gray-400 mt-1">
                      当前未调度任务数
                    </div>
                  </div>
                </div>
              </div>
              <!-- 大卡片模式下的指标区 -->
              <div
                v-else
                class="flex flex-col justify-center items-stretch text-center pr-8 border-r border-gray-100 min-w-[220px] gap-6 py-4 mr-8"
              >
                <div>
                  <div class="text-gray-500 text-xs font-medium mb-1">
                    集群GPU卡数
                  </div>
                  <div class="text-4xl font-bold text-gray-800">0</div>
                </div>
                <div>
                  <div class="text-gray-500 text-xs font-medium mb-1">
                    当前未调度任务数
                  </div>
                  <div class="text-4xl font-bold text-amber-500">51</div>
                </div>
              </div>

              <!-- 统一的图表区 -->
              <div class="flex-1 min-w-0">
                <div class="text-gray-700 text-sm font-semibold mb-2">
                  作业饱和度
                </div>
                <div class="h-[240px]">
                  <EchartsUI ref="chart2Ref" />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <!-- 卡片 3 -->
        <Col :span="viewMode === 'grid' ? 12 : 24">
          <Card
            :bordered="false"
            class="shadow-sm h-full hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 pb-4 overflow-hidden"
          >
            <!-- 统一卡片左上角主标题 -->
            <div class="text-base font-semibold text-gray-800 mb-4 text-left">
              GPU节点
            </div>

            <div
              :class="
                viewMode === 'grid'
                  ? 'flex flex-col'
                  : 'flex flex-row items-stretch'
              "
            >
              <!-- 小卡片模式下的指标区 -->
              <div
                v-if="viewMode === 'grid'"
                class="border-b pb-2 mb-2 text-center"
              >
                <div class="my-2">
                  <span class="text-4xl font-bold text-green-600">0</span>
                </div>
                <div class="text-xs text-gray-400">GPU满载节点</div>
              </div>
              <!-- 大卡片模式下的指标区 -->
              <div
                v-else
                class="flex flex-col justify-center items-center text-center pr-8 border-r border-gray-100 min-w-[200px] py-4 mr-8"
              >
                <div class="my-3">
                  <span class="text-5xl font-bold text-green-600">0</span>
                </div>
                <div class="text-xs text-gray-400">GPU满载节点</div>
              </div>

              <!-- 统一的图表区 -->
              <div class="flex-1 min-w-0">
                <div class="text-gray-700 text-sm font-semibold mb-2">
                  集群资源碎片情况
                </div>
                <div class="h-[240px]">
                  <EchartsUI ref="chart3Ref" />
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <!-- 卡片 4 -->
        <Col :span="viewMode === 'grid' ? 12 : 24">
          <Card
            :bordered="false"
            class="shadow-sm h-full hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 pb-4 overflow-hidden"
          >
            <!-- 统一卡片左上角主标题 -->
            <div class="text-base font-semibold text-gray-800 mb-4 text-left">
              碎片节点
            </div>

            <div
              :class="
                viewMode === 'grid'
                  ? 'flex flex-col'
                  : 'flex flex-row items-stretch'
              "
            >
              <!-- 小卡片模式下的指标区 -->
              <div
                v-if="viewMode === 'grid'"
                class="border-b pb-2 mb-2 text-center"
              >
                <div class="my-2">
                  <span class="text-4xl font-bold text-indigo-600">0</span>
                </div>
                <div class="text-xs text-gray-400">GPU碎片节点</div>
              </div>
              <!-- 大卡片模式下的指标区 -->
              <div
                v-else
                class="flex flex-col justify-center items-center text-center pr-8 border-r border-gray-100 min-w-[200px] py-4 mr-8"
              >
                <div class="my-3">
                  <span class="text-5xl font-bold text-indigo-600">0</span>
                </div>
                <div class="text-xs text-gray-400">GPU碎片节点</div>
              </div>

              <!-- 统一的空数据区 -->
              <div class="flex-1 min-w-0">
                <div class="text-gray-700 text-sm font-semibold mb-2">
                  碎片节点详情
                </div>
                <div class="h-[240px] flex items-center justify-center">
                  <Empty
                    :image="Empty.PRESENTED_IMAGE_SIMPLE"
                    description="暂无数据"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Page>
</template>
