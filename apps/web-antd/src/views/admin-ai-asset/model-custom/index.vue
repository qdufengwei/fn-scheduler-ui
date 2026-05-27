<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import { Button, Input, Pagination, Popconfirm, Progress, Space, Table, Tag, message } from 'ant-design-vue';
import { ref, computed } from 'vue';
import { RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// 筛选条件
const tenantId = ref<string | undefined>(undefined);
const keyword = ref('');
const selectedRowKeys = ref<Key[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 租户选项
const tenantOptions = [
  { label: '全部租户', value: undefined },
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
  { label: 'platform', value: 'platform' },
];

// 自定义模型数据
const customModels = ref([
  {
    id: 'M01KJSMHA2W53GX0ACXTB8KZW4S',
    name: 'finetune',
    status: '已完成',
    progress: 100,
    version: 'V1',
    updateTime: '2026-03-03 10:40:09',
    user: 'test01',
    tenant: 'test01',
    alias: '-',
  },
  {
    id: 'M01KJSMMABC123456789DEF0GHI',
    name: 'custom-llama',
    status: '上传中',
    progress: 45,
    version: 'V2',
    updateTime: '2026-03-05 14:22:33',
    user: 'admin',
    tenant: 'platform',
    alias: 'my-model',
  },
  {
    id: 'M01KJSMHXYZ987654321ABC0DEF',
    name: 'qwen-finetune-v2',
    status: '失败',
    progress: 0,
    version: 'V3',
    updateTime: '2026-03-06 09:15:20',
    user: 'test02',
    tenant: 'tenant-a',
    alias: '-',
  },
]);

const getStatusTag = (status: string) => {
  const statusMap: Record<string, { color: string }> = {
    '已完成': { color: 'success' },
    '上传中': { color: 'processing' },
    '失败': { color: 'error' },
  };
  return statusMap[status] || { color: 'default' };
};

// 筛选后的数据
const filteredData = computed(() => {
  let data = [...customModels.value];
  if (tenantId.value) {
    data = data.filter((item) => item.tenant === tenantId.value);
  }
  if (keyword.value) {
    data = data.filter(
      (item) =>
        item.name.includes(keyword.value) ||
        item.id.includes(keyword.value.toUpperCase()),
    );
  }
  return data;
});

// 分页后的数据
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.value.slice(start, end);
});

function handleFilter() {
  currentPage.value = 1;
}

function handleReset() {
  tenantId.value = undefined;
  keyword.value = '';
  currentPage.value = 1;
}

function handleRefresh() {
  message.success('刷新成功');
}

function handleDelete(record: any) {
  message.success(`已删除模型 ${record.name}`);
  const index = customModels.value.findIndex((item) => item.id === record.id);
  if (index > -1) {
    customModels.value.splice(index, 1);
  }
}

function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的模型');
    return;
  }
  message.success(`已批量删除 ${selectedRowKeys.value.length} 个模型`);
  customModels.value = customModels.value.filter(
    (item) => !selectedRowKeys.value.includes(item.id),
  );
  selectedRowKeys.value = [];
}

const columns = [
  {
    title: '名称/ID',
    dataIndex: 'name',
    key: 'name',
    width: 220,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    filters: [
      { text: '已完成', value: '已完成' },
      { text: '上传中', value: '上传中' },
      { text: '失败', value: '失败' },
    ],
  },
  {
    title: '上传进度',
    dataIndex: 'progress',
    key: 'progress',
    width: 120,
  },
  {
    title: '最新版本',
    dataIndex: 'version',
    key: 'version',
    width: 100,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
  },
  {
    title: '用户',
    dataIndex: 'user',
    key: 'user',
    width: 100,
  },
  {
    title: '租户/别名',
    dataIndex: 'tenant',
    key: 'tenant',
    width: 150,
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
    <template #filters>
      <div class="flex flex-wrap items-center gap-3">
        <Select
          v-model:value="tenantId"
          :options="tenantOptions"
          placeholder="请选择租户"
          style="width: 160px"
          allow-clear
          @change="handleFilter"
        />
        <Input
          v-model:value="keyword"
          placeholder="支持模糊搜索模型仓库名称/ID"
          style="width: 280px"
          allow-clear
          @press-enter="handleFilter"
        />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary" @click="handleFilter">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Popconfirm
        title="确定要批量删除选中的模型吗？"
        ok-text="确定"
        cancel-text="取消"
        @confirm="handleBatchDelete"
      >
        <Button :disabled="selectedRowKeys.length === 0">批量删除</Button>
      </Popconfirm>
      <Button @click="handleRefresh">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
    </template>

    <Table
      :row-key="(record: any) => record.id"
      :data-source="paginatedData"
      :columns="columns"
      :row-selection="rowSelection"
      :pagination="false"
      :scroll="{ x: 1100 }"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="flex flex-col gap-0.5">
            <a class="text-blue-600 hover:text-blue-700 font-medium">{{ record.name }}</a>
            <span class="text-xs text-gray-400">{{ record.id }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="getStatusTag(record.status).color" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'progress'">
          <div class="flex items-center gap-2">
            <Progress
              :percent="record.progress"
              :size="'small'"
              :status="record.status === '失败' ? 'exception' : record.progress === 100 ? 'success' : 'active'"
              style="width: 60px;"
            />
            <span class="text-xs text-gray-500">{{ record.progress }}%</span>
          </div>
        </template>
        <template v-else-if="column.key === 'tenant'">
          <div class="flex flex-col gap-0.5">
            <span>{{ record.tenant }}</span>
            <span class="text-xs text-gray-400">{{ record.alias }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'action'">
          <Popconfirm
            title="确定要删除该模型吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(record)"
          >
            <a class="text-red-500 hover:text-red-600">删除</a>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="filteredData.length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>