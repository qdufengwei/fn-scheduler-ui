<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Col, DatePicker, Progress, Row, Select, Space, Table, Tag } from 'ant-design-vue';
import { Inbox, Download, Grid, List, CircleAlert, Settings } from '@vben/icons';

const taskType = ref<string>();
const taskName = ref('test');
const filterType = ref('avg');
const autoRefresh = ref('40s');
const viewMode = ref('grid');

const currentTask = ref({
  name: 'test',
  status: '运行中',
  type: 'CPU',
  runTime: '60h 40m 48s',
});

const columns = [
  { title: '指标', dataIndex: 'metric' },
  { title: '当前值', dataIndex: 'value' },
  { title: '最大值', dataIndex: 'max' },
  { title: '最小值', dataIndex: 'min' },
  { title: '平均值', dataIndex: 'avg' },
];

const metrics = ref([
  { id: 1, metric: 'CPU使用量', value: '45%', max: '80%', min: '20%', avg: '42%' },
  { id: 2, metric: '内存使用量', value: '62%', max: '75%', min: '40%', avg: '58%' },
]);
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-4">
      <!-- 当前任务信息 -->
      <Card :bordered="false" class="shadow-sm bg-gradient-to-r from-green-500 to-green-600">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-white">
              <span class="text-xl font-semibold">{{ currentTask.name }}</span>
              <Tag color="processing" class="rounded-full">{{ currentTask.status }}</Tag>
              <Tag class="rounded-full">{{ currentTask.type }}</Tag>
            </div>
            <div class="flex items-center gap-2 text-white/90">
              <Inbox class="size-4" />
              <span class="text-sm">已运行:</span>
              <span class="font-semibold">{{ currentTask.runTime }}</span>
            </div>
          </div>
          <Button type="primary" ghost class="border-white text-white hover:bg-white/20">
            <template #icon><Download class="size-4" /></template>
            报表下载
          </Button>
        </div>
      </Card>

      <!-- 筛选条件 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between">
          <Space>
            <span class="text-sm text-gray-500">切换任务</span>
            <Select
              v-model:value="taskType"
              allow-clear
              style="width: 140px"
              placeholder="任务类型"
              :options="[{ label: '训练任务', value: 'training' }, { label: '推理服务', value: 'inference' }, { label: '开发机', value: 'devbox' }, { label: '模型微调', value: 'finetune' }]"
            />
            <Select
              v-model:value="taskName"
              style="width: 180px"
              :options="[{ label: 'test', value: 'test' }, { label: 'cpu6', value: 'cpu6' }]"
            />
          </Space>
          <div class="flex items-center gap-6">
            <Space>
              <span class="text-sm text-gray-500">筛选条件</span>
              <Select v-model:value="filterType" style="width: 100px" :options="[{ label: '平均值', value: 'avg' }, { label: '最大值', value: 'max' }, { label: '最小值', value: 'min' }]" />
            </Space>
            <Space>
              <span class="text-sm text-gray-500">自动刷新</span>
              <Select v-model:value="autoRefresh" style="width: 100px" :options="[{ label: '40s', value: '40s' }, { label: '60s', value: '60s' }, { label: '关闭', value: 'off' }]" />
            </Space>
            <Space>
              <span class="text-sm text-gray-500">时间范围</span>
              <DatePicker.RangePicker />
            </Space>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4 pt-4 border-t">
          <span class="text-sm text-gray-500">展示方式</span>
          <Space>
            <Button :type="viewMode === 'grid' ? 'primary' : 'default'" size="small" @click="viewMode = 'grid'">
              <Grid class="size-4" />
            </Button>
            <Button :type="viewMode === 'list' ? 'primary' : 'default'" size="small" @click="viewMode = 'list'">
              <List class="size-4" />
            </Button>
          </Space>
        </div>
      </Card>

      <!-- 监控指标 -->
      <Row :gutter="16">
        <Col :span="12">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <div class="flex items-center gap-2">
                <Settings class="size-5 text-blue-500" />
                <span>CPU使用量</span>
              </div>
            </template>
            <div class="text-center py-6">
              <Progress type="circle" :percent="45" :size="160" :stroke-color="'#3b82f6'" />
              <div class="text-sm text-gray-500 mt-4">当前CPU使用量</div>
            </div>
          </Card>
        </Col>
        <Col :span="12">
          <Card :bordered="false" class="shadow-sm h-full">
            <template #title>
              <div class="flex items-center gap-2">
                <Pause class="size-5 text-green-500" />
                <span>内存使用量</span>
              </div>
            </template>
            <div class="text-center py-6">
              <Progress type="circle" :percent="62" :size="160" :stroke-color="'#10b981'" />
              <div class="text-sm text-gray-500 mt-4">当前内存使用量</div>
            </div>
          </Card>
        </Col>
      </Row>

      <!-- 详细指标表格 -->
      <Card :bordered="false" class="shadow-sm">
        <template #title>
          <div class="flex items-center gap-2">
            <Settings class="size-5 text-purple-500" />
            <span>任务监控详情</span>
          </div>
        </template>
        <Table
          row-key="id"
          :data-source="metrics"
          :pagination="false"
          :columns="columns"
        />
      </Card>
    </div>
  </Page>
</template>
