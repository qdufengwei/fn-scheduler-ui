<script setup lang="ts">
import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { ref } from 'vue';
import { RotateCw, Search, X } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const selectedTenant = ref<string>();
const searchText = ref('');
const rowSelection = ref<number[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);

// 表头筛选条件（参照系统有表头筛选的列）
const taskTypeFilter = ref<string[]>([]);
const statusFilter = ref<string[]>([]);
const gpuCountFilter = ref<string[]>([]);
const resourceSpecFilter = ref<string[]>([]);

// 筛选选项
const taskTypeOptions = [
  { label: 'MPI', value: 'MPI' },
  { label: 'PyTorch', value: 'PyTorch' },
  { label: 'Simple', value: 'Simple' },
  { label: 'CPU', value: 'CPU' },
  { label: 'Deployment', value: 'Deployment' },
];
const statusOptions = [
  { label: '创建中', value: '创建中' },
  { label: '排队中', value: '排队中' },
  { label: '运行中', value: '运行中' },
  { label: '重启中', value: '重启中' },
  { label: '完成中', value: '完成中' },
  { label: '停止中', value: '停止中' },
  { label: '中断中', value: '中断中' },
  { label: '停止', value: '停止' },
  { label: '已完成', value: '已完成' },
  { label: '已成功', value: '已成功' },
  { label: '已停止', value: '已停止' },
  { label: '已失败', value: '已失败' },
  { label: '异常', value: '异常' },
  { label: '被抢占', value: '被抢占' },
  { label: '已删除', value: '已删除' },
];
const gpuCountOptions = [
  { label: '0', value: '0' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '4', value: '4' },
  { label: '8', value: '8' },
];
const resourceSpecOptions = [
  { label: 'NVIDIA-GPU-HBM2E-80GB', value: 'NVIDIA-GPU-HBM2E-80GB' },
  { label: 'NVIDIA-H100-HBM2E-80GB', value: 'NVIDIA-H100-HBM2E-80GB' },
  { label: 'A10', value: 'A10' },
  { label: 'A800', value: 'A800' },
  { label: '-', value: '-' },
];

