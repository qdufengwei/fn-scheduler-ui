<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { BookOpenText, Download, Inbox, Settings } from '@vben/icons';

import {
  Button,
  Card,
  Col,
  DatePicker,
  Pagination,
  Radio,
  RadioGroup,
  Row,
  Select,
  Space,
  Table,
} from 'ant-design-vue';

const billingCycle = ref('day');
const selectedTenant = ref<string>();
const pageSize = ref(10);
const currentPage = ref(1);

const billingStats = ref({
  totalAmount: 0,
  totalUsageTime: 20,
  paid: 0,
});

const columns = [
  { title: '租户/别名', dataIndex: 'tenant', width: 200 },
  { title: '资源用量', dataIndex: 'usage', width: 250 },
  { title: '费用', dataIndex: 'cost', width: 120 },
  { title: '操作', dataIndex: 'action', width: 120 },
];

const dataSource = ref([
  {
    id: 1,
    tenant: 'shiyusuanli-demandertest',
    alias: 'shiyusuanli-demandertest',
    usage: '按需（小时）: 0.06 hours',
    cost: '¥0.00',
  },
  {
    id: 2,
    tenant: 'test-0415',
    alias: '-',
    usage: '按需（小时）: 2453.29 hours',
    cost: '¥0.00',
  },
  {
    id: 3,
    tenant: 'test01',
    alias: '-',
    usage: '包年: 5.00 GB/ years\n按需（小时）: 3026.25 hours',
    cost: '¥0.00',
  },
  {
    id: 4,
    tenant: 'ai-lab-team',
    alias: 'AI实验室',
    usage: '按需（小时）: 1280.50 hours\n包月: 2.00 GB/ months',
    cost: '¥1,280.50',
  },
  {
    id: 5,
    tenant: 'nlp-research',
    alias: '自然语言研究组',
    usage: '按需（小时）: 876.33 hours',
    cost: '¥876.33',
  },
  {
    id: 6,
    tenant: 'cv-department',
    alias: '计算机视觉部',
    usage: '包年: 10.00 GB/ years\n按需（小时）: 542.18 hours',
    cost: '¥542.18',
  },
  {
    id: 7,
    tenant: 'data-mining-group',
    alias: '数据挖掘组',
    usage: '按需（小时）: 3215.77 hours',
    cost: '¥3,215.77',
  },
  {
    id: 8,
    tenant: 'speech-lab',
    alias: '语音实验室',
    usage: '包月: 8.00 GB/ months\n按需（小时）: 198.60 hours',
    cost: '¥198.60',
  },
]);
</script>

<template>
  <Page auto-content-height>
    <div class="p-4 space-y-4">
      <!-- 账单概览 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <Settings class="size-5 text-blue-500" />
            <span class="text-lg font-semibold">账单概览</span>
          </div>
          <RadioGroup v-model:value="billingCycle" class="flex gap-2">
            <Radio value="day" class="rounded-full">日</Radio>
            <Radio value="week" class="rounded-full">周</Radio>
            <Radio value="month" class="rounded-full">月</Radio>
            <Radio value="quarter" class="rounded-full">季度</Radio>
            <Radio value="year" class="rounded-full">年</Radio>
          </RadioGroup>
        </div>
        <Row :gutter="24">
          <Col :span="8">
            <div
              class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <Download class="size-8 mx-auto mb-3 text-blue-500" />
              <div class="text-xs text-gray-500 mb-2">总金额</div>
              <div class="text-3xl font-bold text-blue-600">
                ¥{{ billingStats.totalAmount.toFixed(2) }}
              </div>
            </div>
          </Col>
          <Col :span="8">
            <div
              class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <Inbox class="size-8 mx-auto mb-3 text-green-500" />
              <div class="text-xs text-gray-500 mb-2">总使用时长</div>
              <div class="text-3xl font-bold text-green-600">
                {{ billingStats.totalUsageTime.toFixed(2) }} 时
              </div>
            </div>
          </Col>
          <Col :span="8">
            <div
              class="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <Settings class="size-8 mx-auto mb-3 text-purple-500" />
              <div class="text-xs text-gray-500 mb-2">已支付</div>
              <div class="text-3xl font-bold text-purple-600">
                ¥{{ billingStats.paid.toFixed(2) }}
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <!-- 费用总览 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <Settings class="size-5 text-orange-500" />
          <span class="font-medium">费用总览</span>
        </div>
      </Card>

      <!-- 账单明细 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <BookOpenText class="size-5 text-green-500" />
            <span class="text-lg font-semibold">账单明细</span>
          </div>
          <Space>
            <DatePicker.RangePicker />
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
            <Button type="primary" ghost>
              <template #icon><Download class="size-4" /></template>
              导出
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
            <template v-if="column.dataIndex === 'tenant'">
              <div>
                <span class="font-medium text-gray-800">{{
                  record.tenant
                }}</span>
                <span class="text-gray-400 ml-1">{{ record.alias }}</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'usage'">
              <div class="whitespace-pre-line text-sm">{{ record.usage }}</div>
            </template>
            <template v-if="column.dataIndex === 'cost'">
              <span class="font-semibold text-gray-800">{{ record.cost }}</span>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Button type="link" size="small"> 查看详情 </Button>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :total="dataSource.length"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>
    </div>
  </Page>
</template>
