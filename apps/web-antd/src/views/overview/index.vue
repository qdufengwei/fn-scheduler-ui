<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import {
  ArrowRight,
  BookOpenText,
  CircleAlert,
  Grid,
  Inbox,
  LayoutGrid,
  Settings,
} from '@vben/icons';

import { Button, Card, Col, Progress, Row, Select } from 'ant-design-vue';

const billingCycle = ref('day');
const taskStats = ref({
  training: { total: 4, queued: 2, running: 2 },
  devbox: { total: 1, queued: 1 },
  inference: { total: 0 },
  finetune: { total: 0 },
});

const nodeStats = ref({
  schedulable: 5,
  ready: 5,
  notReady: 2,
  unschedulable: 2,
});

const gpuServerStats = ref({ total: 6, running: 0 });

const billingStats = ref({
  totalIncome: 0,
  actualIncome: 0,
  pendingIncome: 0,
});

const messages = ref<any[]>([
  {
    id: 1,
    type: 'warning',
    title: '节点 gpu-node-06 进入维护状态',
    time: '2025-05-28 14:30',
  },
  {
    id: 2,
    type: 'info',
    title: '租户 test01 资源分配已更新',
    time: '2025-05-28 11:20',
  },
  {
    id: 3,
    type: 'error',
    title: '推理服务 baichuan2-13b-api-06 运行失败',
    time: '2025-05-27 16:45',
  },
  {
    id: 4,
    type: 'info',
    title: '新节点 gpu-node-11 已添加到集群',
    time: '2025-05-27 09:00',
  },
  {
    id: 5,
    type: 'success',
    title: '微调任务 qwen2.5-72b-lora-01 训练完成',
    time: '2025-05-26 20:15',
  },
  {
    id: 6,
    type: 'warning',
    title: 'GPU利用率超过90%阈值告警',
    time: '2025-05-26 15:30',
  },
  {
    id: 7,
    type: 'info',
    title: '系统将于6月1日进行例行维护升级',
    time: '2025-05-25 10:00',
  },
  {
    id: 8,
    type: 'success',
    title: '节点 gpu-node-09 MIG配置已生效',
    time: '2025-05-25 08:30',
  },
]);

const topologyStats = ref({
  singleTask: { current: 0, total: 6 },
  multiTask: { current: 1, total: 6 },
  offline: { current: 2, total: 6 },
  unschedulable: { current: 1, total: 6 },
  idle: { current: 2, total: 6 },
});
</script>

