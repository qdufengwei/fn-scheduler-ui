<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Page } from '@vben/common-ui';
import { ArrowLeft, Copy } from '@vben/icons';
import {
  Button,
  Card,
  Pagination,
  Popconfirm,
  Table,
  Tag,
  message,
} from 'ant-design-vue';

const route = useRoute();
const router = useRouter();

const fallbackModelId = 'M01KJSMHA2W53GX0ACXTB8KZW4S';
const modelId = computed(() => String(route.params.id || fallbackModelId));
const selectedRowKeys = ref<Key[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const customModelMap: Record<
  string,
  {
    creator: string;
    name: string;
    status: string;
    tenant: string;
  }
> = {
  M01KJSMHA2W53GX0ACXTB8KZW4S: {
    creator: 'test01',
    name: 'finetune',
    status: '已完成',
    tenant: 'test01',
  },
  M01KJSMHXYZ987654321ABC0DEF: {
    creator: 'test02',
    name: 'qwen-finetune-v2',
    status: '失败',
    tenant: 'tenant-a',
  },
  M01KJSMMABC123456789DEF0GHI: {
    creator: 'admin',
    name: 'custom-llama',
    status: '上传中',
    tenant: 'platform',
  },
};

const modelDetail = computed(() => ({
  createdAt: '2026-03-03 10:40:09',
  creator: customModelMap[modelId.value]?.creator ?? 'test01',
  description: '-',
  failedReason: '-',
  id: modelId.value,
  name: customModelMap[modelId.value]?.name ?? 'finetune',
  status: customModelMap[modelId.value]?.status ?? '已完成',
  tenant: customModelMap[modelId.value]?.tenant ?? 'test01',
}));

const statusColor = computed(() => {
  const colorMap: Record<string, string> = {
    上传中: 'processing',
    失败: 'error',
    已完成: 'success',
  };
  return colorMap[modelDetail.value.status] ?? 'default';
});

const versionRows = ref([
  {
    description: '测试模型数据',
    id: 'v1',
    modelPath: `/home/shuguang/modelrepo/inference_model/custom/${modelId.value}/1`,
    updateTime: '2026-03-03 10:40:09',
    version: 'V1',
  },
]);

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return versionRows.value.slice(start, start + pageSize.value);
});

const rowSelection = computed(() => ({
  onChange: (keys: Key[]) => {
    selectedRowKeys.value = keys;
  },
  selectedRowKeys: selectedRowKeys.value,
}));

const columns = [
  { dataIndex: 'version', key: 'version', title: '版本', width: 120 },
  { dataIndex: 'modelPath', key: 'modelPath', title: '模型地址' },
  { dataIndex: 'updateTime', key: 'updateTime', title: '更新时间', width: 180 },
  {
    dataIndex: 'description',
    key: 'description',
    title: '版本描述',
    width: 240,
  },
  { key: 'action', title: '操作', width: 100 },
];

function handleBack() {
  router.push({ name: 'AdminAIAssetModelCustom' });
}

function handleDeleteModel() {
  message.success(`已删除模型 ${modelDetail.value.name}`);
  router.push({ name: 'AdminAIAssetModelCustom' });
}

function handleDeleteVersion(record: any) {
  versionRows.value = versionRows.value.filter((item) => item.id !== record.id);
  selectedRowKeys.value = selectedRowKeys.value.filter(
    (key) => key !== record.id,
  );
  message.success(`已删除版本 ${record.version}`);
}

function handleBatchDelete() {
  versionRows.value = versionRows.value.filter(
    (item) => !selectedRowKeys.value.includes(item.id),
  );
  message.success(`已批量删除 ${selectedRowKeys.value.length} 个版本`);
  selectedRowKeys.value = [];
}

function copyModelPath(path: string) {
  navigator.clipboard.writeText(path);
  message.success('已复制模型地址');
}
</script>

<template>
  <Page auto-content-height>
    <!-- 主体内容卡片流 -->
    <div class="space-y-4 w-full pb-8">
      <!-- 页面头部导航卡片 -->
      <Card :bordered="false" :body-style="{ padding: '16px 24px' }" class="shadow-sm rounded-lg">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <Button 
              type="text" 
              class="flex items-center justify-center p-0 h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full" 
              @click="handleBack"
            >
              <template #icon><ArrowLeft class="size-4.5" /></template>
            </Button>
            <span class="text-xl font-bold text-gray-800">{{ modelDetail.name }}</span>
            <Tag :color="statusColor" class="rounded-full px-3">
              {{ modelDetail.status }}
            </Tag>
          </div>
          
          <Popconfirm
            title="确定要删除该自定义模型吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleDeleteModel"
          >
            <Button type="primary" danger class="px-5">删除</Button>
          </Popconfirm>
        </div>
      </Card>

      <!-- 基本详细信息卡片 -->
      <Card :bordered="false" class="shadow-sm rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
          <div class="flex py-3 border-b border-gray-100">
            <span class="w-32 text-gray-400 text-sm">ID</span>
            <span class="flex-1 text-gray-800 text-sm font-mono select-all">{{ modelDetail.id }}</span>
          </div>
          <div class="flex py-3 border-b border-gray-100">
            <span class="w-32 text-gray-400 text-sm">创建时间</span>
            <span class="flex-1 text-gray-800 text-sm">{{ modelDetail.createdAt }}</span>
          </div>
          <div class="flex py-3 border-b border-gray-100">
            <span class="w-32 text-gray-400 text-sm">创建者</span>
            <span class="flex-1 text-gray-800 text-sm font-medium">{{ modelDetail.creator }}</span>
          </div>
          <div class="flex py-3 border-b border-gray-100">
            <span class="w-32 text-gray-400 text-sm">租户</span>
            <span class="flex-1 text-gray-800 text-sm font-medium">{{ modelDetail.tenant }}</span>
          </div>
          <div class="flex py-3 md:col-span-2 border-b border-gray-100">
            <span class="w-32 text-gray-400 text-sm">描述</span>
            <span class="flex-1 text-gray-800 text-sm">{{ modelDetail.description }}</span>
          </div>
          <div class="flex py-3 md:col-span-2 border-b border-gray-100">
            <span class="w-32 text-gray-400 text-sm">失败原因</span>
            <span 
              class="flex-1 text-sm font-medium" 
              :class="modelDetail.status === '失败' ? 'text-red-500' : 'text-gray-500'"
            >
              {{ modelDetail.failedReason }}
            </span>
          </div>
        </div>
      </Card>

      <!-- 版本列表卡片 -->
      <Card :bordered="false" title="版本列表" class="shadow-sm rounded-lg">
        <template #extra>
          <Popconfirm
            title="确定要批量删除选中的版本吗？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="handleBatchDelete"
          >
            <Button :disabled="selectedRowKeys.length === 0" class="px-4">批量删除</Button>
          </Popconfirm>
        </template>

        <Table
          row-key="id"
          :columns="columns"
          :data-source="paginatedRows"
          :pagination="false"
          :row-selection="rowSelection"
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'modelPath'">
              <div class="flex items-center gap-1.5 text-gray-600 font-mono text-xs">
                <span>{{ record.modelPath }}</span>
                <Button 
                  type="text" 
                  size="small" 
                  class="flex items-center justify-center p-0 h-6 w-6 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded" 
                  @click="copyModelPath(record.modelPath)"
                >
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
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :page-size-options="['10', '20', '50', '100']"
            :show-quick-jumper="true"
            :show-size-changer="true"
            :total="versionRows.length"
          />
        </div>
      </Card>
    </div>
  </Page>
</template>
