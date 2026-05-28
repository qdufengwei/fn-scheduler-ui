<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import { Button, Card, Input, Pagination, Popconfirm, Progress, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref, computed } from 'vue';
import { RotateCw, ArrowLeft, Copy } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// 详情页控制
const activeDetailId = ref<string | null>(null);
const activeRecord = ref<any>(null);

// 筛选条件
const tenantId = ref<string | undefined>(undefined);
const keyword = ref('');
const selectedRowKeys = ref<Key[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

// 详情页版本多选
const detailSelectedRowKeys = ref<Key[]>([]);
const detailCurrentPage = ref(1);
const detailPageSize = ref(10);

// 租户选项
const tenantOptions = [
  { label: '全部租户', value: undefined },
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
  { label: 'platform', value: 'platform' },
];

// 数据集数据
const datasets = ref([
  {
    id: 'D01KJSMM1JD3Z4A9NX6XAP31R1E',
    name: 'dataset',
    size: '19.90 KB',
    status: '已完成',
    progress: 100,
    version: 'V1',
    updateTime: '2026-03-03 10:41:38',
    user: 'test01',
    tenant: 'test01',
    description: '-',
    failedReason: '-',
  },
  {
    id: 'D01KJSMM2KD5A6BOY7YBQ42S2F',
    name: 'training-data',
    size: '2.5 GB',
    status: '已完成',
    progress: 100,
    version: 'V3',
    updateTime: '2026-03-05 14:22:33',
    user: 'admin',
    tenant: 'platform',
    description: '平台默认训练数据集',
    failedReason: '-',
  },
  {
    id: 'D01KJSMM3LE7B8CPZ8ZCR53T3G',
    name: 'corpus-chinese',
    size: '156 MB',
    status: '上传中',
    progress: 67,
    version: 'V2',
    updateTime: '2026-03-06 09:15:20',
    user: 'test02',
    tenant: 'test02',
    description: '中文语料库二次上传',
    failedReason: '-',
  },
  {
    id: 'D01KJSMM4MF9C0DQ09DS64U4H',
    name: 'image-dataset',
    size: '8.2 GB',
    status: '失败',
    progress: 0,
    version: 'V1',
    updateTime: '2026-03-07 16:30:45',
    user: 'test01',
    tenant: 'test01',
    description: '图像检测标注数据',
    failedReason: '存储空间不足，挂载CephFS时超时。',
  },
]);

// 模拟详情页的版本列表数据
const datasetVersions = ref([
  {
    id: 'v1',
    version: 'V1',
    path: '/home/shuguang/modelrepo/dataset/D01KJSMM1JD3Z4A9NX6XAP31R1E/1',
    size: '19.90 KB',
    updateTime: '2026-03-03 10:41:38',
    description: '-',
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
  let data = [...datasets.value];
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
  message.success(`已删除数据集 ${record.name}`);
  const index = datasets.value.findIndex((item) => item.id === record.id);
  if (index > -1) {
    datasets.value.splice(index, 1);
  }
  if (activeDetailId.value === record.id) {
    activeDetailId.value = null;
    activeRecord.value = null;
  }
}

function handleBatchDelete() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的数据集');
    return;
  }
  message.success(`已批量删除 ${selectedRowKeys.value.length} 个数据集`);
  datasets.value = datasets.value.filter(
    (item) => !selectedRowKeys.value.includes(item.id),
  );
  selectedRowKeys.value = [];
}

// 进入详情页
function openDetail(record: any) {
  activeDetailId.value = record.id;
  activeRecord.value = record;
  detailSelectedRowKeys.value = [];
  detailCurrentPage.value = 1;

  // 根据当前点击的记录，动态组装版本列表的路径
  datasetVersions.value = [
    {
      id: 'v1',
      version: record.version || 'V1',
      path: `/home/shuguang/modelrepo/dataset/${record.id}/1`,
      size: record.size || '19.90 KB',
      updateTime: record.updateTime || '2026-03-03 10:41:38',
      description: record.description !== '-' ? record.description : '-',
    }
  ];
}

// 返回列表页
function handleBack() {
  activeDetailId.value = null;
  activeRecord.value = null;
}

// 复制路径
function copyPath(text: string) {
  navigator.clipboard.writeText(text);
  message.success('数据集地址复制成功');
}

// 详情页版本操作
function handleDeleteVersion(record: any) {
  datasetVersions.value = datasetVersions.value.filter((v) => v.id !== record.id);
  detailSelectedRowKeys.value = detailSelectedRowKeys.value.filter((k) => k !== record.id);
  message.success(`已删除版本 ${record.version}`);
}

function handleBatchDeleteVersions() {
  if (detailSelectedRowKeys.value.length === 0) {
    message.warning('请选择要删除的版本');
    return;
  }
  datasetVersions.value = datasetVersions.value.filter((v) => !detailSelectedRowKeys.value.includes(v.id));
  message.success(`已批量删除 ${detailSelectedRowKeys.value.length} 个版本`);
  detailSelectedRowKeys.value = [];
}

const columns = [
  {
    title: '名称/ID',
    dataIndex: 'name',
    key: 'name',
    width: 220,
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: 120,
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
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
    title: '租户',
    dataIndex: 'tenant',
    key: 'tenant',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 80,
    fixed: 'right' as const,
  },
];

const versionColumns = [
  {
    title: '版本号',
    dataIndex: 'version',
    key: 'version',
    width: 120,
  },
  {
    title: '数据集地址',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '大小',
    dataIndex: 'size',
    key: 'size',
    width: 120,
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
  },
  {
    title: '版本描述',
    dataIndex: 'description',
    key: 'description',
    width: 240,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
  },
];

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
  },
}));

