<script setup lang="ts">
import { Button, Pagination, Popconfirm, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { RotateCw, Search } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const selectedTenant = ref<string>();
const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

const devboxColumns = [
  { title: '名称/ID', dataIndex: 'name', width: 250, fixed: 'left' as const },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: 'GPU', dataIndex: 'gpu', width: 60 },
  { title: 'CPU', dataIndex: 'cpu', width: 60 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const devboxData = ref([
  { id: 1, name: '测试1', taskId: 'job-30261777db2f-20260428013313', status: '排队中', type: 'Jupyter', resourceSpec: '-', gpu: 0, cpu: 4, user: 'a01', tenant: 'test01', createTime: '2026-04-28 01:33:13' },
]);

const statusColor: Record<string, string> = {
  '运行中': 'processing',
  '停止': 'default',
  '排队中': 'warning',
  '成功': 'success',
  '失败': 'error',
};

const notify = (text: string) => message.success(text);
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <Select
        v-model:value="selectedTenant"
        allow-clear
        style="width: 180px"
        placeholder="请选择租户"
        :options="[{ label: 'test01', value: 'test01' }, { label: 'test-0415', value: 'test-0415' }]"
      >
        <template #suffixIcon><Search class="size-4 text-gray-400" /></template>
      </Select>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="(searchText = ''); (selectedTenant = undefined)">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button @click="notify('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
      </Button>
    </template>

    <Table
      row-key="id"
      :data-source="devboxData"
      :pagination="false"
      :columns="devboxColumns"
      :scroll="{ x: 1300 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <div>
            <a class="font-medium text-blue-600 hover:text-blue-700">{{ record.name }}</a>
            <div class="text-xs text-gray-400">{{ record.taskId }}</div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'type'">
          <Tag class="rounded-full">{{ record.type }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'tenant'">
          <div>
            <span>{{ record.tenant }}</span>
            <span class="text-gray-400 ml-1">-</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Popconfirm title="确认删除该开发机？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除开发机 ${record.name}`)">
            <a class="text-red-500">删除</a>
          </Popconfirm>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="1"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>