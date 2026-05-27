<script setup lang="ts">
import { Button, Card, Empty, Input, Pagination, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref, computed } from 'vue';
import { RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// 筛选条件
const tenantId = ref<string | undefined>(undefined);
const userId = ref<string | undefined>(undefined);
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// 筛选模型区域
const category = ref<string | undefined>(undefined);
const sortField = ref<string | undefined>(undefined);
const sortDirection = ref<string | undefined>(undefined);

// 租户选项
const tenantOptions = [
  { label: '请选择租户', value: undefined },
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
  { label: 'platform', value: 'platform' },
];

// 用户选项
const userOptions = [
  { label: '请选择用户', value: undefined },
  { label: 'admin', value: 'admin' },
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
];

// 分类选项
const categoryOptions = [
  { label: '文本生成', value: '文本生成' },
  { label: '代码生成', value: '代码生成' },
  { label: '视觉识别', value: '视觉识别' },
  { label: '语音处理', value: '语音处理' },
];

// 排序字段选项
const sortFieldOptions = [
  { label: '输入价格', value: 'inputPrice' },
  { label: '输出价格', value: 'outputPrice' },
  { label: '创建时间', value: 'createTime' },
  { label: '调用次数', value: 'callCount' },
];

// 排序方向选项
const sortDirectionOptions = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' },
];

// 模型服务数据
const modelServices = ref([
  {
    id: '1',
    serviceName: 'chat-qwen2',
    modelName: 'Qwen2-7B-Instruct',
    category: '文本生成',
    inputPrice: 0.002,
    outputPrice: 0.008,
    callCount: 1250,
    status: '上架',
    createTime: '2026-03-01 10:00:00',
    user: 'admin',
    tenant: 'platform',
  },
  {
    id: '2',
    serviceName: 'vision-ocr',
    modelName: 'OCR-Base',
    category: '视觉识别',
    inputPrice: 0.001,
    outputPrice: 0.005,
    callCount: 890,
    status: '下架',
    createTime: '2026-03-05 14:20:00',
    user: 'test01',
    tenant: 'test01',
  },
  {
    id: '3',
    serviceName: 'code-gen',
    modelName: 'CodeLlama-34B',
    category: '代码生成',
    inputPrice: 0.005,
    outputPrice: 0.015,
    callCount: 456,
    status: '上架',
    createTime: '2026-03-10 09:30:00',
    user: 'admin',
    tenant: 'platform',
  },
]);

const getStatusTag = (status: string) => {
  const statusMap: Record<string, { color: string }> = {
    '上架': { color: 'success' },
    '下架': { color: 'default' },
  };
  return statusMap[status] || { color: 'default' };
};