const detailRowSelection = computed(() => ({
  selectedRowKeys: detailSelectedRowKeys.value,
  onChange: (keys: Key[]) => {
    detailSelectedRowKeys.value = keys;
  },
}));
</script>

<template>
  <div>
    <!-- 详情页面视图 -->
    <div v-if="activeDetailId && activeRecord" class="p-4 space-y-4">
      <!-- 页面头部面包屑 -->
      <Card :bordered="false" :body-style="{ padding: '16px 24px' }" class="shadow-sm rounded-lg">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <Button type="text" class="flex items-center justify-center p-0 h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full" @click="handleBack">
              <template #icon><ArrowLeft class="size-4.5" /></template>
            </Button>
            <span class="text-xl font-bold text-gray-800">{{ activeRecord.name }}</span>
            <Tag :color="getStatusTag(activeRecord.status).color" class="rounded-full px-3">
              {{ activeRecord.status }}
            </Tag>
          </div>
          <Popconfirm
            title="确定要删除该数据集吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDelete(activeRecord)"
          >
            <Button type="primary" danger class="px-5">删除</Button>
          </Popconfirm>
        </div>
      </Card>

      <!-- 基本信息区域 -->
      <Card :bordered="false" class="shadow-sm rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <div class="flex py-2">
            <span class="w-32 text-gray-400 text-sm">ID</span>
            <span class="flex-1 text-gray-800 text-sm font-mono select-all">{{ activeRecord.id }}</span>
          </div>
          <div class="flex py-2">
            <span class="w-32 text-gray-400 text-sm">创建时间</span>
            <span class="flex-1 text-gray-800 text-sm">{{ activeRecord.updateTime }}</span>
          </div>
          <div class="flex py-2">
            <span class="w-32 text-gray-400 text-sm">创建者</span>
            <span class="flex-1 text-gray-800 text-sm font-medium">{{ activeRecord.user }}</span>
          </div>
          <div class="flex py-2">
            <span class="w-32 text-gray-400 text-sm">租户</span>
            <span class="flex-1 text-gray-800 text-sm font-medium">{{ activeRecord.tenant }}</span>
          </div>
          <div class="flex py-2 md:col-span-2">
            <span class="w-32 text-gray-400 text-sm">描述</span>
            <span class="flex-1 text-gray-800 text-sm">{{ activeRecord.description }}</span>
          </div>
          <div class="flex py-2 md:col-span-2">
            <span class="w-32 text-gray-400 text-sm">失败原因</span>
            <span class="flex-1 text-sm font-medium" :class="activeRecord.status === '失败' ? 'text-red-500' : 'text-gray-500'">
              {{ activeRecord.failedReason }}
            </span>
          </div>
        </div>
      </Card>

      <!-- 版本列表区域 -->
      <Card :bordered="false" title="版本列表" class="shadow-sm rounded-lg">
        <template #extra>
          <Popconfirm
            title="确定要批量删除选中的版本吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleBatchDeleteVersions"
          >
            <Button :disabled="detailSelectedRowKeys.length === 0" class="px-4">批量删除</Button>
          </Popconfirm>
        </template>

        <Table
          row-key="id"
          :data-source="datasetVersions"
          :columns="versionColumns"
          :row-selection="detailRowSelection"
          :pagination="false"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'path'">
              <div class="flex items-center gap-1.5 text-gray-600 font-mono text-xs">
                <span>{{ record.path }}</span>
                <Button type="text" size="small" class="flex items-center justify-center p-0 h-6 w-6 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded" @click="copyPath(record.path)">
                  <template #icon><Copy class="size-3.5" /></template>
                </Button>
              </div>
            </template>
            <template v-else-if="column.key === 'action'">
              <Popconfirm
                title="确定要删除该版本吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDeleteVersion(record)"
              >
                <a class="text-red-500 hover:text-red-600 font-medium text-sm">删除</a>
              </Popconfirm>
            </template>
          </template>
        </Table>

        <div class="fn-list-pagination flex items-center justify-end mt-4">
          <Pagination
            v-model:current="detailCurrentPage"
            v-model:page-size="detailPageSize"
            :total="datasetVersions.length"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>
    </div>

    <!-- 列表页面视图 -->
    <ListPageLayout v-else>
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
            placeholder="支持模糊搜索数据集名称/ID"
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
          title="确定要批量删除选中的数据集吗？"
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
        :scroll="{ x: 1200 }"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex flex-col gap-0.5">
              <a class="text-blue-600 hover:text-blue-700 font-medium cursor-pointer" @click="openDetail(record)">
                {{ record.name }}
              </a>
              <span class="text-xs text-gray-400 font-mono">{{ record.id }}</span>
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
                :show-info="false"
                :stroke-color="record.status === '失败' ? '#ff4d4f' : record.progress === 100 ? '#52c41a' : '#1890ff'"
                size="small"
                style="width: 80px"
              />
              <span class="text-xs text-gray-500 min-w-[32px]">{{ record.progress }}%</span>
            </div>
          </template>
          <template v-else-if="column.key === 'action'">
            <Popconfirm
              title="确定要删除该数据集吗？"
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
  </div>
</template>