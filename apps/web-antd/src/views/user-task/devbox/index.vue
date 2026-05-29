<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useVbenDrawer } from '@vben/common-ui';
import { Plus, RotateCw } from '@vben/icons';

import {
  Button,
  Pagination,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showInfo } from '#/utils/notify';

const router = useRouter();
const statusFilter = ref<string | undefined>();
const typeFilter = ref<string | undefined>();
const currentPage = ref(1);
const pageSize = ref(10);

const rows = ref([
  {
    id: 'DV-001',
    name: '测试开发机1',
    status: '排队中',
    type: 'Jupyter',
    spec: 'A800-80GB',
    gpu: 1,
    cpu: 8,
    memory: '32GB',
    created: '2026-05-27 01:33:13',
  },
  {
    id: 'DV-002',
    name: '模型调试环境',
    status: '运行中',
    type: 'VSCode',
    spec: 'A100-40GB',
    gpu: 2,
    cpu: 16,
    memory: '64GB',
    created: '2026-05-26 10:15:00',
  },
  {
    id: 'DV-003',
    name: '数据处理机',
    status: '已停止',
    type: 'SSH',
    spec: 'A10-24GB',
    gpu: 1,
    cpu: 4,
    memory: '16GB',
    created: '2026-05-20 14:30:00',
  },
  {
    id: 'DV-004',
    name: 'Qwen2微调开发机',
    status: '运行中',
    type: 'Jupyter',
    spec: 'A800-80GB',
    gpu: 4,
    cpu: 32,
    memory: '128GB',
    created: '2026-05-25 09:00:00',
  },
  {
    id: 'DV-005',
    name: 'LLaMA3调试环境',
    status: '运行中',
    type: 'VSCode',
    spec: 'H100-80GB',
    gpu: 2,
    cpu: 16,
    memory: '64GB',
    created: '2026-05-24 15:20:00',
  },
  {
    id: 'DV-006',
    name: '图像生成开发机',
    status: '已停止',
    type: 'Jupyter',
    spec: 'A10-24GB',
    gpu: 1,
    cpu: 8,
    memory: '32GB',
    created: '2026-05-22 11:45:00',
  },
  {
    id: 'DV-007',
    name: '分布式训练调试机',
    status: '排队中',
    type: 'SSH',
    spec: 'H100-80GB',
    gpu: 8,
    cpu: 64,
    memory: '256GB',
    created: '2026-05-23 08:30:00',
  },
  {
    id: 'DV-008',
    name: 'NLP标注开发机',
    status: '运行中',
    type: 'VSCode',
    spec: 'A100-40GB',
    gpu: 1,
    cpu: 8,
    memory: '32GB',
    created: '2026-05-21 16:10:00',
  },
]);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '创建开发机',
});

const filteredRows = () => {
  return rows.value.filter((r) => {
    if (statusFilter.value && r.status !== statusFilter.value) return false;
    if (typeFilter.value && r.type !== typeFilter.value) return false;
    return true;
  });
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    运行中: 'success',
    已停止: 'default',
    排队中: 'processing',
  };
  return colorMap[status] || 'default';
};

const resetFilters = () => {
  statusFilter.value = undefined;
  typeFilter.value = undefined;
};
</script>

<template>
  <div>
    <ListPageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <Select
            v-model:value="statusFilter"
            allow-clear
            placeholder="选择状态"
            style="width: 140px"
            :options="[
              { label: '运行中', value: '运行中' },
              { label: '已停止', value: '已停止' },
              { label: '排队中', value: '排队中' },
            ]"
          />
          <Select
            v-model:value="typeFilter"
            allow-clear
            placeholder="选择类型"
            style="width: 140px"
            :options="[
              { label: 'Jupyter', value: 'Jupyter' },
              { label: 'VSCode', value: 'VSCode' },
              { label: 'SSH', value: 'SSH' },
            ]"
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
          @click="router.push('/user-task/latest/devbox/create')"
        >
          <template #icon><Plus class="size-4" /></template>
          创建开发机
        </Button>
        <Button @click="showInfo('刷新成功')">
          <template #icon><RotateCw class="size-4" /></template>
          刷新
        </Button>
      </template>

      <Table
        row-key="id"
        :data-source="filteredRows()"
        :pagination="false"
        :columns="[
          { title: '名称', dataIndex: 'name' },
          { title: 'ID', dataIndex: 'id' },
          { title: '状态', dataIndex: 'status' },
          { title: '类型', dataIndex: 'type' },
          { title: '资源规格', dataIndex: 'spec' },
          { title: 'GPU', dataIndex: 'gpu' },
          { title: 'CPU', dataIndex: 'cpu' },
          { title: '内存', dataIndex: 'memory' },
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
          <template v-if="column.dataIndex === 'type'">
            <Tag color="blue" class="rounded-full">{{ record.type }}</Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space :size="12">
              <a
                :class="{
                  'pointer-events-none text-gray-300':
                    record.status !== '运行中',
                }"
                @click="
                  record.status === '运行中' &&
                  showInfo(`进入开发机 ${record.id}`)
                "
              >
                进入
              </a>
              <a @click="showInfo(`保存开发机 ${record.id} 为镜像`)"
                >保存镜像</a
              >
              <Popconfirm
                title="确认删除该开发机？"
                @confirm="showInfo(`删除开发机 ${record.id}`)"
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
          :total="filteredRows().length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
        />
      </div>
    </ListPageLayout>

    <CreateDrawer>
      <div class="text-center text-gray-400 py-8">
        创建开发机表单（原型演示）
      </div>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button
            type="primary"
            @click="
              showInfo('已提交创建开发机');
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