// 筛选后的数据
const filteredData = computed(() => {
  let data = [...modelServices.value];
  if (tenantId.value) {
    data = data.filter((item) => item.tenant === tenantId.value);
  }
  if (userId.value) {
    data = data.filter((item) => item.user === userId.value);
  }
  if (keyword.value) {
    data = data.filter(
      (item) =>
        item.serviceName.includes(keyword.value) ||
        item.modelName.includes(keyword.value),
    );
  }
  if (category.value) {
    data = data.filter((item) => item.category === category.value);
  }
  // 排序
  if (sortField.value && sortDirection.value) {
    const field = sortField.value;
    data.sort((a: any, b: any) => {
      if (sortDirection.value === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });
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
  userId.value = undefined;
  keyword.value = '';
  category.value = undefined;
  sortField.value = undefined;
  sortDirection.value = undefined;
  currentPage.value = 1;
}

function handleRefresh() {
  message.success('刷新成功');
}

function handleToggleStatus(record: any) {
  const newStatus = record.status === '上架' ? '下架' : '上架';
  message.success(`${newStatus}服务 ${record.serviceName}`);
  record.status = newStatus;
}

function handleEdit(record: any) {
  message.info(`打开编辑服务 ${record.serviceName} 抽屉（待扩展）`);
}

function handleResetFilters() {
  category.value = undefined;
  sortField.value = undefined;
  sortDirection.value = undefined;
  currentPage.value = 1;
}

const columns = [
  {
    title: '服务名称',
    dataIndex: 'serviceName',
    key: 'serviceName',
    width: 150,
  },
  {
    title: '模型',
    dataIndex: 'modelName',
    key: 'modelName',
    width: 180,
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 100,
  },
  {
    title: '输入价格(¥/千tokens)',
    dataIndex: 'inputPrice',
    key: 'inputPrice',
    width: 140,
  },
  {
    title: '输出价格(¥/千tokens)',
    dataIndex: 'outputPrice',
    key: 'outputPrice',
    width: 140,
  },
  {
    title: '调用次数',
    dataIndex: 'callCount',
    key: 'callCount',
    width: 100,
    sorter: (a: any, b: any) => a.callCount - b.callCount,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 80,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right' as const,
  },
];
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-3">
        <Select
          v-model:value="tenantId"
          :options="tenantOptions"
          placeholder="请选择租户"
          style="width: 140px"
          allow-clear
          @change="handleFilter"
        />
        <Select
          v-model:value="userId"
          :options="userOptions"
          placeholder="请选择用户"
          style="width: 140px"
          allow-clear
          @change="handleFilter"
        />
        <Input
          v-model:value="keyword"
          placeholder="搜索服务名/模型名"
          style="width: 200px"
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
      <Button @click="handleRefresh">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
    </template>

    <!-- 筛选模型区域 -->
    <template #before>
      <Card :bordered="false" class="mb-4 shadow-sm" size="small">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="text-gray-600">筛选模型</span>
            <Button size="small" @click="handleResetFilters">重置</Button>
          </div>
          <div class="flex items-center gap-3 flex-1">
            <Select
              v-model:value="category"
              :options="categoryOptions"
              placeholder="分类"
              style="width: 120px"
              allow-clear
              @change="handleFilter"
            />
            <Select
              v-model:value="sortField"
              :options="sortFieldOptions"
              placeholder="排序字段"
              style="width: 120px"
              allow-clear
              @change="handleFilter"
            />
            <Select
              v-model:value="sortDirection"
              :options="sortDirectionOptions"
              placeholder="排序方向"
              style="width: 100px"
              allow-clear
              @change="handleFilter"
            />
          </div>
        </div>
      </Card>
    </template>

    <Table
      v-if="filteredData.length > 0"
      :row-key="(record: any) => record.id"
      :data-source="paginatedData"
      :columns="columns"
      :pagination="false"
      :scroll="{ x: 1200 }"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'serviceName'">
          <a class="text-blue-600 hover:text-blue-700 font-medium">{{ record.serviceName }}</a>
        </template>
        <template v-else-if="column.key === 'modelName'">
          <span>{{ record.modelName }}</span>
        </template>
        <template v-else-if="column.key === 'category'">
          <Tag color="blue" class="rounded-full">{{ record.category }}</Tag>
        </template>
        <template v-else-if="column.key === 'inputPrice'">
          <span>¥{{ record.inputPrice.toFixed(4) }}</span>
        </template>
        <template v-else-if="column.key === 'outputPrice'">
          <span>¥{{ record.outputPrice.toFixed(4) }}</span>
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="getStatusTag(record.status).color" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Space :size="4">
            <Button type="link" size="small" @click="handleEdit(record)">编辑</Button>
            <Button type="link" size="small" @click="handleToggleStatus(record)">
              {{ record.status === '上架' ? '下架' : '上架' }}
            </Button>
          </Space>
        </template>
      </template>
    </Table>

    <div v-else class="flex flex-col items-center justify-center py-16 gap-2">
      <Empty description="暂无数据">
        <template #image>
          <div class="text-gray-300">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
        </template>
      </Empty>
      <span class="text-gray-400 text-sm">当前没有记录，增加以后在此处查看数据。</span>
    </div>

    <div v-if="filteredData.length > 0" class="fn-list-pagination flex items-center justify-end">
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