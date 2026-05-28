<script setup lang="ts">
import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Space,
  Table,
} from 'ant-design-vue';
import { ref } from 'vue';
const period = ref('day');
const user = ref<string>();
const rows = ref([
  {
    id: 1,
    user: 'test01',
    type: '训练任务',
    item: 'Qwen2-7B 训练资源',
    usage: '45.00时',
    fee: 0,
    time: '2026-05-26 12:00',
  },
]);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4" title="钱包">
      <div class="mb-2">余额：¥0.00</div>
      <div class="mb-3 text-gray-500">上次充值：暂无记录</div>
      <Space
        ><Button type="primary">充值</Button><Button>充值记录</Button></Space
      >
    </Card>

    <Card class="mb-4" title="账单概览">
      <Space class="mb-3">
        <Button
          :type="period === 'day' ? 'primary' : 'default'"
          size="small"
          @click="period = 'day'"
          >日</Button
        >
        <Button
          :type="period === 'week' ? 'primary' : 'default'"
          size="small"
          @click="period = 'week'"
          >周</Button
        >
        <Button
          :type="period === 'month' ? 'primary' : 'default'"
          size="small"
          @click="period = 'month'"
          >月</Button
        >
        <Button
          :type="period === 'quarter' ? 'primary' : 'default'"
          size="small"
          @click="period = 'quarter'"
          >季度</Button
        >
        <Button
          :type="period === 'year' ? 'primary' : 'default'"
          size="small"
          @click="period = 'year'"
          >年</Button
        >
      </Space>
      <Row :gutter="12">
        <Col :span="6"><Card size="small">总金额：¥0.00</Card></Col>
        <Col :span="6"><Card size="small">总使用时长：45.00时</Card></Col>
        <Col :span="6"><Card size="small">已支付：¥0.00</Card></Col>
        <Col :span="6"><Card size="small">预算利用率：0.00%</Card></Col>
      </Row>
    </Card>

    <Card class="mb-4" title="预算管理">
      <Space class="mb-2"><Button>配置预算</Button></Space>
      <div>总预算：¥0.00　使用数量：¥0.00　剩余：¥0.00　预算利用率：0.00%</div>
    </Card>

    <Card title="账单明细">
      <template #title>
        <span class="text-base font-semibold">账单明细</span>
      </template>
      <div class="mb-4 pb-4 border-b border-gray-100">
        <Space wrap>
          <Button>导出</Button>
          <DatePicker.RangePicker />
          <Select
            v-model:value="user"
            allow-clear
            placeholder="请选择用户"
            style="width: 180px"
            :options="[{ label: 'test01', value: 'test01' }]"
          />
          <Input placeholder="搜索账单项" style="width: 220px" />
          <Button>筛选</Button>
          <Button @click="user = undefined">重置</Button>
        </Space>
      </div>
      <Table
        row-key="id"
        :data-source="rows.filter((r) => !user || r.user === user)"
        :columns="[
          { title: '用户名', dataIndex: 'user' },
          { title: '账单类型', dataIndex: 'type' },
          { title: '账单项', dataIndex: 'item' },
          { title: '资源用量', dataIndex: 'usage' },
          {
            title: '费用',
            dataIndex: 'fee',
            customRender: ({ text }) => `¥${Number(text).toFixed(2)}`,
          },
          { title: '账单时间', dataIndex: 'time' },
        ]"
      />
    </Card>
  </div>
</template>
