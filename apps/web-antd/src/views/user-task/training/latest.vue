<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Info, Plus, RotateCw } from '@vben/icons';

import {
  Button,
  Pagination,
  Popconfirm,
  Segmented,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showInfo } from '#/utils/notify';

const router = useRouter();
const ownership = ref('mine');
const selectedUser = ref<string>();
const keyword = ref('');
const taskType = ref<string>();
const statusFilter = ref<string>();
const specFilter = ref<string>();
const rowSelection = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const userOptions = [
  { label: 'test01', value: 'test01' },
  { label: 'moon', value: 'moon' },
  { label: 'ai-research', value: 'ai-research' },
];

const taskTypeOptions = [
  { label: 'MPI', value: 'MPI' },
  { label: 'PyTorch', value: 'PyTorch' },
  { label: 'Simple', value: 'Simple' },
  { label: 'CPU', value: 'CPU' },
  { label: 'Deployment', value: 'Deployment' },
];

const statusOptions = [
  { label: '创建中', value: '创建中' },
  { label: '排队中', value: '排队中' },
  { label: '运行中', value: '运行中' },
  { label: '重启中', value: '重启中' },
  { label: '完成中', value: '完成中' },
  { label: '停止中', value: '停止中' },
  { label: '中断中', value: '中断中' },
  { label: '停止', value: '停止' },
  { label: '已完成', value: '已完成' },
  { label: '已成功', value: '已成功' },
  { label: '已停止', value: '已停止' },
  { label: '已失败', value: '已失败' },
  { label: '异常', value: '异常' },
  { label: '被抢占', value: '被抢占' },
  { label: '已删除', value: '已删除' },
];

const specOptions = [
  { label: 'NVIDIA-H100-HBM2E-80GB', value: 'NVIDIA-H100-HBM2E-80GB' },
  { label: 'NVIDIA-GPU-HBM2E-80GB', value: 'NVIDIA-GPU-HBM2E-80GB' },
  { label: 'NVIDIA-A800-80GB', value: 'NVIDIA-A800-80GB' },
  { label: 'NVIDIA-A100-40GB', value: 'NVIDIA-A100-40GB' },
  { label: 'NVIDIA-A10-24GB', value: 'NVIDIA-A10-24GB' },
];

