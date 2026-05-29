<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenDrawer } from '@vben/common-ui';
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
import { showNotify } from '#/utils/notify';

const router = useRouter();
const ownership = ref('mine');
const selectedUser = ref<string>();
const keyword = ref('');
const statusFilter = ref<string>();
const specFilter = ref<string>();
const selected = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const userOptions = [
  { label: 'test01', value: 'test01' },
  { label: 'moon', value: 'moon' },
  { label: 'ai-research', value: 'ai-research' },
];

const statusOptions = [
  { label: '运行中', value: '运行中' },
  { label: '已停止', value: '已停止' },
  { label: '异常', value: '异常' },
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
    id: 'INF-001',
    name: 'chat-qwen2',
    user: 'test01',
    model: 'Qwen2-7B',
    framework: 'vLLM',
    status: '运行中',
    ready: '2/2',
    replicas: 2,
    instances: 2,
    gpu: 2,
    spec: 'NVIDIA-A800-80GB',
    createdAt: '2026-05-25 10:30',
  },
  {
    id: 'INF-002',
    name: 'ocr-prod',
    user: 'moon',
    model: 'PaddleOCR',
    framework: 'Triton',
    status: '运行中',
    ready: '1/1',
    replicas: 1,
    instances: 1,
    gpu: 1,
    spec: 'NVIDIA-A10-24GB',
    createdAt: '2026-05-24 14:20',
  },
  {
    id: 'INF-003',
    name: 'embedding-api',
    user: 'test01',
    model: 'bge-large-zh',
    framework: 'vLLM',
    status: '已停止',
    ready: '0/0',
    replicas: 0,
    instances: 0,
    gpu: 0,
    spec: 'NVIDIA-A800-80GB',
    createdAt: '2026-05-20 09:15',
  },
  {
    id: 'INF-004',
    name: 'llama3-chat',
    user: 'ai-research',
    model: 'Llama3-8B',
    framework: 'TGI',
    status: '异常',
    ready: '1/2',
    replicas: 2,
    instances: 1,
    gpu: 1,
    spec: 'NVIDIA-A100-40GB',
    createdAt: '2026-05-23 16:45',
  },
  {
    id: 'INF-005',
    name: 'deepseek-coder-api',
    user: 'test01',
    model: 'DeepSeek-Coder-33B',
    framework: 'vLLM',
    status: '运行中',
    ready: '3/3',
    replicas: 3,
    instances: 3,
    gpu: 3,
    spec: 'NVIDIA-A800-80GB',
    createdAt: '2026-05-26 11:00',
  },
  {
    id: 'INF-006',
    name: 'whisper-asr',
    user: 'moon',
    model: 'Whisper-large',
    framework: 'Triton',
    status: '运行中',
    ready: '2/2',
    replicas: 2,
    instances: 2,
    gpu: 2,
    spec: 'NVIDIA-A10-24GB',
    createdAt: '2026-05-27 08:30',
  },
  {
    id: 'INF-007',
    name: 'rerank-v2',
    user: 'ai-research',
    model: 'bge-reranker',
    framework: 'TGI',
    status: '运行中',
    ready: '2/2',
    replicas: 2,
    instances: 2,
    gpu: 2,
    spec: 'NVIDIA-A100-40GB',
    createdAt: '2026-05-25 17:15',
  },
  {
    id: 'INF-008',
    name: 'rerank-service',
    user: 'test01',
    model: 'bge-reranker',
    framework: 'TGI',
    status: '运行中',
    ready: '0/1',
    replicas: 1,
    instances: 0,
    gpu: 0,
    spec: 'NVIDIA-A800-80GB',
    createdAt: '2026-05-27 09:40',
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
    // 状态筛选
    if (statusFilter.value && r.status !== statusFilter.value) {
      return false;
    }
    // 资源规格筛选
    if (specFilter.value && r.spec !== specFilter.value) {
      return false;
    }
    // 关键字筛选
    if (
      keyword.value &&
      !`${r.id}${r.name}${r.model}`.includes(keyword.value)
    ) {
      return false;
    }
    return true;
  });
});

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '创建推理服务',
});

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    运行中: 'success',
    已停止: 'default',
    异常: 'error',
  };
  return colorMap[status] || 'default';
};

