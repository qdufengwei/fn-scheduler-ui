<script setup lang="ts">
import { ref } from 'vue';

import { RotateCw, Search, X } from '@vben/icons';

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

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const selectedTenant = ref<string>();
const searchText = ref('');
const rowSelection = ref<number[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);

// 表头筛选条件（参照系统有表头筛选的列：任务类型）
const taskTypeFilter = ref<string[]>([]);

// 筛选选项
const taskTypeOptions = [
  { label: 'MPI', value: 'MPI' },
  { label: 'PyTorch', value: 'PyTorch' },
  { label: 'Simple', value: 'Simple' },
  { label: 'CPU', value: 'CPU' },
  { label: 'Deployment', value: 'Deployment' },
];

const columns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '名称/ID', dataIndex: 'name', width: 200, fixed: 'left' as const },
  { title: '删除时间', dataIndex: 'deleteTime', width: 180 },
  { title: '任务类型', dataIndex: 'taskType', width: 100 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 100, fixed: 'right' as const },
];

const data = ref([
  {
    id: 1,
    name: 'test',
    taskId: 'job-7f51afd64457-20260415094427',
    deleteTime: '2026-04-15 11:24:11',
    taskType: 'Simple',
    gpuCount: 1,
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    user: 'test-0415',
    tenant: 'test-0415',
  },
  {
    id: 2,
    name: 'qwen2-finetune',
    taskId: 'job-3b92cde8a012-20260414103520',
    deleteTime: '2026-04-14 15:30:45',
    taskType: 'PyTorch',
    gpuCount: 4,
    resourceSpec: 'NVIDIA-A800-HBM2E-80GB',
    user: 'zhangsan',
    tenant: 'ai-lab',
  },
  {
    id: 3,
    name: 'llama-inference',
    taskId: 'job-8e47f1b23c90-20260413082210',
    deleteTime: '2026-04-13 09:15:30',
    taskType: 'MPI',
    gpuCount: 8,
    resourceSpec: 'NVIDIA-H100-HBM2E-80GB',
    user: 'lisi',
    tenant: 'research-center',
  },
  {
    id: 4,
    name: 'data-preprocess',
    taskId: 'job-5d19ab67ef01-20260412164055',
    deleteTime: '2026-04-12 18:22:10',
    taskType: 'CPU',
    gpuCount: 0,
    resourceSpec: 'CPU-Only-16C32G',
    user: 'wangwu',
    tenant: 'data-team',
  },
  {
    id: 5,
    name: 'chatglm-train',
    taskId: 'job-2c84de90ab33-20260411120533',
    deleteTime: '2026-04-11 14:08:22',
    taskType: 'PyTorch',
    gpuCount: 2,
    resourceSpec: 'NVIDIA-A100-HBM2E-40GB',
    user: 'zhaoliu',
    tenant: 'nlp-group',
  },
  {
    id: 6,
    name: 'sd-image-gen',
    taskId: 'job-9f36bc014578-20260410093018',
    deleteTime: '2026-04-10 11:45:33',
    taskType: 'Simple',
    gpuCount: 1,
    resourceSpec: 'NVIDIA-A10-24GB',
    user: 'sunqi',
    tenant: 'cv-lab',
  },
  {
    id: 7,
    name: 'bert-ner-train',
    taskId: 'job-4a72ef58cd69-20260409151742',
    deleteTime: '2026-04-09 16:30:10',
    taskType: 'PyTorch',
    gpuCount: 1,
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    user: 'zhouba',
    tenant: 'ai-lab',
  },
  {
    id: 8,
    name: 'model-deploy-test',
    taskId: 'job-6e05da23f834-20260408102356',
    deleteTime: '2026-04-08 12:10:44',
    taskType: 'Deployment',
    gpuCount: 2,
    resourceSpec: 'NVIDIA-A800-HBM2E-80GB',
    user: 'wujiu',
    tenant: 'platform-ops',
  },
]);

// 重置筛选
const handleReset = () => {
  searchText.value = '';
  selectedTenant.value = undefined;
  taskTypeFilter.value = [];
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
        title="确认彻底删除选中的任务？"
        @confirm="showNotify(`已彻底删除 ${rowSelection.length} 个任务`)"
        :disabled="rowSelection.length === 0"
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
      :data-source="data"
      :pagination="false"
      :columns="columns"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div>
            <span class="font-medium">{{ record.name }}</span>
            <div class="text-xs text-gray-400">{{ record.taskId }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'taskType'">
          <Tag class="rounded-full">{{ record.taskType }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'tenant'">
          <div>
            <span>{{ record.tenant }}</span>
            <span class="text-gray-400 ml-1">-</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space>
            <a @click="showNotify(`还原任务 ${record.name}`)">还原</a>
            <Popconfirm
              title="确认彻底删除该任务？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="showNotify(`彻底删除任务 ${record.name}`)"
            >
              <a class="text-red-500">删除</a>
            </Popconfirm>
          </Space>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="8"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
