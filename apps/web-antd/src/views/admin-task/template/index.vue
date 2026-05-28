<script setup lang="ts">
import {
  Button,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { ref } from 'vue';
import { RotateCw, X } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const rowSelection = ref<number[]>([]);
const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '模板名称', dataIndex: 'name', width: 150 },
  { title: '任务类型', dataIndex: 'taskType', width: 100 },
  { title: '镜像信息', dataIndex: 'image', width: 280 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: '任务优先级', dataIndex: 'priority', width: 100 },
  { title: '回收策略', dataIndex: 'recyclePolicy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 120, fixed: 'right' as const },
];

const data = ref([
  {
    id: 1,
    name: 'simple',
    taskType: 'Simple',
    image: 'harbor.local.clusters/library/ngc:25.06-py3-ssh',
    gpuCount: 8,
    resourceSpec: 'NVIDIA-H100-HBM2E-80GB',
    instances: 1,
    priority: '6',
    recyclePolicy: '不可回收',
    createTime: '2026-03-03 10:46:10',
    user: 'test01',
    tenant: 'test01',
  },
]);
</script>

<template>
  <ListPageLayout>
    <template #toolbar>
      <Popconfirm
        title="确认删除选中的模板？"
        @confirm="showNotify(`已删除 ${rowSelection.length} 个模板`)"
        :disabled="rowSelection.length === 0"
      >
        <Button danger :disabled="rowSelection.length === 0">
          <template #icon><X class="size-4" /></template>
          批量删除
        </Button>
      </Popconfirm>
      <Button @click="showNotify('列表已刷新')">
        <template #icon><RotateCw class="size-4" /></template>
      </Button>
    </template>

    <Table
      row-key="id"
      :row-selection="{
        selectedRowKeys: rowSelection,
        onChange: (keys: any[]) => (rowSelection = keys),
      }"
      :data-source="data"
      :pagination="false"
      :columns="columns"
      :scroll="{ x: 1700 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a class="font-medium text-blue-600 hover:text-blue-700">{{
            record.name
          }}</a>
        </template>
        <template v-if="column.dataIndex === 'taskType'">
          <Tag class="rounded-full">{{ record.taskType }}</Tag>
        </template>
        <template v-if="column.dataIndex === 'tenant'">
          <div>
            <span>{{ record.tenant }}</span>
            <span class="text-gray-400 ml-1">-</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space>
            <a @click="showNotify(`修改模板 ${record.name}`)">修改模板</a>
            <Popconfirm
              title="确认删除该模板？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="showNotify(`删除模板 ${record.name}`)"
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
        v-model:pageSize="pageSize"
        :total="1"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
