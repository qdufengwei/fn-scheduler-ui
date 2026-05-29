<script setup lang="ts">
import { ref } from 'vue';

import { RotateCw } from '@vben/icons';

import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Segmented,
  Space,
  Table,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showInfo } from '#/utils/notify';

const ownership = ref('all');
const keyword = ref('');
const rowSelection = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const rows = ref([
  {
    id: 'TR-099',
    name: 'old-exp',
    deletedAt: '2026-05-25 17:20',
    type: '单机训练',
    gpu: 1,
    spec: 'V100',
  },
  {
    id: 'TR-098',
    name: 'test-run-01',
    deletedAt: '2026-05-24 10:15',
    type: '分布式训练',
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'TR-097',
    name: 'qwen2-7b-微调实验',
    deletedAt: '2026-05-23 15:30',
    type: '单机训练',
    gpu: 2,
    spec: 'A100',
  },
  {
    id: 'TR-096',
    name: 'llama3-lora-训练',
    deletedAt: '2026-05-22 09:45',
    type: '分布式训练',
    gpu: 8,
    spec: 'H100',
  },
  {
    id: 'TR-095',
    name: 'bert-ner-标注测试',
    deletedAt: '2026-05-21 14:20',
    type: '单机训练',
    gpu: 1,
    spec: 'A10',
  },
  {
    id: 'TR-094',
    name: 'sd-xl-图片生成训练',
    deletedAt: '2026-05-20 11:00',
    type: '单机训练',
    gpu: 1,
    spec: 'A800',
  },
  {
    id: 'TR-093',
    name: 'deepspeed-多节点测试',
    deletedAt: '2026-05-19 16:50',
    type: '分布式训练',
    gpu: 16,
    spec: 'H100',
  },
  {
    id: 'TR-092',
    name: 'chatglm-推理压测',
    deletedAt: '2026-05-18 08:30',
    type: '单机训练',
    gpu: 2,
    spec: 'A100',
  },
]);

const filteredRows = () => {
  return rows.value.filter((r) => {
    if (keyword.value && !`${r.name}${r.id}`.includes(keyword.value))
      return false;
    return true;
  });
};
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Segmented
          v-model:value="ownership"
          :options="[
            { label: '全部', value: 'all' },
            { label: '我创建的', value: 'mine' },
          ]"
        />
        <Input
          v-model:value="keyword"
          placeholder="支持模糊搜索任务名称/ID"
          style="width: 260px"
          allow-clear
        />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button
          @click="
            keyword = '';
            ownership = 'all';
          "
        >
          重置
        </Button>
      </Space>
    </template>

    <template #toolbar>
      <Button @click="showInfo('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
      <Popconfirm
        title="确认彻底删除选中的任务？"
        @confirm="showInfo(`已彻底删除 ${rowSelection.length} 个任务`)"
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
        { title: '任务名称', dataIndex: 'name' },
        { title: '任务ID', dataIndex: 'id' },
        { title: '删除时间', dataIndex: 'deletedAt' },
        { title: '任务类型', dataIndex: 'type' },
        { title: 'GPU数量', dataIndex: 'gpu' },
        { title: '资源规格', dataIndex: 'spec' },
        { title: '操作', dataIndex: 'action' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space :size="12">
            <a @click="showInfo(`恢复任务 ${record.id}`)">恢复</a>
            <Popconfirm
              title="确认彻底删除？此操作不可恢复！"
              @confirm="showInfo(`彻底删除任务 ${record.id}`)"
            >
              <a class="text-red-500">彻底删除</a>
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
