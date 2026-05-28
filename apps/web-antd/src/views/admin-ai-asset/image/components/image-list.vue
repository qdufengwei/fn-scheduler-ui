<script setup lang="ts">
import type { ImageRecord } from '../types';

import { Plus, Trash2 } from '@vben/icons';

import { Button, Pagination, Popconfirm, Table } from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// ============ 类型定义 ============
interface Props {
  currentPage: number;
  data: ImageRecord[];
  loading?: boolean;
  pageSize: number;
  pageSizeOptions: number[];
  selectedRowKeys: (number | string)[];
  total: number;
}

// ============ Props & Emits ============
const _props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  (e: 'batchDelete'): void;
  (e: 'create'): void;
  (e: 'delete', record: ImageRecord): void;
  (e: 'selectionChange', keys: (number | string)[]): void;
  (e: 'update:currentPage', page: number): void;
  (e: 'update:pageSize', size: number): void;
  (e: 'viewDetail', record: ImageRecord): void;
}>();

const columns = [
  { title: '镜像名称', dataIndex: 'name', key: 'name', width: 280 },
  { title: '镜像数量', dataIndex: 'count', key: 'count', width: 100 },
  {
    title: '拉取次数',
    dataIndex: 'pulls',
    key: 'pulls',
    width: 100,
    sorter: (a: ImageRecord, b: ImageRecord) => a.pulls - b.pulls,
  },
  { title: '创建时间', dataIndex: 'created', key: 'created', width: 180 },
  { title: '更新时间', dataIndex: 'updated', key: 'updated', width: 180 },
  { title: '操作', key: 'action', width: 80, fixed: 'right' as const },
];
</script>

<template>
  <ListPageLayout>
    <!-- 筛选区 -->
    <template #filters>
      <slot name="filters"></slot>
    </template>

    <template #filterActions>
      <slot name="filterActions"></slot>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <Button type="primary" @click="emit('create')">
        <template #icon>
          <Plus class="size-4" />
        </template>
        创建镜像
      </Button>
      <Popconfirm
        title="确认批量删除选中的镜像？"
        ok-text="确认"
        cancel-text="取消"
        @confirm="emit('batchDelete')"
        :disabled="selectedRowKeys.length === 0"
      >
        <Button danger :disabled="selectedRowKeys.length === 0">
          <template #icon>
            <Trash2 class="size-4" />
          </template>
          批量删除
        </Button>
      </Popconfirm>
    </template>

    <!-- 表格 -->
    <Table
      row-key="id"
      :data-source="data"
      :columns="columns"
      :pagination="false"
      :row-selection="{
        selectedRowKeys,
        onChange: (keys: (number | string)[]) => emit('selectionChange', keys),
      }"
      :scroll="{ x: 1000 }"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a
            class="text-blue-600 hover:text-blue-700 font-semibold"
            @click="emit('viewDetail', record as ImageRecord)"
          >
            {{ record.name }}
          </a>
        </template>
        <template v-if="column.key === 'action'">
          <Popconfirm
            title="确认删除该镜像？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="emit('delete', record as ImageRecord)"
          >
            <a class="text-red-500">删除</a>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <!-- 分页 -->
    <div class="fn-list-pagination flex items-center justify-end mt-4">
      <Pagination
        :current="currentPage"
        :page-size="pageSize"
        :total="total"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="pageSizeOptions.map(String)"
        @update:current="emit('update:currentPage', $event)"
        @update:page-size="emit('update:pageSize', $event)"
      />
    </div>
  </ListPageLayout>
</template>
