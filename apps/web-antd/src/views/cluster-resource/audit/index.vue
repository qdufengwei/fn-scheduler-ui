<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, DatePicker, Pagination, Select, Space, Table, Tag } from 'ant-design-vue';
import { BookOpenText, Download, Inbox, Check, UserRoundPen } from '@vben/icons';

const selectedTenant = ref<string>();
const selectedUser = ref<string>();
const pageSize = ref(20);
const currentPage = ref(1);

const columns = [
  { title: '操作者', dataIndex: 'operator', width: 180 },
  { title: '租户', dataIndex: 'tenant', width: 180 },
  { title: '操作行为', dataIndex: 'action', width: 120 },
  { title: '请求结果', dataIndex: 'result', width: 100 },
  { title: '操作时间', dataIndex: 'time', width: 180 },
  { title: '请求方法', dataIndex: 'method', width: 100 },
];

const dataSource = ref([
  { id: 1, operator: 'shiyusuanli-testxq', tenant: 'shiyusuanli-testxq', action: '登录', result: '已成功', time: '2026-05-26 03:23:31', method: 'POST' },
  { id: 2, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-26 00:34:43', method: 'POST' },
  { id: 3, operator: 'test02', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-26 00:34:31', method: 'POST' },
  { id: 4, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-26 00:34:14', method: 'POST' },
  { id: 5, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-26 00:33:44', method: 'POST' },
  { id: 6, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-25 16:43:52', method: 'POST' },
  { id: 7, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 16:04:57', method: 'POST' },
  { id: 8, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 15:18:26', method: 'POST' },
  { id: 9, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-25 15:06:53', method: 'POST' },
  { id: 10, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 13:04:17', method: 'POST' },
  { id: 11, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 13:00:27', method: 'POST' },
  { id: 12, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 12:06:56', method: 'POST' },
  { id: 13, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 11:58:06', method: 'POST' },
  { id: 14, operator: 'shiyusuanli-testxq', tenant: 'shiyusuanli-testxq', action: '登录', result: '已成功', time: '2026-05-25 11:34:05', method: 'POST' },
  { id: 15, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 09:20:44', method: 'POST' },
  { id: 16, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-25 08:18:31', method: 'POST' },
  { id: 17, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-25 08:09:46', method: 'POST' },
  { id: 18, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 08:04:35', method: 'POST' },
  { id: 19, operator: 'test01', tenant: 'test01', action: '登录', result: '已成功', time: '2026-05-25 08:04:10', method: 'POST' },
  { id: 20, operator: 'admin', tenant: '-', action: '登录', result: '已成功', time: '2026-05-25 07:43:54', method: 'POST' },
]);
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <ShieldCheck class="size-5 text-blue-500" />
            <span class="text-lg font-semibold">审计日志</span>
          </div>
          <Space>
            <Select
              v-model:value="selectedTenant"
              allow-clear
              style="width: 180px"
              placeholder="请选择租户"
              :options="[{ label: 'test01', value: 'test01' }, { label: 'test-0415', value: 'test-0415' }]"
            >
              <template #suffixIcon><User class="size-4 text-gray-400" /></template>
            </Select>
            <Select
              v-model:value="selectedUser"
              allow-clear
              style="width: 180px"
              placeholder="请选择用户"
              :options="[{ label: 'admin', value: 'admin' }, { label: 'test01', value: 'test01' }]"
            />
            <DatePicker.RangePicker />
            <Button type="primary" ghost>
              <template #icon><Download class="size-4" /></template>
              日志下载
            </Button>
          </Space>
        </div>

        <Table
          row-key="id"
          :data-source="dataSource"
          :pagination="false"
          :columns="columns"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'operator'">
              <div class="flex items-center gap-2">
                <User class="size-4 text-gray-400" />
                <span>{{ record.operator }}</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'result'">
              <Tag color="success" class="rounded-full">{{ record.result }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'time'">
              <div class="flex items-center gap-2">
                <Calendar class="size-4 text-gray-400" />
                <span>{{ record.time }}</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'method'">
              <Tag :color="record.method === 'POST' ? 'blue' : 'green'" class="rounded-full">{{ record.method }}</Tag>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="53"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>
    </div>
  </Page>
</template>
