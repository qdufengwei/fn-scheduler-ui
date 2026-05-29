<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Plus, RotateCw } from '@vben/icons';

import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showInfo } from '#/utils/notify';

const router = useRouter();
const keyword = ref('');
const rowSelection = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const rows = ref([
  {
    id: 'TPL-01',
    name: '7B预训练模板',
    type: '分布式训练',
    image: 'ubuntu:20.04',
    gpu: 4,
    spec: 'A800',
    instances: 2,
    priority: '高',
    recycle: '保留',
    created: '2026-05-26 09:00',
  },
  {
    id: 'TPL-02',
    name: 'LLaMA微调模板',
    type: '单机训练',
    image: 'pytorch:2.0',
    gpu: 2,
    spec: 'A100',
    instances: 1,
    priority: '中',
    recycle: '删除',
    created: '2026-05-25 14:30',
  },
  {
    id: 'TPL-03',
    name: 'Qwen2-72B分布式模板',
    type: '分布式训练',
    image: 'deepspeed:0.14.0',
    gpu: 8,
    spec: 'H100',
    instances: 4,
    priority: '高',
    recycle: '保留',
    created: '2026-05-24 10:15',
  },
  {
    id: 'TPL-04',
    name: 'ChatGLM3-6B微调模板',
    type: '单机训练',
    image: 'pytorch:2.1.0-cuda11.8',
    gpu: 1,
    spec: 'A800',
    instances: 1,
    priority: '中',
    recycle: '删除',
    created: '2026-05-23 16:40',
  },
  {
    id: 'TPL-05',
    name: 'StableDiffusion-xl训练模板',
    type: '单机训练',
    image: 'diffusers:0.27.0',
    gpu: 1,
    spec: 'A10',
    instances: 1,
    priority: '低',
    recycle: '删除',
    created: '2026-05-22 11:20',
  },
  {
    id: 'TPL-06',
    name: 'BERT-NER标注训练模板',
    type: '单机训练',
    image: 'transformers:4.40.0',
    gpu: 1,
    spec: 'A100',
    instances: 1,
    priority: '中',
    recycle: '保留',
    created: '2026-05-21 09:30',
  },
  {
    id: 'TPL-07',
    name: 'DeepSpeed多节点模板',
    type: '分布式训练',
    image: 'deepspeed:0.14.0-cuda12.1',
    gpu: 16,
    spec: 'H100',
    instances: 8,
    priority: '高',
    recycle: '保留',
    created: '2026-05-20 14:00',
  },
  {
    id: 'TPL-08',
    name: 'vLLM推理部署模板',
    type: '单机训练',
    image: 'vllm:0.4.0',
    gpu: 2,
    spec: 'A800',
    instances: 1,
    priority: '中',
    recycle: '删除',
    created: '2026-05-19 08:45',
  },
]);

const filteredRows = () => {
  return rows.value.filter(
    (r) => !keyword.value || r.name.includes(keyword.value),
  );
};
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Input
          v-model:value="keyword"
          placeholder="支持模糊搜索模板名称"
          style="width: 260px"
          allow-clear
        />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button type="primary" @click="router.push('/user-task/template/create')">
        <template #icon><Plus class="size-4" /></template>
        创建任务模版
      </Button>
      <Button @click="showInfo('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
      <Popconfirm
        title="确认删除选中的模板？"
        @confirm="showInfo(`已删除 ${rowSelection.length} 个模板`)"
        :disabled="rowSelection.length === 0"
      >
        <Button danger :disabled="rowSelection.length === 0">批量删除</Button>
      </Popconfirm>
    </template>

    <Table
      row-key="id"
      :row-selection="{
        selectedRowKeys: rowSelection,
        onChange: (keys: any[]) => (rowSelection = keys),
      }"
      :data-source="filteredRows()"
      :pagination="false"
      :columns="[
        { title: '模板名称', dataIndex: 'name' },
        { title: '任务类型', dataIndex: 'type' },
        { title: '镜像信息', dataIndex: 'image' },
        { title: 'GPU数量', dataIndex: 'gpu' },
        { title: '资源规格', dataIndex: 'spec' },
        { title: '实例数量', dataIndex: 'instances' },
        { title: '任务优先级', dataIndex: 'priority' },
        { title: '回收策略', dataIndex: 'recycle' },
        { title: '创建时间', dataIndex: 'created' },
        { title: '操作', dataIndex: 'action' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space :size="12">
            <a @click="router.push('/user-task/latest/training/create')"
              >创建任务</a
            >
            <a @click="router.push('/user-task/template/create')">修改</a>
            <Popconfirm
              title="确认删除模板？"
              @confirm="showInfo(`删除模板 ${record.id}`)"
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
        :total="filteredRows().length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