<template>
  <Page auto-content-height>
    <div class="p-4 space-y-4">
      <!-- 欢迎横幅 -->
      <Card
        class="bg-gradient-to-r from-blue-500 to-blue-600 border-none shadow-lg"
      >
        <div class="flex items-center justify-between py-2">
          <div>
            <div class="text-lg font-semibold text-white">
              Hi，admin！欢迎来到人工智能算力集群管理平台
            </div>
            <div class="mt-1 text-sm text-blue-100">
              全链路 · 全堆栈 · 分布式异构解决方案
            </div>
          </div>
          <Button
            type="primary"
            ghost
            class="border-white text-white hover:bg-white/20"
          >
            <template #icon><ArrowRight class="size-4" /></template>
            控制台
          </Button>
        </div>
      </Card>

      <!-- 任务数量情况统计 -->
      <Card :bordered="false" class="shadow-sm">
        <template #title>
          <div class="flex items-center gap-2">
            <Settings class="size-5 text-blue-500" />
            <span>任务数量情况统计</span>
          </div>
        </template>
        <Row :gutter="16">
          <Col :span="6">
            <div
              class="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4"
            >
              <div class="text-sm text-gray-600 mb-3">训练任务</div>
              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-xs text-gray-400">总量</span>
                <span class="text-3xl font-bold text-blue-600">{{
                  taskStats.training.total
                }}</span>
              </div>
              <div class="flex gap-4 text-sm">
                <div>
                  <span class="text-gray-400">排队中</span>
                  <span class="font-medium text-orange-500 ml-1">{{
                    taskStats.training.queued
                  }}</span>
                </div>
                <div>
                  <span class="text-gray-400">运行中</span>
                  <span class="font-medium text-green-500 ml-1">{{
                    taskStats.training.running
                  }}</span>
                </div>
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div
              class="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg p-4"
            >
              <div class="text-sm text-gray-600 mb-3">开发机</div>
              <div class="flex items-baseline gap-2 mb-3">
                <span class="text-xs text-gray-400">总量</span>
                <span class="text-3xl font-bold text-purple-600">{{
                  taskStats.devbox.total
                }}</span>
              </div>
              <div class="text-sm">
                <span class="text-gray-400">排队中</span>
                <span class="font-medium text-orange-500 ml-1">{{
                  taskStats.devbox.queued
                }}</span>
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div
              class="bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg p-4"
            >
              <div class="text-sm text-gray-600 mb-3">推理服务</div>
              <div class="flex items-baseline gap-2">
                <span class="text-xs text-gray-400">总量</span>
                <span class="text-3xl font-bold text-green-600">{{
                  taskStats.inference.total
                }}</span>
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div
              class="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-4"
            >
              <div class="text-sm text-gray-600 mb-3">模型微调</div>
              <div class="flex items-baseline gap-2">
                <span class="text-xs text-gray-400">总量</span>
                <span class="text-3xl font-bold text-orange-600">{{
                  taskStats.finetune.total
                }}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <!-- 第二行：节点信息、GPU服务器信息、计费、消息列表 -->
      <Row :gutter="16">
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <LayoutGrid class="size-5 text-green-500" />
                  <span>节点信息</span>
                </div>
                <a
                  class="text-xs text-blue-500 hover:text-blue-600 cursor-pointer flex items-center gap-1"
                >
                  去查看 <ArrowRight class="size-3" />
                </a>
              </div>
            </template>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-3 bg-green-50 rounded-lg"
              >
                <span class="text-sm text-gray-600">可调度的</span>
                <span class="text-2xl font-bold text-green-600">{{
                  nodeStats.schedulable
                }}</span>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div class="text-center p-2 bg-gray-50 rounded">
                  <div class="text-xs text-gray-400">就绪</div>
                  <div class="text-lg font-semibold text-gray-700">
                    {{ nodeStats.ready }}
                  </div>
                </div>
                <div class="text-center p-2 bg-gray-50 rounded">
                  <div class="text-xs text-gray-400">未就绪</div>
                  <div class="text-lg font-semibold text-red-500">
                    {{ nodeStats.notReady }}
                  </div>
                </div>
              </div>
              <div class="text-center p-2 bg-red-50 rounded-lg">
                <div class="text-xs text-gray-400">不可调度的</div>
                <div class="text-lg font-semibold text-red-600">
                  {{ nodeStats.unschedulable }}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <div class="flex items-center gap-2">
                <CircleAlert class="size-5 text-purple-500" />
                <span>GPU服务器信息</span>
              </div>
            </template>
            <div class="space-y-4">
              <div
                class="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-lg"
              >
                <div>
                  <div class="text-xs text-gray-400">总量</div>
                  <div class="text-3xl font-bold text-purple-600">
                    {{ gpuServerStats.total }}
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-gray-400">运行中</div>
                  <div class="text-3xl font-bold text-green-600">
                    {{ gpuServerStats.running }}
                  </div>
                </div>
              </div>
              <div class="text-center">
                <Progress
                  type="circle"
                  :percent="
                    (gpuServerStats.running / gpuServerStats.total) * 100
                  "
                  :size="100"
                  stroke-color="#722ed1"
                />
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <div class="flex items-center gap-2">
                <BookOpenText class="size-5 text-orange-500" />
                <span>计费</span>
              </div>
            </template>
            <div class="mb-4">
              <div class="flex items-center gap-2">
                <span class="text-xs text-gray-500">计费周期</span>
                <Select
                  v-model:value="billingCycle"
                  size="small"
                  style="width: 80px"
                  :options="[
                    { label: '日', value: 'day' },
                    { label: '周', value: 'week' },
                    { label: '月', value: 'month' },
                  ]"
                />
              </div>
            </div>
            <div class="space-y-3">
              <div
                class="flex justify-between items-center p-2 bg-blue-50 rounded"
              >
                <span class="text-xs text-gray-500">总收入</span>
                <span class="font-semibold text-blue-600"
                  >¥{{ billingStats.totalIncome.toFixed(2) }}</span
                >
              </div>
              <div
                class="flex justify-between items-center p-2 bg-green-50 rounded"
              >
                <span class="text-xs text-gray-500">实际收入</span>
                <span class="font-semibold text-green-600"
                  >¥{{ billingStats.actualIncome.toFixed(2) }}</span
                >
              </div>
              <div
                class="flex justify-between items-center p-2 bg-orange-50 rounded"
              >
                <span class="text-xs text-gray-500">待收入</span>
                <span class="font-semibold text-orange-600"
                  >¥{{ billingStats.pendingIncome.toFixed(2) }}</span
                >
              </div>
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Inbox class="size-5 text-blue-500" />
                  <span>消息列表</span>
                </div>
                <a
                  class="text-xs text-blue-500 hover:text-blue-600 cursor-pointer flex items-center gap-1"
                >
                  去查看 <ArrowRight class="size-3" />
                </a>
              </div>
            </template>
            <div
              v-if="messages.length === 0"
              class="text-center py-8 text-gray-400"
            >
              <Inbox class="size-10 mx-auto mb-2 opacity-30" />
              <div class="text-sm">暂无数据</div>
            </div>
            <div v-else class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="msg in messages"
                :key="msg.id"
                class="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <span
                  class="mt-1 size-2 rounded-full shrink-0"
                  :class="{
                    'bg-blue-500': msg.type === 'info',
                    'bg-green-500': msg.type === 'success',
                    'bg-orange-500': msg.type === 'warning',
                    'bg-red-500': msg.type === 'error',
                  }"
                ></span>
                <div class="min-w-0 flex-1">
                  <div class="text-sm text-gray-700 truncate">
                    {{ msg.title }}
                  </div>
                  <div class="text-xs text-gray-400 mt-0.5">
                    {{ msg.time }}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <!-- 任务拓扑 -->
      <Card :bordered="false" class="shadow-sm">
        <template #title>
          <div class="flex items-center gap-2">
            <Grid class="size-5 text-indigo-500" />
            <span>任务拓扑</span>
          </div>
        </template>
        <Row :gutter="16">
          <Col :span="4" v-for="(stat, key) in topologyStats" :key="key">
            <div
              class="text-center p-4 rounded-lg"
              :class="{
                'bg-blue-50': key === 'singleTask',
                'bg-green-50': key === 'multiTask',
                'bg-gray-100': key === 'offline',
                'bg-red-50': key === 'unschedulable',
                'bg-yellow-50': key === 'idle',
              }"
            >
              <div class="text-xs text-gray-600 mb-2">
                {{
                  key === 'singleTask'
                    ? '单任务节点'
                    : key === 'multiTask'
                      ? '多任务节点'
                      : key === 'offline'
                        ? '离线节点'
                        : key === 'unschedulable'
                          ? '不可调度节点'
                          : '空闲节点'
                }}
              </div>
              <div
                class="text-lg font-semibold"
                :class="{
                  'text-blue-600': key === 'singleTask',
                  'text-green-600': key === 'multiTask',
                  'text-gray-600': key === 'offline',
                  'text-red-600': key === 'unschedulable',
                  'text-yellow-600': key === 'idle',
                }"
              >
                {{ stat.current }}/{{ stat.total }}
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  </Page>
</template>
