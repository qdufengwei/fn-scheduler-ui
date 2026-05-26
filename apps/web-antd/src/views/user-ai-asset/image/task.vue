<script setup lang="ts">
import { ref } from 'vue';
import {
  Button,
  Pagination,
  Popconfirm,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import { Trash2 } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const pageSize = ref(10);
const currentPage = ref(1);
const selectedRowKeys = ref<number[]>([]);

const columns = [
  { title: '名称', dataIndex: 'name', width: 200 },
  { title: '来源', dataIndex: 'source', width: 120 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '节点', dataIndex: 'node', width: 150 },
  { title: '创建时间', dataIndex: 'created', width: 160 },
  { title: '完成时间', dataIndex: 'finished', width: 160 },
  { title: '操作', dataIndex: 'action', width: 100 },
];

const dataSource = ref([
  {
    id: 1,
    name: 'build-runtime-v1',
    source: '本地构建',
    status: '成功',
    node: 'node-gpu-01',
    created: '2026-05-25 11:20',
    finished: '2026-05-25 11:25',
  },
  {
    id: 2,
    name: 'build-custom-llm',
    source: '代码仓库',
    status: '进行中',
    node: 'node-gpu-02',
    created: '2026-05-25 14:30',
    finished: '-',
  },
  {
    id: 3,
    name: 'build-inference-img',
    source: '本地构建',
    status: '失败',
    node: 'node-gpu-03',
    created: '2026-05-24 09:15',
    finished: '2026-05-24 09:17',
  },
  {
    id: 4,
    name: 'build-pytorch-base',
    source: '代码仓库',
    status: '成功',
    node: 'node-gpu-01',
    created: '2026-05-23 16:40',
    finished: '2026-05-23 16:48',
  },
]);

const statusConfig: Record<string, { color: string }> = {
  成功: { color: 'success' },
  进行中: { color: 'processing' },
  失败: { color: 'error' },
};

const notify = (text: string) => message.success(text);

function handleDelete(record: any) {
  notify(`删除镜像任务 ${record.name}`);
}

function handleBatchDelete() {
  notify(`批量删除 ${selectedRowKeys.value.length} 个镜像任务成功`);
  selectedRowKeys.value = [];
}

function handleSelectionChange(keys: Array<number | string>) {
  selectedRowKeys.value = keys.map(Number);
}
</script>

<template>
  <div>
    <ListPageLayout>
      <template #toolbar>
          <Popconfirm
            title="确认删除选中的镜像任务？"
            ok-text="确认"
            cancel-text="取消"
            @confirm="handleBatchDelete"
          >
            <Button danger :disabled="selectedRowKeys.length === 0">
              <template #icon>
                <Trash2 class="size-4" />
              </template>
              批量删除
            </Button>
          </Popconfirm>
          <Button @click="notify('刷新成功')">刷新</Button>
      </template>

        <Table
          row-key="id"
          :data-source="dataSource"
          :pagination="false"
          :columns="columns"
          :row-selection="{
            selectedRowKeys,
            onChange: handleSelectionChange,
          }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
            </template>
            <template v-if="column.dataIndex === 'source'">
              <Tag class="rounded-full">{{ record.source }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="statusConfig[record.status]?.color" class="rounded-full">
                {{ record.status }}
              </Tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Popconfirm
                title="确认删除该镜像任务？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <Button type="link" size="small" danger>删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>

        <div class="fn-list-pagination flex items-center justify-end">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="dataSource.length"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
    </ListPageLayout>
  </div>
</template>
