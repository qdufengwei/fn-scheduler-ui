<script setup lang="ts">
import { ref } from 'vue';

import { RotateCw, X } from '@vben/icons';

import {
  Button,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const rowSelection = ref<number[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '模板名称', dataIndex: 'name', width: 150 },
  { title: '任务类型', dataIndex: 'taskType', width: 100 },
  { title: '镜像信息', dataIndex: 'image', width: 280 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: '任务优先级', dataIndex: 'priority', width: 100 },
  { title: '回收策略', dataIndex: 'recyclePolicy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 120, fixed: 'right' as const },
];

const data = ref([
  {
    id: 1,
    name: 'simple',
    taskType: 'Simple',
    image: 'harbor.local.clusters/library/ngc:25.06-py3-ssh',
    gpuCount: 8,
    resourceSpec: 'NVIDIA-H100-HBM2E-80GB',
    instances: 1,
    priority: '6',
    recyclePolicy: '不可回收',
    createTime: '2026-03-03 10:46:10',
    user: 'test01',
    tenant: 'test01',
  },
  {
    id: 2,
    name: 'qwen2-7b预训练',
    taskType: 'PyTorch',
    image: 'harbor.local.clusters/library/pytorch:2.3.0-cuda12.1',
    gpuCount: 4,
    resourceSpec: 'NVIDIA-A800-HBM2E-80GB',
    instances: 2,
    priority: '8',
    recyclePolicy: '可回收',
    createTime: '2026-03-05 09:20:30',
    user: 'zhangsan',
    tenant: 'ai-lab',
  },
  {
    id: 3,
    name: 'llama3微调模板',
    taskType: 'PyTorch',
    image: 'harbor.local.clusters/library/pytorch:2.1.0-cuda11.8',
    gpuCount: 2,
    resourceSpec: 'NVIDIA-A100-HBM2E-40GB',
    instances: 1,
    priority: '5',
    recyclePolicy: '不可回收',
    createTime: '2026-03-08 14:15:22',
    user: 'lisi',
    tenant: 'research-center',
  },
  {
    id: 4,
    name: '分布式推理服务',
    taskType: 'MPI',
    image: 'harbor.local.clusters/library/deepspeed:0.14.0',
    gpuCount: 8,
    resourceSpec: 'NVIDIA-H100-HBM2E-80GB',
    instances: 4,
    priority: '9',
    recyclePolicy: '可回收',
    createTime: '2026-03-10 11:30:00',
    user: 'wangwu',
    tenant: 'platform-ops',
  },
  {
    id: 5,
    name: '数据清洗任务',
    taskType: 'CPU',
    image: 'harbor.local.clusters/library/python:3.10-slim',
    gpuCount: 0,
    resourceSpec: 'CPU-Only-16C32G',
    instances: 3,
    priority: '3',
    recyclePolicy: '可回收',
    createTime: '2026-03-12 16:45:18',
    user: 'zhaoliu',
    tenant: 'data-team',
  },
  {
    id: 6,
    name: 'sd-xl训练模板',
    taskType: 'Simple',
    image: 'harbor.local.clusters/library/diffusers:0.27.0',
    gpuCount: 1,
    resourceSpec: 'NVIDIA-A10-24GB',
    instances: 1,
    priority: '4',
    recyclePolicy: '不可回收',
    createTime: '2026-03-15 08:22:33',
    user: 'sunqi',
    tenant: 'cv-lab',
  },
  {
    id: 7,
    name: '模型部署模板',
    taskType: 'Deployment',
    image: 'harbor.local.clusters/library/triton:24.03-py3',
    gpuCount: 2,
    resourceSpec: 'NVIDIA-A800-HBM2E-80GB',
    instances: 2,
    priority: '7',
    recyclePolicy: '不可回收',
    createTime: '2026-03-18 10:05:44',
    user: 'zhouba',
    tenant: 'ai-lab',
  },
  {
    id: 8,
    name: 'bert-ner标注训练',
    taskType: 'PyTorch',
    image: 'harbor.local.clusters/library/transformers:4.40.0',
    gpuCount: 1,
    resourceSpec: 'NVIDIA-GPU-HBM2E-80GB',
    instances: 1,
    priority: '5',
    recyclePolicy: '可回收',
    createTime: '2026-03-20 15:38:56',
    user: 'wujiu',
    tenant: 'nlp-group',
  },
]);
</script>

<template>
  <ListPageLayout>
    <template #toolbar>
      <Popconfirm
        title="确认删除选中的模板？"
        @confirm="showNotify(`已删除 ${rowSelection.length} 个模板`)"
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
      :scroll="{ x: 1700 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a class="font-medium text-blue-600 hover:text-blue-700">{{
            record.name
          }}</a>
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
            <a @click="showNotify(`修改模板 ${record.name}`)">修改模板</a>
            <Popconfirm
              title="确认删除该模板？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="showNotify(`删除模板 ${record.name}`)"
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
