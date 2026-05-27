<script setup lang="ts">
import { ref } from 'vue';
import {
  Button,
  DatePicker,
  Pagination,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { Download, RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const selectedTenant = ref<string>();
const selectedUser = ref<string>();
const pageSize = ref(20);
const currentPage = ref(1);

const columns = [
  { title: '操作者', dataIndex: 'operator', key: 'operator', width: 180 },
  { title: '租户', dataIndex: 'tenant', key: 'tenant', width: 180 },
  { title: '操作行为', dataIndex: 'action', key: 'action', width: 120 },
  { title: '请求结果', dataIndex: 'result', key: 'result', width: 100 },
  { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
  { title: '请求方法', dataIndex: 'method', key: 'method', width: 100 },
];

const dataSource = ref([
  {
    id: 1,
    operator: 'shiyusuanli-testxq',
    tenant: 'shiyusuanli-testxq',
    action: '登录',
    result: '已成功',
    time: '2026-05-26 03:23:31',
    method: 'POST',
  },
  {
    id: 2,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-26 00:34:43',
    method: 'POST',
  },
  {
    id: 3,
    operator: 'test02',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-26 00:34:31',
    method: 'POST',
  },
  {
    id: 4,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-26 00:34:14',
    method: 'POST',
  },
  {
    id: 5,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-26 00:33:44',
    method: 'POST',
  },
  {
    id: 6,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 16:43:52',
    method: 'POST',
  },
  {
    id: 7,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 16:04:57',
    method: 'POST',
  },
  {
    id: 8,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 15:18:26',
    method: 'POST',
  },
  {
    id: 9,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 15:06:53',
    method: 'POST',
  },
  {
    id: 10,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 13:04:17',
    method: 'POST',
  },
  {
    id: 11,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 13:00:27',
    method: 'POST',
  },
  {
    id: 12,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 12:06:56',
    method: 'POST',
  },
  {
    id: 13,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 11:58:06',
    method: 'POST',
  },
  {
    id: 14,
    operator: 'shiyusuanli-testxq',
    tenant: 'shiyusuanli-testxq',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 11:34:05',
    method: 'POST',
  },
  {
    id: 15,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 09:20:44',
    method: 'POST',
  },
  {
    id: 16,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 08:18:31',
    method: 'POST',
  },
  {
    id: 17,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 08:09:46',
    method: 'POST',
  },
  {
    id: 18,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 08:04:35',
    method: 'POST',
  },
  {
    id: 19,
    operator: 'test01',
    tenant: 'test01',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 08:04:10',
    method: 'POST',
  },
  {
    id: 20,
    operator: 'admin',
    tenant: '-',
    action: '登录',
    result: '已成功',
    time: '2026-05-25 07:43:54',
    method: 'POST',
  },
]);

function handleRefresh() {
  // 刷新逻辑
}

function handleDownload() {
  // 下载逻辑
}
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <Select
        v-model:value="selectedTenant"
        allow-clear
        style="width: 180px"
        placeholder="请选择租户"
        :options="[
          { label: 'test01', value: 'test01' },
          { label: 'test-0415', value: 'test-0415' },
        ]"
      />
      <Select
        v-model:value="selectedUser"
        allow-clear
        style="width: 180px"
        placeholder="请选择用户"
        :options="[
          { label: 'admin', value: 'admin' },
          { label: 'test01', value: 'test01' },
        ]"
      />
      <DatePicker.RangePicker />
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button>重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button type="primary" ghost @click="handleDownload">
        <template #icon><Download class="size-4" /></template>
        日志下载
      </Button>
      <Button @click="handleRefresh">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
    </template>

    <Table
      row-key="id"
      :data-source="dataSource"
      :pagination="false"
      :columns="columns"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operator'">
          <span>{{ record.operator }}</span>
        </template>
        <template v-else-if="column.key === 'result'">
          <Tag color="success" class="rounded-full">{{ record.result }}</Tag>
        </template>
        <template v-else-if="column.key === 'time'">
          <span>{{ record.time }}</span>
        </template>
        <template v-else-if="column.key === 'method'">
          <Tag
            :color="record.method === 'POST' ? 'blue' : 'green'"
            class="rounded-full"
            >{{ record.method }}</Tag
          >
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="53"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>
</template>
