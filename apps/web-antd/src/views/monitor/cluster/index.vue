<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Col, DatePicker, Progress, Row, Select, Space, Table, Tag } from 'ant-design-vue';
import { BookOpenText, CircleAlert, Download, Grid, LayoutGrid, List, RotateCw, Settings } from '@vben/icons';

const resourceSpec = ref<string>();
const autoRefresh = ref('40s');
const viewMode = ref('grid');

const clusterStats = ref({
  gpuUtilization: 0.0,
  gpuCards: 0,
  pendingTasks: 51,
  saturatedNodes: 0,
  fragmentNodes: 0,
});

const columns = [
  { title: '指标项', dataIndex: 'metric', width: 200 },
  { title: '当前值', dataIndex: 'value', width: 150 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '说明', dataIndex: 'description' },
];

const metrics = ref([
  { id: 1, metric: '集群GPU资源利用率', value: '0.0%', status: '正常', description: '当前GPU资源的平均利用率' },
  { id: 2, metric: 'GPU满载节点', value: '0', status: '正常', description: 'GPU使用率达到100%的节点数量' },
  { id: 3, metric: 'GPU碎片节点', value: '0', status: '正常', description: '存在GPU资源碎片的节点数量' },
  { id: 4, metric: '当前未调度任务数', value: '51', status: '告警', description: '等待调度的任务数量' },
]);
</script>

<template>
  <Page auto-content-height>
    <div class="space-y-4">
      <!-- 头部操作栏 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <span class="text-lg font-semibold">集群监控</span>
            <Button type="primary" ghost>
              <template #icon><Download class="size-4" /></template>
              报表下载
            </Button>
          </div>
          <div class="flex items-center gap-6">
            <Space>
              <span class="text-sm text-gray-500">筛选条件</span>
              <Select
                v-model:value="resourceSpec"
                allow-clear
                style="width: 180px"
                placeholder="请选择资源规格"
                :options="[{ label: 'NVIDIA-GPU-HBM2E-80GB', value: 'gpu-80g' }, { label: 'NVIDIA-H100', value: 'h100' }]"
              />
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
      </Card>

      <!-- 展示方式切换 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between">
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

      <!-- 核心指标卡片 -->
      <Row :gutter="16">
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <div class="text-center py-4">
              <Settings class="size-10 mx-auto mb-3 text-blue-500" />
              <div class="text-4xl font-bold text-blue-600 mb-2">{{ clusterStats.gpuUtilization }}%</div>
              <div class="text-sm text-gray-500 mb-4">集群GPU资源利用率</div>
              <Progress :percent="clusterStats.gpuUtilization" :show-info="false" stroke-color="#3b82f6" />
            </div>
          </Card>
        </Col>
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <div class="text-center py-4">
              <LayoutGrid class="size-10 mx-auto mb-3 text-purple-500" />
              <div class="text-4xl font-bold mb-2">{{ clusterStats.gpuCards }}</div>
              <div class="text-sm text-gray-500 mb-4">集群GPU卡数</div>
              <div class="flex justify-around border-t pt-4">
                <div>
                  <div class="text-lg font-semibold">{{ clusterStats.gpuCards }}</div>
                  <div class="text-xs text-gray-400">GPU卡数</div>
                </div>
                <div>
                  <div class="text-lg font-semibold text-orange-500">{{ clusterStats.pendingTasks }}</div>
                  <div class="text-xs text-gray-400">未调度任务</div>
                </div>
              </div>
            </div>
            <div class="text-center text-xs text-gray-400 mt-2 border-t pt-2">作业饱和度</div>
          </Card>
        </Col>
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <div class="text-center py-4">
              <Settings class="size-10 mx-auto mb-3 text-green-500" />
              <div class="text-4xl font-bold text-green-600 mb-2">{{ clusterStats.saturatedNodes }}</div>
              <div class="text-sm text-gray-500 mb-4">GPU满载节点</div>
            </div>
            <div class="text-center text-xs text-gray-400 border-t pt-2">集群资源碎片情况 · GPU节点</div>
          </Card>
        </Col>
        <Col :span="6">
          <Card :bordered="false" class="shadow-sm h-full">
            <div class="text-center py-4">
              <Grid class="size-10 mx-auto mb-3 text-orange-500" />
              <div class="text-4xl font-bold text-orange-600 mb-2">{{ clusterStats.fragmentNodes }}</div>
              <div class="text-sm text-gray-500 mb-4">GPU碎片节点</div>
            </div>
            <div class="text-center text-xs text-gray-400 border-t pt-2">碎片节点</div>
            <div class="text-center text-gray-400 text-sm mt-2">暂无数据</div>
          </Card>
        </Col>
      </Row>

      <!-- 详细指标表格 -->
      <Card :bordered="false" class="shadow-sm">
        <template #title>
          <div class="flex items-center gap-2">
            <RotateCw class="size-5 text-blue-500" />
            <span>集群监控详情</span>
          </div>
        </template>
        <Table
          row-key="id"
          :data-source="metrics"
          :pagination="false"
          :columns="columns"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="record.status === '告警' ? 'warning' : 'success'" class="rounded-full">
                {{ record.status }}
              </Tag>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>