const resetFilters = () => {
  keyword.value = '';
  ownership.value = 'mine';
  selectedUser.value = undefined;
  statusFilter.value = undefined;
  specFilter.value = undefined;
};
</script>

<template>
  <div>
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
            v-model:value="statusFilter"
            placeholder="状态"
            :options="statusOptions"
            allow-clear
            style="width: 120px"
          />
          <Select
            v-model:value="specFilter"
            placeholder="资源规格"
            :options="specOptions"
            allow-clear
            style="width: 200px"
          />
          <Input
            v-model:value="keyword"
            placeholder="搜索服务名称/ID/模型名"
            style="width: 260px"
            allow-clear
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
          @click="router.push('/user-task/latest/inference/create')"
        >
          <template #icon><Plus class="size-4" /></template>
          创建推理服务
        </Button>
        <Button @click="showNotify('刷新成功')">
          <template #icon><RotateCw class="size-4" /></template>
          刷新
        </Button>
        <Popconfirm
          title="确认删除选中的服务？"
          @confirm="showNotify(`已删除 ${selected.length} 个服务`)"
          :disabled="selected.length === 0"
        >
          <Button danger :disabled="selected.length === 0">批量删除</Button>
        </Popconfirm>
      </template>

      <Table
        row-key="id"
        :row-selection="{
          selectedRowKeys: selected,
          onChange: (keys: any[]) => (selected = keys),
        }"
        :data-source="filteredRows"
        :pagination="false"
        :columns="[
          {
            title: '服务名称',
            dataIndex: 'name',
            key: 'name',
            width: 160,
          },
          { title: '模型名称', dataIndex: 'model', key: 'model', width: 140 },
          {
            title: '推理框架',
            dataIndex: 'framework',
            key: 'framework',
            width: 100,
          },
          { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
          { title: '就绪状态', dataIndex: 'ready', key: 'ready', width: 90 },
          {
            title: '创建时间',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 160,
            sorter: true,
          },
          {
            title: 'GPU 数量',
            dataIndex: 'gpu',
            key: 'gpu',
            width: 90,
            sorter: true,
          },
          { title: '资源规格', dataIndex: 'spec', key: 'spec', width: 200 },
          {
            title: '当前副本数',
            dataIndex: 'replicas',
            key: 'replicas',
            width: 100,
            sorter: true,
          },
          {
            title: '实例数量',
            dataIndex: 'instances',
            key: 'instances',
            width: 90,
            sorter: true,
          },
          { title: '用户', dataIndex: 'user', key: 'user', width: 100 },
          { title: '操作', key: 'action', width: 120, fixed: 'right' },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex flex-col">
              <a class="text-blue-600 hover:text-blue-700 cursor-pointer">{{
                record.name
              }}</a>
              <span class="text-xs text-gray-400">{{ record.id }}</span>
            </div>
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="getStatusColor(record.status)" class="rounded-full">
              {{ record.status }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'ready'">
            <Tag
              :color="record.ready.startsWith('0') ? 'warning' : 'success'"
              class="rounded-full"
            >
              {{ record.ready }}
            </Tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <Space :size="12">
              <a @click="showNotify(`查看推理服务 ${record.id}`)">详情</a>
              <a
                :class="{
                  'pointer-events-none text-gray-300':
                    record.status !== '运行中',
                }"
                @click="
                  record.status === '运行中' &&
                  showNotify(`停止推理服务 ${record.id}`)
                "
              >
                停止
              </a>
            </Space>
          </template>
        </template>
      </Table>

      <div class="fn-list-pagination flex items-center justify-end">
        <Pagination
          v-model:current="currentPage"
          v-model:page-size="pageSize"
          :total="rows.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
        />
      </div>
    </ListPageLayout>

    <CreateDrawer>
      <div class="text-center text-gray-400 py-8">
        创建推理服务表单（原型演示）
      </div>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button
            type="primary"
            @click="
              showNotify('已提交创建推理服务');
              createDrawerApi.close();
            "
          >
            确认
          </Button>
        </Space>
      </template>
    </CreateDrawer>
  </div>
</template>
