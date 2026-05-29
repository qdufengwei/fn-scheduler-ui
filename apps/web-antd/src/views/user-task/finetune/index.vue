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
const ownership = ref('all');
const selectedUser = ref<string>();
const keyword = ref('');
const selected = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const userOptions = [
  { label: 'test01', value: 'test01' },
  { label: 'moon', value: 'moon' },
  { label: 'ai-research', value: 'ai-research' },
];

const rows = ref([
  {
    id: 'FT-1001',
    name: '客服场景微调',
    user: 'test01',
    model: 'Qwen2-7B',
    status: '运行中',
    ready: 'Ready',
    duration: '1h 10m',
    created: '2026-05-26 11:20',
    instances: 2,
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'FT-1002',
    name: '法务语料微调',
    user: 'moon',
    model: 'Llama3-8B',
    status: '成功',
    ready: 'Ready',
    duration: '3h 40m',
    created: '2026-05-25 14:03',
    instances: 1,
    gpu: 2,
    spec: 'A10',
  },
  {
    id: 'FT-1003',
    name: '医疗问答微调',
    user: 'test01',
    model: 'ChatGLM3-6B',
    status: '排队中',
    ready: 'NotReady',
    duration: '-',
    created: '2026-05-27 09:00',
    instances: 1,
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'FT-1004',
    name: '代码助手微调',
    user: 'ai-research',
    model: 'DeepSeek-Coder-33B',
    status: '失败',
    ready: 'NotReady',
    duration: '0h 45m',
    created: '2026-05-24 08:30',
    instances: 2,
    gpu: 8,
    spec: 'A100',
  },
  {
    id: 'FT-1005',
    name: '金融风控微调',
    user: 'test01',
    model: 'Qwen2-14B',
    status: '运行中',
    ready: 'Ready',
    duration: '2h 35m',
    created: '2026-05-26 16:45',
    instances: 1,
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'FT-1006',
    name: '教育辅导微调',
    user: 'moon',
    model: 'Yi-34B',
    status: '成功',
    ready: 'Ready',
    duration: '5h 20m',
    created: '2026-05-23 10:15',
    instances: 2,
    gpu: 8,
    spec: 'A100',
  },
  {
    id: 'FT-1007',
    name: '电商客服微调',
    user: 'test01',
    model: 'Baichuan2-13B',
    status: '排队中',
    ready: 'NotReady',
    duration: '-',
    created: '2026-05-27 13:30',
    instances: 1,
    gpu: 2,
    spec: 'A10',
  },
  {
    id: 'FT-1008',
    name: '新闻摘要微调',
    user: 'ai-research',
    model: 'InternLM2-20B',
    status: '运行中',
    ready: 'Ready',
    duration: '0h 55m',
    created: '2026-05-27 15:10',
    instances: 2,
    gpu: 4,
    spec: 'A800',
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
    if (
      keyword.value &&
      !`${r.id}${r.model}${r.name}`.includes(keyword.value)
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
  title: '创建微调任务',
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
          <Input
            v-model:value="keyword"
            placeholder="搜索任务 ID/模型名/任务名"
            style="width: 280px"
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
          @click="router.push('/user-task/latest/finetune/create')"
        >
          <template #icon><Plus class="size-4" /></template>
          创建微调任务
        </Button>
        <Button @click="showNotify('刷新成功')">
          <template #icon><RotateCw class="size-4" /></template>
          刷新
        </Button>
        <Popconfirm
          title="确认删除选中的任务？"
          @confirm="showNotify(`已删除 ${selected.length} 个任务`)"
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
          { title: '任务名称', dataIndex: 'name' },
          { title: '任务 ID', dataIndex: 'id' },
          { title: '状态', dataIndex: 'status' },
          { title: '模型名称', dataIndex: 'model' },
          { title: '就绪状态', dataIndex: 'ready' },
          { title: '运行时长', dataIndex: 'duration' },
          { title: '实例数', dataIndex: 'instances' },
          { title: 'GPU 数', dataIndex: 'gpu' },
          { title: '资源规格', dataIndex: 'spec' },
          { title: '创建时间', dataIndex: 'created' },
          { title: '操作', dataIndex: 'action' },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="getStatusColor(record.status)" class="rounded-full">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'ready'">
            <Tag
              :color="record.ready === 'Ready' ? 'success' : 'warning'"
              class="rounded-full"
            >
              {{ record.ready }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space :size="12">
              <a @click="showNotify(`查看微调任务 ${record.id}`)">详情</a>
              <a
                :class="{
                  'pointer-events-none text-gray-300':
                    record.status !== '运行中',
                }"
                @click="
                  record.status === '运行中' &&
                  showNotify(`停止微调任务 ${record.id}`)
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
        创建微调任务表单（原型演示）
      </div>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button
            type="primary"
            @click="
              showNotify('已提交创建微调任务');
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
