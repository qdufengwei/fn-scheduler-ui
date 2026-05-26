<script setup lang="ts">
import { Button, Card, DatePicker, Select, Space, Switch, Table } from 'ant-design-vue';
import { ref } from 'vue';

const metric = ref('avg');
const refresh = ref(40);
const taskType = ref('训练任务');
const taskName = ref('测试1');
const view = ref('card');
const quickRange = ref('1h');
const autoRefresh = ref(true);
const metrics = [
  'GPU功率', 'GPU温度', 'NVLink带宽', 'NVLink传输字节数', 'NVLink接收字节数', 'GPU利用率',
  'GPU显存利用率', 'GPU SM利用率', 'GPU显存使用量', 'GPU Tensor Core利用率', 'CPU使用量', '内存使用量',
];
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <div class="font-semibold">任务名称：{{ taskName }}</div>
          <div class="text-xs text-gray-500">状态：排队中 · 已运行：0h 0m 0s</div>
        </div>
        <Button disabled>报表下载</Button>
      </div>
      <Space wrap>
        <span>切换任务</span>
        <Select v-model:value="taskType" style="width: 130px" :options="[{ label: '训练任务', value: '训练任务' }, { label: '开发机', value: '开发机' }]" />
        <Select v-model:value="taskName" style="width: 140px" :options="[{ label: '测试1', value: '测试1' }, { label: '测试2', value: '测试2' }]" />
        <Select v-model:value="metric" style="width: 100px" :options="[{ label: '平均值', value: 'avg' }]" />
        <Switch v-model:checked="autoRefresh" />
        <Select v-model:value="refresh" style="width: 90px" :options="[10,30,40,60].map((v)=>({label:`${v}s`,value:v}))" />
        <DatePicker.RangePicker />
      </Space>
      <Space class="mt-3">
        <Button :type="quickRange === '1h' ? 'primary' : 'default'" size="small" @click="quickRange='1h'">近一小时</Button>
        <Button :type="quickRange === '3h' ? 'primary' : 'default'" size="small" @click="quickRange='3h'">近三小时</Button>
        <Button :type="quickRange === '6h' ? 'primary' : 'default'" size="small" @click="quickRange='6h'">近六小时</Button>
        <Button :type="quickRange === '1d' ? 'primary' : 'default'" size="small" @click="quickRange='1d'">近一天</Button>
        <Button :type="quickRange === '3d' ? 'primary' : 'default'" size="small" @click="quickRange='3d'">近三天</Button>
      </Space>
      <Space class="mt-3">
        <Button :type="view === 'card' ? 'primary' : 'default'" size="small" @click="view='card'">卡片视图</Button>
        <Button :type="view === 'list' ? 'primary' : 'default'" size="small" @click="view='list'">列表视图</Button>
      </Space>
    </Card>

    <Card v-if="view === 'card'" title="指标卡片">
      <div class="grid grid-cols-3 gap-3">
        <Card v-for="item in metrics" :key="item" size="small">
          <div class="text-xs text-gray-500">{{ item }}</div>
          <div class="mt-2 text-sm font-semibold">当前值：--</div>
          <div class="mt-2 h-10 rounded bg-blue-50" />
        </Card>
      </div>
    </Card>
    <Card v-else title="指标列表">
      <Table
        row-key="name"
        :data-source="metrics.map((m)=>({name:m,value:'--',trend:'--'}))"
        :columns="[{title:'指标',dataIndex:'name'},{title:'当前值',dataIndex:'value'},{title:'趋势',dataIndex:'trend'}]"
        :pagination="false"
      />
    </Card>
  </div>
</template>
