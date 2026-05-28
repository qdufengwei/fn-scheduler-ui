<script setup lang="ts">
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { ref } from 'vue';

const statusFilter = ref<string>();
const specFilter = ref<string>();
const keyword = ref('');
const resourceRows = ref([
  {
    id: 1,
    spec: 'A10-25%-8GiB',
    status: '运行中',
    usage: '3/8',
    gpu: 8,
    cycle: '包月',
    start: '2026-05-01',
    end: '2026-06-01',
    price: 1.0,
    name: '实例-01',
  },
  {
    id: 2,
    spec: 'H100-整机',
    status: '空闲',
    usage: '0/8',
    gpu: 8,
    cycle: '按量',
    start: '2026-05-22',
    end: '-',
    price: 28.0,
    name: '实例-02',
  },
]);

const resetFilters = () => {
  statusFilter.value = undefined;
  specFilter.value = undefined;
  keyword.value = '';
};
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <div class="text-base font-semibold">
        Hi，test01！欢迎来到人工智能算力集群管理平台
      </div>
      <div class="text-gray-500 text-xs mt-1">
        全链路 · 全堆栈 · 分布式异构解决方案
      </div>
    </Card>
    <Row :gutter="12" class="mb-4">
      <Col :span="8"
        ><Card title="标准实例"
          ><div class="text-2xl font-semibold">0</div>
          <div class="text-xs text-gray-500">利用率 0%</div></Card
        ></Col
      >
      <Col :span="8"
        ><Card title="MIG实例"
          ><div class="text-2xl font-semibold">0</div>
          <div class="text-xs text-gray-500">利用率 0%</div></Card
        ></Col
      >
      <Col :span="8"
        ><Card title="vGPU实例"
          ><div class="text-2xl font-semibold">0</div>
          <div class="text-xs text-gray-500">利用率 0%</div></Card
        ></Col
      >
    </Row>
    <Card class="mb-4">
      <Space wrap>
        <Select
          v-model:value="statusFilter"
          allow-clear
          placeholder="资源状态"
          style="width: 140px"
          :options="['运行中', '空闲'].map((v) => ({ label: v, value: v }))"
        />
        <Select
          v-model:value="specFilter"
          allow-clear
          placeholder="资源规格"
          style="width: 180px"
          :options="
            ['A10-25%-8GiB', 'H100-整机'].map((v) => ({ label: v, value: v }))
          "
        />
        <Input
          v-model:value="keyword"
          placeholder="搜索资源名称/规格"
          style="width: 240px"
        />
        <Button>筛选</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>
    <Card title="资源实例列表">
      <Table
        row-key="id"
        :data-source="
          resourceRows.filter(
            (r) =>
              (!statusFilter || r.status === statusFilter) &&
              (!specFilter || r.spec === specFilter) &&
              (!keyword || `${r.name}${r.spec}`.includes(keyword)),
          )
        "
        :columns="[
          { title: '名称/ID', dataIndex: 'name' },
          { title: '资源规格', dataIndex: 'spec' },
          { title: '资源状态', dataIndex: 'status' },
          { title: '资源用量', dataIndex: 'usage' },
          { title: 'GPU数量', dataIndex: 'gpu' },
          { title: '购买周期', dataIndex: 'cycle' },
          { title: '创建时间', dataIndex: 'start' },
          { title: '结束时间', dataIndex: 'end' },
          {
            title: '单价',
            dataIndex: 'price',
            customRender: ({ text }) => `¥${text.toFixed(2)} / 时`,
          },
          { title: '操作', dataIndex: 'action' },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <Tag
              :color="record.status === '运行中' ? 'processing' : 'default'"
              >{{ record.status }}</Tag
            >
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <Space :size="0">
              <a>查看</a>
              <a>配置MIG</a>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
