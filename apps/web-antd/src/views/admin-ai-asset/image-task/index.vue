<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import { computed, ref } from 'vue';

import {
  Button,
  Empty,
  message,
  Pagination,
  Popconfirm,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// 筛选条件
const selectedRowKeys = ref<Key[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 镜像任务数据
const imageTasks = ref([
  {
    id: '1',
    name: 'pull-llama-70b',
    source: 'Docker Hub',
    status: '进行中',
    node: 'node-01',
    createTime: '2026-03-15 10:30:00',
    finishTime: '-',
  },
  {
    id: '2',
    name: 'build-custom-image',
    source: '本地构建',
    status: '已完成',
    node: 'node-02',
    createTime: '2026-03-14 14:20:00',
    finishTime: '2026-03-14 14:45:00',
  },
]);

const getStatusTag = (status: string) => {
  const statusMap: Record<string, { color: string }> = {
    进行中: { color: 'processing' },
    已完成: { color: 'success' },
    失败: { color: 'error' },
  };
  return statusMap[status] || { color: 'default' };
};

// 分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return imageTasks.value.slice(start, end);
});

function handleDelete(record: any) {
  message.success(`已删除任务 ${record.name}`);
  const index = imageTasks.value.findIndex((item) => item.id === record.id);
  if (index !== -1) {
    imageTasks.value.splice(index, 1);
  }
}

function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的任务');
    return;
  }
  message.success(`已批量删除 ${selectedRowKeys.value.length} 个任务`);
  imageTasks.value = imageTasks.value.filter(
    (item) => !selectedRowKeys.value.includes(item.id),
  );
  selectedRowKeys.value = [];
}

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
  },
  {
    title: '节点',
    dataIndex: 'node',
    key: 'node',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
  },
  {
    title: '完成时间',
    dataIndex: 'finishTime',
    key: 'finishTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right' as const,
  },
];

const rowSelection = {
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
  },
};
</script>

<template>
  <ListPageLayout>
    <template #toolbar>
      <Popconfirm
        title="确定要批量删除选中的任务吗？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleBatchDelete"
        :disabled="selectedRowKeys.length === 0"
      >
        <Button :disabled="selectedRowKeys.length === 0">批量删除</Button>
      </Popconfirm>
    </template>

    <Table
      v-if="imageTasks.length > 0"
      :row-key="(record: any) => record.id"
      :data-source="paginatedData"
      :columns="columns"
      :row-selection="rowSelection"
      :pagination="false"
      :scroll="{ x: 1000 }"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <a class="text-blue-600 hover:text-blue-700 font-medium">{{
            record.name
          }}</a>
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="getStatusTag(record.status).color" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Popconfirm
            title="确定要删除该任务吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record)"
          >
            <a class="text-red-500 hover:text-red-600">删除</a>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <div v-else class="flex flex-col items-center justify-center py-16 gap-2">
      <Empty description="暂无数据">
        <template #image>
          <div class="text-gray-300">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
        </template>
      </Empty>
      <span class="text-gray-400 text-sm"
        >当前没有记录，增加以后在此处查看数据。</span
      >
    </div>

    <div
      v-if="imageTasks.length > 0"
      class="fn-list-pagination flex items-center justify-end"
    >
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="imageTasks.length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