const trainingColumns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '名称/ID', dataIndex: 'name', width: 200, fixed: 'left' as const },
  { title: '任务类型', dataIndex: 'taskType', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '就绪状态', dataIndex: 'readyStatus', width: 80 },
  { title: '运行时长', dataIndex: 'runTime', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: '任务优先级', dataIndex: 'priority', width: 150 },
  { title: '回收策略', dataIndex: 'recyclePolicy', width: 100 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const trainingData = ref([
  {
    id: 1,
    name: 'test',
    taskId: 'job-254ce4873fa7-20260523232921',
    taskType: 'CPU',
    status: '运行中',
    readyStatus: '1/1',
    runTime: '84h 42m 59s',
    createTime: '2026-05-23 15:29:21',
    instances: 1,
    priority: 'high-priority-job',
    recyclePolicy: '可回收',
    gpuCount: 0,
    resourceSpec: '-',
    user: 'lzj-1',
    tenant: 'qiji',
  },
  {
    id: 2,
    name: 'cpu6',
    taskId: 'job-0482129d4b7b-20260415210402',
    taskType: 'CPU',
    status: '运行中',
    readyStatus: '1/1',
    runTime: '998h 58m 40s',
    createTime: '2026-04-15 13:04:03',
    instances: 1,
    priority: 'high-priority-job',
    recyclePolicy: '可回收',
    gpuCount: 0,
    resourceSpec: '-',
    user: 'user415',
    tenant: 'zjw415',
  },
  {
    id: 3,
    name: '123',
    taskId: 'job-473d0f3c98dd-20260415205154',
    taskType: 'Simple',
    status: '停止',
    readyStatus: '0/1',
    runTime: '300h 43m 37s',
    createTime: '2026-04-15 12:51:54',
    instances: 1,
    priority: 'high-priority-job',
    recyclePolicy: '可回收',
    gpuCount: 1,
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    user: 'test-0415',
    tenant: 'test-0415',
  },
  {
    id: 4,
    name: 'test2',
    taskId: 'job-cfd9413b035d-20260415203555',
    taskType: 'MPI',
    status: '排队中',
    readyStatus: '0/2',
    runTime: '0h 0m 0s',
    createTime: '2026-04-15 12:35:55',
    instances: 2,
    priority: 'high-priority-job',
    recyclePolicy: '可回收',
    gpuCount: 0,
    resourceSpec: '-',
    user: 'test-0415',
    tenant: 'test-0415',
  },
  {
    id: 5,
    name: 'test',
    taskId: 'job-da5d258fcdd0-20260415203536',
    taskType: 'MPI',
    status: '排队中',
    readyStatus: '0/2',
    runTime: '0h 0m 0s',
    createTime: '2026-04-15 12:35:36',
    instances: 2,
    priority: 'high-priority-job',
    recyclePolicy: '可回收',
    gpuCount: 0,
    resourceSpec: '-',
    user: 'test-0415',
    tenant: 'test-0415',
  },
]);

const statusColor: Record<string, string> = {
  运行中: 'processing',
  停止: 'default',
  排队中: 'warning',
  成功: 'success',
  失败: 'error',
};

// 重置筛选
const handleReset = () => {
  searchText.value = '';
  selectedTenant.value = undefined;
  taskTypeFilter.value = [];
  statusFilter.value = [];
  gpuCountFilter.value = [];
  resourceSpecFilter.value = [];
};
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <Select
        v-model:value="selectedTenant"
        allow-clear
        style="width: 180px"
        placeholder="请选择租户"
        :options="[
          { label: 'test01', value: 'test01' },
          { label: 'test-0415', value: 'test-0415' },
        ]"
      >
        <template #suffixIcon><Search class="size-4 text-gray-400" /></template>
      </Select>
      <Select
        v-model:value="taskTypeFilter"
        mode="multiple"
        allow-clear
        style="width: 160px"
        placeholder="任务类型"
        :options="taskTypeOptions"
        :max-tag-count="1"
      />
      <Select
        v-model:value="statusFilter"
        mode="multiple"
        allow-clear
        style="width: 160px"
        placeholder="状态"
        :options="statusOptions"
        :max-tag-count="1"
      />
      <Select
        v-model:value="gpuCountFilter"
        mode="multiple"
        allow-clear
        style="width: 120px"
        placeholder="GPU数量"
        :options="gpuCountOptions"
        :max-tag-count="1"
      />
      <Select
        v-model:value="resourceSpecFilter"
        mode="multiple"
        allow-clear
        style="width: 180px"
        placeholder="资源规格"
        :options="resourceSpecOptions"
        :max-tag-count="1"
      />
      <Input
        v-model:value="searchText"
        placeholder="支持模糊搜索任务名称/ID"
        style="width: 260px"
        allow-clear
      >
        <template #prefix><Search class="size-4 text-gray-400" /></template>
      </Input>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Popconfirm
        title="确认删除选中的任务？"
        @confirm="showNotify(`已删除 ${rowSelection.length} 个任务`)"
      >
        <Button danger :disabled="rowSelection.length === 0">
          <template #icon><X class="size-4" /></template>
          批量删除
        </Button>
      </Popconfirm>
      <Button @click="showNotify('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
      </Button>
    </template>

    <Table
      row-key="id"
      :row-selection="{
        selectedRowKeys: rowSelection,
        onChange: (keys: any[]) => (rowSelection = keys),
      }"
      :data-source="trainingData"
      :pagination="false"
      :columns="trainingColumns"
      :scroll="{ x: 1800 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div>
            <a class="font-medium text-blue-600 hover:text-blue-700">{{
              record.name
            }}</a>
            <div class="text-xs text-gray-400">{{ record.taskId }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'taskType'">
          <Tag class="rounded-full">{{ record.taskType }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="statusColor[record.status]" class="rounded-full">{{
            record.status
          }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'tenant'">
          <div>
            <span>{{ record.tenant }}</span>
            <span class="text-gray-400 ml-1">-</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Popconfirm
            title="确认删除该任务？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="showNotify(`删除任务 ${record.name}`)"
          >
            <a class="text-red-500">删除</a>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="5"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
