<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Plus, RotateCw } from '@vben/icons';

import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showInfo } from '#/utils/notify';

const router = useRouter();
const ownership = ref('mine');
const selectedUser = ref<string>();
const keyword = ref('');
const rowSelection = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const userOptions = [
  { label: 'test01', value: 'test01' },
  { label: 'moon', value: 'moon' },
  { label: 'ai-research', value: 'ai-research' },
];

const rows = ref([
  {
    id: 'TR-001',
    name: 'llm-pretrain-v3',
    user: 'test01',
    model: 'Qwen2-72B',
    status: '运行中',
    progress: 67,
    duration: '12h 30m',
    created: '2026-05-26 08:00',
    instances: 4,
    gpu: 32,
    spec: 'A800',
  },
  {
    id: 'TR-002',
    name: 'cv-foundation',
    user: 'moon',
    model: 'ViT-Large',
    status: '排队中',
    progress: 0,
    duration: '-',
    created: '2026-05-27 09:30',
    instances: 2,
    gpu: 16,
    spec: 'A100',
  },
  {
    id: 'TR-003',
    name: 'speech-asr',
    user: 'test01',
    model: 'Whisper-Large',
    status: '成功',
    progress: 100,
    duration: '8h 15m',
    created: '2026-05-24 10:00',
    instances: 2,
    gpu: 8,
    spec: 'A10',
  },
  {
    id: 'TR-004',
    name: 'nlp-ner',
    user: 'ai-research',
    model: 'BERT-Large',
    status: '失败',
    progress: 23,
    duration: '1h 45m',
    created: '2026-05-23 14:20',
    instances: 1,
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'TR-005',
    name: 'multimodal-align',
    user: 'moon',
    model: 'CLIP-ViT-L',
    status: '运行中',
    progress: 41,
    duration: '6h 18m',
    created: '2026-05-26 13:15',
    instances: 2,
    gpu: 16,
    spec: 'A800',
  },
  {
    id: 'TR-006',
    name: 'codegen-v2',
    user: 'test01',
    model: 'DeepSeek-Coder-33B',
    status: '成功',
    progress: 100,
    duration: '18h 50m',
    created: '2026-05-22 07:45',
    instances: 4,
    gpu: 32,
    spec: 'A100',
  },
  {
    id: 'TR-007',
    name: 'video-understand',
    user: 'ai-research',
    model: 'InternVideo2',
    status: '排队中',
    progress: 0,
    duration: '-',
    created: '2026-05-27 10:00',
    instances: 3,
    gpu: 24,
    spec: 'A800',
  },
  {
    id: 'TR-008',
    name: 'rlhf-reward',
    user: 'moon',
    model: 'Qwen2-7B',
    status: '运行中',
    progress: 85,
    duration: '4h 42m',
    created: '2026-05-25 16:30',
    instances: 1,
    gpu: 8,
    spec: 'A10',
  },
]);

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    // 所有权筛选
    if (ownership.value === 'mine' && r.user !== 'test01') {
      return false;
    }
    // 用户筛选（全部模式下才生效）
    if (
      ownership.value === 'all' &&
      selectedUser.value &&
      r.user !== selectedUser.value
    ) {
      return false;
    }
    // 关键字筛选
    if (keyword.value && !`${r.name}${r.id}`.includes(keyword.value)) {
      return false;
    }
    return true;
  });
});

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    运行中: 'processing',
    成功: 'success',
    失败: 'error',
    排队中: 'default',
  };
  return colorMap[status] || 'default';
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
        <Select
          v-if="ownership === 'all'"
          v-model:value="selectedUser"
          placeholder="选择用户"
          :options="userOptions"
          allow-clear
          style="width: 150px"
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
            selectedUser = undefined;
          "
        >
          重置
        </Button>
      </Space>
    </template>

    <template #toolbar>
      <Button
        type="primary"
        @click="router.push('/user-task/latest/training/create')"
      >
        <template #icon><Plus class="size-4" /></template>
        创建任务
      </Button>
      <Button @click="showInfo('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
      <Popconfirm
        title="确认删除选中的任务？"
        @confirm="showInfo(`已删除 ${rowSelection.length} 个任务`)"
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
      :data-source="filteredRows"
      :pagination="false"
      :columns="[
        { title: '任务名称', dataIndex: 'name' },
        { title: '任务ID', dataIndex: 'id' },
        { title: '状态', dataIndex: 'status' },
        { title: '模型名称', dataIndex: 'model' },
        { title: '运行时长', dataIndex: 'duration' },
        { title: '实例数', dataIndex: 'instances' },
        { title: 'GPU数', dataIndex: 'gpu' },
        { title: '资源规格', dataIndex: 'spec' },
        { title: '创建时间', dataIndex: 'created' },
        { title: '操作', dataIndex: 'action' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a
            class="text-blue-600 hover:text-blue-700"
            @click="
              router.push(`/user-task/latest/training/detail/${record.id}`)
            "
            >{{ record.name }}</a
          >
        </template>
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="getStatusColor(record.status)" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space :size="12">
            <a
              @click="
                router.push(`/user-task/latest/training/detail/${record.id}`)
              "
              >详情</a
            >
            <a
              :class="{
                'pointer-events-none text-gray-300': record.status !== '运行中',
              }"
              @click="
                record.status === '运行中' && showInfo(`停止任务 ${record.id}`)
              "
            >
              停止
            </a>
            <Popconfirm
              title="确认删除该任务？"
              @confirm="showInfo(`删除任务 ${record.id}`)"
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
        :total="filteredRows.length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