const rows = ref([
  {
    id: 'TR-001',
    name: 'llm-pretrain-v3',
    user: 'test01',
    taskType: 'PyTorch',
    status: '运行中',
    readyStatus: '2/2',
    duration: '12h 30m',
    created: '2026-05-26 08:00',
    instances: 4,
    priority: 6,
    recyclePolicy: '不可回收',
    gpu: 32,
    spec: 'NVIDIA-A800-80GB',
  },
  {
    id: 'TR-002',
    name: 'cv-foundation',
    user: 'moon',
    taskType: 'MPI',
    status: '排队中',
    readyStatus: '0/2',
    duration: '-',
    created: '2026-05-27 09:30',
    instances: 2,
    priority: 5,
    recyclePolicy: '可回收',
    gpu: 16,
    spec: 'NVIDIA-A100-40GB',
  },
  {
    id: 'TR-003',
    name: 'speech-asr',
    user: 'test01',
    taskType: 'PyTorch',
    status: '已成功',
    readyStatus: '2/2',
    duration: '8h 15m',
    created: '2026-05-24 10:00',
    instances: 2,
    priority: 4,
    recyclePolicy: '不可回收',
    gpu: 8,
    spec: 'NVIDIA-A10-24GB',
  },
  {
    id: 'TR-004',
    name: 'nlp-ner',
    user: 'ai-research',
    taskType: 'Simple',
    status: '已失败',
    readyStatus: '0/1',
    duration: '1h 45m',
    created: '2026-05-23 14:20',
    instances: 1,
    priority: 3,
    recyclePolicy: '可回收',
    gpu: 4,
    spec: 'NVIDIA-A800-80GB',
  },
  {
    id: 'TR-005',
    name: 'multimodal-align',
    user: 'moon',
    taskType: 'PyTorch',
    status: '运行中',
    readyStatus: '2/2',
    duration: '6h 18m',
    created: '2026-05-26 13:15',
    instances: 2,
    priority: 6,
    recyclePolicy: '不可回收',
    gpu: 16,
    spec: 'NVIDIA-A800-80GB',
  },
  {
    id: 'TR-006',
    name: 'codegen-v2',
    user: 'test01',
    taskType: 'MPI',
    status: '已成功',
    readyStatus: '4/4',
    duration: '18h 50m',
    created: '2026-05-22 07:45',
    instances: 4,
    priority: 5,
    recyclePolicy: '不可回收',
    gpu: 32,
    spec: 'NVIDIA-A100-40GB',
  },
  {
    id: 'TR-007',
    name: 'video-understand',
    user: 'ai-research',
    taskType: 'PyTorch',
    status: '排队中',
    readyStatus: '0/3',
    duration: '-',
    created: '2026-05-27 10:00',
    instances: 3,
    priority: 4,
    recyclePolicy: '可回收',
    gpu: 24,
    spec: 'NVIDIA-A800-80GB',
  },
  {
    id: 'TR-008',
    name: 'rlhf-reward',
    user: 'test01',
    taskType: 'Simple',
    status: '运行中',
    readyStatus: '1/1',
    duration: '4h 42m',
    created: '2026-05-25 16:30',
    instances: 1,
    priority: 6,
    recyclePolicy: '不可回收',
    gpu: 8,
    spec: 'NVIDIA-A10-24GB',
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
    // 任务类型筛选
    if (taskType.value && r.taskType !== taskType.value) {
      return false;
    }
    // 状态筛选
    if (statusFilter.value && r.status !== statusFilter.value) {
      return false;
    }
    // 资源规格筛选
    if (specFilter.value && r.spec !== specFilter.value) {
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
    创建中: 'processing',
    排队中: 'default',
    重启中: 'processing',
    完成中: 'processing',
    停止中: 'warning',
    中断中: 'warning',
    停止: 'default',
    已完成: 'success',
    已成功: 'success',
    已停止: 'default',
    已失败: 'error',
    异常: 'error',
    被抢占: 'error',
    已删除: 'default',
  };
  return colorMap[status] || 'default';
};

const resetFilters = () => {
  keyword.value = '';
  ownership.value = 'mine';
  selectedUser.value = undefined;
  taskType.value = undefined;
  statusFilter.value = undefined;
  specFilter.value = undefined;
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
        <Select
          v-model:value="taskType"
          placeholder="任务类型"
          :options="taskTypeOptions"
          allow-clear
          style="width: 140px"
        />
        <Select
          v-model:value="statusFilter"
          placeholder="状态"
          :options="statusOptions"
          allow-clear
          style="width: 140px"
        />
        <Select
          v-model:value="specFilter"
          placeholder="资源规格"
          :options="specOptions"
          allow-clear
          style="width: 200px"
        />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="resetFilters">重置</Button>
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
        {
          title: '任务名称',
          dataIndex: 'name',
          key: 'name',
          width: 180,
        },
        {
          title: '任务类型',
          dataIndex: 'taskType',
          key: 'taskType',
          width: 100,
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          width: 100,
        },
        {
          title: () =>
            h('div', { class: 'flex items-center gap-1' }, [
              h('span', {}, '就绪状态'),
              h(
                Tooltip as any,
                { title: '当前运行数 / 期望运行数' },
                () =>
                  h(Info, {
                    class: 'size-3 text-gray-400 cursor-pointer',
                  }) as any,
              ),
            ]),
          dataIndex: 'readyStatus',
          key: 'readyStatus',
          width: 100,
        },
        {
          title: '运行时长',
          dataIndex: 'duration',
          key: 'duration',
          width: 100,
        },
        {
          title: '创建时间',
          dataIndex: 'created',
          key: 'created',
          width: 160,
          sorter: true,
        },
        {
          title: '实例数量',
          dataIndex: 'instances',
          key: 'instances',
          width: 90,
          sorter: true,
        },
        {
          title: '任务优先级',
          dataIndex: 'priority',
          key: 'priority',
          width: 90,
          sorter: true,
        },
        {
          title: '回收策略',
          dataIndex: 'recyclePolicy',
          key: 'recyclePolicy',
          width: 90,
        },
        {
          title: 'GPU 数量',
          dataIndex: 'gpu',
          key: 'gpu',
          width: 90,
          sorter: (a: any, b: any) => a.gpu - b.gpu,
        },
        { title: '资源规格', dataIndex: 'spec', key: 'spec', width: 200 },
        { title: '用户', dataIndex: 'user', key: 'user', width: 100 },
        { title: '操作', key: 'action', width: 150, fixed: 'right' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <div class="flex flex-col">
            <a
              class="text-blue-600 hover:text-blue-700 cursor-pointer"
              @click="
                router.push(`/user-task/latest/training/detail/${record.id}`)
              "
            >
              {{ record.name }}
            </a>
            <span class="text-xs text-gray-400">{{ record.id }}</span>
          </div>
        </template>
        <template v-else-if="column.key === 'taskType'">
          <Tag color="blue" class="rounded-full">{{ record.taskType }}</Tag>
        </template>
        <template v-else-if="column.key === 'status'">
          <Tag :color="getStatusColor(record.status)" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-else-if="column.key === 'action'">
          <Space :size="12">
            <a
              @click="
                router.push(`/user-task/latest/training/detail/${record.id}`)
              "
            >
              详情
            </a>
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
