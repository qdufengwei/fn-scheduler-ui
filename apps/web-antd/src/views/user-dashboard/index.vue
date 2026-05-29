<script setup lang="ts">
import { ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { Card, Col, Row, Select } from 'ant-design-vue';

// Lucide 图标引用
const PlaySquare = createIconifyIcon('lucide:play-square');
const Monitor = createIconifyIcon('lucide:monitor');
const Zap = createIconifyIcon('lucide:zap');
const Sliders = createIconifyIcon('lucide:sliders');
const Server = createIconifyIcon('lucide:server');
const CreditCard = createIconifyIcon('lucide:credit-card');
const Wallet = createIconifyIcon('lucide:wallet');
const CircleDollarSign = createIconifyIcon('lucide:circle-dollar-sign');

const billingPeriod = ref('day');
</script>

<template>
  <div class="p-6 min-h-full bg-[#f8fafc] space-y-6">
    <!-- 头部欢迎语大横幅，莫兰迪冷色科技渐变背景 -->
    <div
      class="relative overflow-hidden rounded-2xl border border-blue-50 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-8 shadow-sm"
    >
      <div class="relative z-10 flex flex-col gap-2">
        <h1 class="text-2xl font-bold tracking-tight text-slate-800">
          Hi, test01! 欢迎来到人工智能算力集群管理平台
        </h1>
        <p class="text-sm font-medium text-slate-500/80">
          全链路 · 全堆栈 · 分布式异构解决方案
        </p>
      </div>
      <!-- 背景光晕装饰，提升视觉高级感 -->
      <div
        class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-100/30 blur-3xl"
      ></div>
      <div
        class="absolute -bottom-20 right-20 h-64 w-64 rounded-full bg-indigo-100/30 blur-3xl"
      ></div>
    </div>

    <!-- 第一排：任务数量情况统计 (2/3) & 消息列表 (1/3) -->
    <Row :gutter="20">
      <!-- 任务数量情况统计 -->
      <Col :span="16">
        <Card :bordered="false" class="h-full rounded-2xl shadow-sm">
          <template #title>
            <span class="text-base font-semibold text-slate-800"
              >任务数量情况统计</span
            >
          </template>
          <div class="grid grid-cols-4 gap-4 py-2">
            <!-- 训练任务 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-slate-50/50 p-4 border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-blue-50 p-2 text-blue-500">
                  <PlaySquare class="h-5 w-5" />
                </div>
                <span class="text-sm font-medium text-slate-600">训练任务</span>
              </div>
              <div class="mt-4 flex flex-col">
                <span class="text-xs text-slate-400">总量</span>
                <span class="text-2xl font-bold text-slate-700">0</span>
              </div>
            </div>

            <!-- 开发机 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-slate-50/50 p-4 border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-indigo-50 p-2 text-indigo-500">
                  <Monitor class="h-5 w-5" />
                </div>
                <span class="text-sm font-medium text-slate-600">开发机</span>
              </div>
              <div class="mt-4 flex flex-col gap-1">
                <div class="flex justify-between items-end">
                  <div class="flex flex-col">
                    <span class="text-xs text-slate-400">总量</span>
                    <span class="text-2xl font-bold text-slate-700">1</span>
                  </div>
                  <div class="flex items-center gap-1.5 mb-1">
                    <span class="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span class="text-xs text-amber-500 font-medium"
                      >排队中 1</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 推理服务 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-slate-50/50 p-4 border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-emerald-50 p-2 text-emerald-500">
                  <Zap class="h-5 w-5" />
                </div>
                <span class="text-sm font-medium text-slate-600">推理服务</span>
              </div>
              <div class="mt-4 flex flex-col">
                <span class="text-xs text-slate-400">总量</span>
                <span class="text-2xl font-bold text-slate-700">0</span>
              </div>
            </div>

            <!-- 模型微调 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-slate-50/50 p-4 border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center gap-3">
                <div class="rounded-lg bg-purple-50 p-2 text-purple-500">
                  <Sliders class="h-5 w-5" />
                </div>
                <span class="text-sm font-medium text-slate-600">模型微调</span>
              </div>
              <div class="mt-4 flex flex-col">
                <span class="text-xs text-slate-400">总量</span>
                <span class="text-2xl font-bold text-slate-700">0</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <!-- 消息列表 -->
      <Col :span="8">
        <Card :bordered="false" class="h-full rounded-2xl shadow-sm">
          <template #title>
            <span class="text-base font-semibold text-slate-800">消息列表</span>
          </template>
          <template #extra>
            <a class="text-xs text-blue-600 font-medium hover:text-blue-500"
              >去查看 &gt;</a
            >
          </template>
          <div class="flex flex-col justify-center py-4 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="h-2 w-2 rounded-full bg-slate-300"></span>
                <span class="text-sm font-medium text-slate-500">通知</span>
                <span class="text-sm text-slate-700 font-semibold"
                  >宿主机启动</span
                >
              </div>
              <span class="text-xs text-slate-400 font-mono"
                >2026-03-04 03:00:33</span
              >
            </div>
            <!-- 占位空白以保持和左边统计卡片对齐 -->
            <div class="border-t border-dashed border-slate-100 pt-16"></div>
          </div>
        </Card>
      </Col>
    </Row>

    <!-- 第二排：资源概览 (2/3) & 计费 (1/3) -->
    <Row :gutter="20">
      <!-- 资源概览 -->
      <Col :span="16">
        <Card :bordered="false" class="rounded-2xl shadow-sm">
          <template #title>
            <span class="text-base font-semibold text-slate-800">资源概览</span>
          </template>
          <template #extra>
            <RouterLink
              to="/user-resource"
              class="text-xs text-blue-600 font-medium hover:text-blue-500"
            >
              去查看 &gt;
            </RouterLink>
          </template>
          <div class="grid grid-cols-3 gap-6 py-2">
            <!-- 标准实例 -->
            <div
              class="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-4">
                <div
                  class="flex items-center justify-center rounded-xl bg-blue-50 p-3 text-blue-500 shadow-inner"
                >
                  <Server class="h-7 w-7" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-slate-700"
                    >标准实例</span
                  >
                  <span class="text-xs text-slate-400 mt-0.5"
                    ><strong class="text-slate-700 text-sm font-bold">0</strong>
                    总计</span
                  >
                </div>
              </div>
              <div
                class="flex justify-between items-center text-xs px-1 text-slate-500 font-medium"
              >
                <span class="flex items-center gap-1"
                  ><span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span
                  >活跃 0</span
                >
                <span class="flex items-center gap-1"
                  ><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span
                  >空闲 0</span
                >
              </div>
              <div class="flex flex-col gap-1.5">
                <div
                  class="flex justify-between text-xs text-slate-400 font-medium"
                >
                  <span>利用率: 0%</span>
                </div>
                <div
                  class="h-2 w-full rounded-full bg-slate-100 overflow-hidden"
                >
                  <div
                    class="h-full bg-blue-500 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>
            </div>

            <!-- MIG实例 -->
            <div
              class="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-4">
                <div
                  class="flex items-center justify-center rounded-xl bg-indigo-50 p-3 text-indigo-500 shadow-inner"
                >
                  <Server class="h-7 w-7" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-slate-700"
                    >MIG实例</span
                  >
                  <span class="text-xs text-slate-400 mt-0.5"
                    ><strong class="text-slate-700 text-sm font-bold">0</strong>
                    总计</span
                  >
                </div>
              </div>
              <div
                class="flex justify-between items-center text-xs px-1 text-slate-500 font-medium"
              >
                <span class="flex items-center gap-1"
                  ><span class="h-1.5 w-1.5 rounded-full bg-indigo-500"></span
                  >活跃 0</span
                >
                <span class="flex items-center gap-1"
                  ><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span
                  >空闲 0</span
                >
              </div>
              <div class="flex flex-col gap-1.5">
                <div
                  class="flex justify-between text-xs text-slate-400 font-medium"
                >
                  <span>利用率: 0%</span>
                </div>
                <div
                  class="h-2 w-full rounded-full bg-slate-100 overflow-hidden"
                >
                  <div
                    class="h-full bg-indigo-500 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>
            </div>

            <!-- vGPU实例 -->
            <div
              class="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 bg-white hover:shadow-md transition-shadow"
            >
              <div class="flex items-center gap-4">
                <div
                  class="flex items-center justify-center rounded-xl bg-emerald-50 p-3 text-emerald-500 shadow-inner"
                >
                  <Server class="h-7 w-7" />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-slate-700"
                    >vGPU实例</span
                  >
                  <span class="text-xs text-slate-400 mt-0.5"
                    ><strong class="text-slate-700 text-sm font-bold">0</strong>
                    总计</span
                  >
                </div>
              </div>
              <div
                class="flex justify-between items-center text-xs px-1 text-slate-500 font-medium"
              >
                <span class="flex items-center gap-1"
                  ><span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span
                  >活跃 0</span
                >
                <span class="flex items-center gap-1"
                  ><span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span
                  >空闲 0</span
                >
              </div>
              <div class="flex flex-col gap-1.5">
                <div
                  class="flex justify-between text-xs text-slate-400 font-medium"
                >
                  <span>利用率: 0%</span>
                </div>
                <div
                  class="h-2 w-full rounded-full bg-slate-100 overflow-hidden"
                >
                  <div
                    class="h-full bg-emerald-500 rounded-full"
                    style="width: 0%"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>

      <!-- 计费 -->
      <Col :span="8">
        <Card :bordered="false" class="rounded-2xl shadow-sm">
          <template #title>
            <span class="text-base font-semibold text-slate-800">计费</span>
          </template>
          <template #extra>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <span class="text-xs text-slate-400">计费周期</span>
                <Select
                  v-model:value="billingPeriod"
                  style="width: 70px"
                  size="small"
                  :options="[
                    { label: '日', value: 'day' },
                    { label: '月', value: 'month' },
                    { label: '年', value: 'year' },
                  ]"
                />
              </div>
              <RouterLink
                to="/user-bill"
                class="text-xs text-blue-600 font-medium hover:text-blue-500"
              >
                去查看 &gt;
              </RouterLink>
            </div>
          </template>
          <div class="grid grid-cols-3 gap-3 py-2">
            <!-- 总使用量 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-blue-50/40 border border-blue-50 p-3 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center justify-between text-blue-500">
                <CreditCard class="h-4 w-4" />
              </div>
              <div class="mt-4 flex flex-col gap-1">
                <span class="text-xs text-slate-400">总使用量</span>
                <span class="text-sm font-bold text-slate-700">¥ 0.00</span>
              </div>
            </div>

            <!-- 待支付 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-emerald-50/40 border border-emerald-50 p-3 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center justify-between text-emerald-500">
                <Wallet class="h-4 w-4" />
              </div>
              <div class="mt-4 flex flex-col gap-1">
                <span class="text-xs text-slate-400">待支付</span>
                <span class="text-sm font-bold text-slate-700">¥ 0.00</span>
              </div>
            </div>

            <!-- 已支付 -->
            <div
              class="flex flex-col justify-between rounded-xl bg-rose-50/40 border border-rose-50 p-3 hover:shadow-md transition-all duration-300"
            >
              <div class="flex items-center justify-between text-rose-500">
                <CircleDollarSign class="h-4 w-4" />
              </div>
              <div class="mt-4 flex flex-col gap-1">
                <span class="text-xs text-slate-400">已支付</span>
                <span class="text-sm font-bold text-slate-700">¥ 0.00</span>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
