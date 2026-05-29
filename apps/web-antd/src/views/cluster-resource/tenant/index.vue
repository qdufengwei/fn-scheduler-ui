<script setup lang="tsx">
import { computed, ref } from 'vue';

import {
  Button,
  Card,
  Col,
  Divider,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from 'ant-design-vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const selectedTenant = ref<string>();

const resourceStats = ref({
  total: { value: 64, fullCard: 48, mig: 8, vgpu: 8 },
  allocated: { value: 56, fullCard: 40, mig: 8, vgpu: 8 },
  sold: { value: 4, fullCard: 4, mig: 0, vgpu: 0 },
  available: { value: 4, fullCard: 4, mig: 0, vgpu: 0, rate: 6.25 },
});

const columns = [
  {
    title: '租户/别名',
    dataIndex: 'tenant',
    key: 'tenant',
    width: 150,
    customRender: ({ record }: { record: any }) => {
      const rowSpan = record.tenantRowSpan;
      if (rowSpan === 0) {
        return { props: { rowSpan: 0 } };
      }
      return {
        children: (
          <div>
            <span class="font-medium text-gray-800">{record.tenant}</span>
            <span class="ml-1 text-gray-400">{record.alias}</span>
          </div>
        ),
        props: { rowSpan },
      };
    },
  },
  {
    title: '存储',
    dataIndex: 'storage',
    key: 'storage',
    width: 180,
    customRender: ({ record }: { record: any }) => {
      const rowSpan = record.storageRowSpan;
      if (rowSpan === 0) {
        return { props: { rowSpan: 0 } };
      }
      return {
        children: record.storage || '-',
        props: { rowSpan },
      };
    },
  },
  { title: '配额来源', dataIndex: 'source', key: 'source', width: 100 },
  { title: '配额类型', dataIndex: 'type', key: 'type', width: 120 },
  {
    title: 'GPU资源名称',
    dataIndex: 'gpuResource',
    key: 'gpuResource',
    width: 250,
  },
  { title: '已用/总计', dataIndex: 'used', key: 'used', width: 120 },
  { title: '到期时间', dataIndex: 'expireTime', key: 'expireTime', width: 150 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
];

// 原始数据
const rawDataSource = ref([
  // test-0415 租户 - 多条记录
  {
    id: 1,
    tenant: 'test-0415',
    alias: '测试租户A',
    storage: '50.00 GB / 200.00 GB',
    source: '分配',
    type: 'GPU卡',
    gpuResource: '10x（NVIDIA-GPU-HBM2E-80GB）',
    used: '7 卡 / 10 卡',
    expireTime: '-',
  },
  {
    id: 2,
    tenant: 'test-0415',
    alias: '测试租户A',
    storage: '',
    source: '分配',
    type: 'MIG',
    gpuResource: '4x（MIG-1g.5GB）',
    used: '2 卡 / 4 卡',
    expireTime: '-',
  },
  {
    id: 3,
    tenant: 'test-0415',
    alias: '测试租户A',
    storage: '',
    source: '购买',
    type: 'GPU卡',
    gpuResource: '2x（NVIDIA-GPU-HBM2E-80GB）',
    used: '0 卡 / 2 卡',
    expireTime: '2026-12-31',
  },
  // test01 租户 - 多条记录
  {
    id: 4,
    tenant: 'test01',
    alias: '研发部门',
    storage: '100.00 GB / 500.00 GB',
    source: '分配',
    type: '整机分配',
    gpuResource: 'node201（8xNVIDIA-H100-HBM2E-80GB）',
    used: '4 节点 / 1 节点',
    expireTime: '-',
  },
  {
    id: 5,
    tenant: 'test01',
    alias: '研发部门',
    storage: '',
    source: '分配',
    type: 'GPU卡',
    gpuResource: '4x（NVIDIA-GPU-HBM2E-80GB）',
    used: '3 卡 / 4 卡',
    expireTime: '-',
  },
  {
    id: 6,
    tenant: 'test01',
    alias: '研发部门',
    storage: '',
    source: '购买',
    type: 'vGPU',
    gpuResource: '8x（vGPU-4C-16GB）',
    used: '5 卡 / 8 卡',
    expireTime: '2027-03-15',
  },
  // sx-telecom 租户 - 单条记录
  {
    id: 7,
    tenant: 'sx-telecom',
    alias: '陕西电信',
    storage: '80.00 GB / 300.00 GB',
    source: '分配',
    type: 'GPU卡',
    gpuResource: '16x（NVIDIA-GPU-HBM2E-80GB）',
    used: '12 卡 / 16 卡',
    expireTime: '-',
  },
  // moon 租户 - 多条记录
  {
    id: 8,
    tenant: 'moon',
    alias: 'Moon AI',
    storage: '30.00 GB / 100.00 GB',
    source: '分配',
    type: '整机分配',
    gpuResource: 'node205（8xNVIDIA-H100-HBM2E-80GB）',
    used: '1 节点 / 1 节点',
    expireTime: '-',
  },
  {
    id: 9,
    tenant: 'moon',
    alias: 'Moon AI',
    storage: '',
    source: '分配',
    type: 'MIG',
    gpuResource: '2x（MIG-2g.10GB）',
    used: '1 卡 / 2 卡',
    expireTime: '-',
  },
  // platform-operator 租户 - 单条记录
  {
    id: 10,
    tenant: 'platform-operator',
    alias: '平台运营',
    storage: '0.00 GB / 50.00 GB',
    source: '分配',
    type: 'GPU卡',
    gpuResource: '4x（NVIDIA-GPU-HBM2E-80GB）',
    used: '0 卡 / 4 卡',
    expireTime: '-',
  },
  // ai-research 租户 - 多条记录
  {
    id: 11,
    tenant: 'ai-research',
    alias: 'AI研究院',
    storage: '200.00 GB / 1000.00 GB',
    source: '分配',
    type: '整机分配',
    gpuResource: 'node210（8xNVIDIA-H100-HBM2E-80GB）',
    used: '1 节点 / 1 节点',
    expireTime: '-',
  },
  {
    id: 12,
    tenant: 'ai-research',
    alias: 'AI研究院',
    storage: '',
    source: '分配',
    type: '整机分配',
    gpuResource: 'node211（8xNVIDIA-H100-HBM2E-80GB）',
    used: '1 节点 / 1 节点',
    expireTime: '-',
  },
  {
    id: 13,
    tenant: 'ai-research',
    alias: 'AI研究院',
    storage: '',
    source: '购买',
    type: 'GPU卡',
    gpuResource: '2x（NVIDIA-GPU-HBM2E-80GB）',
    used: '2 卡 / 2 卡',
    expireTime: '2026-09-30',
  },
]);

// 计算合并行的数据
const dataSource = computed(() => {
  const result: any[] = [];
  const tenantMap = new Map<string, any[]>();

  // 按租户分组
  rawDataSource.value.forEach((item) => {
    const key = item.tenant;
    if (!tenantMap.has(key)) {
      tenantMap.set(key, []);
    }
    (tenantMap.get(key) as any).push(item);
  });

  // 为每条记录添加合并信息
  tenantMap.forEach((items, tenant) => {
    const tenantInfo = items[0];
    items.forEach((item, index) => {
      result.push({
        ...item,
        // 租户列合并信息
        tenantRowSpan: index === 0 ? items.length : 0,
        tenantInfo: {
          name: tenant,
          alias: tenantInfo.alias,
        },
        // 存储列合并信息（同一租户内，第一条有存储值的记录显示存储，其余为0）
        storageRowSpan: index === 0 && item.storage ? 1 : 0,
      });
    });
  });

  return result;
});

// 租户选项
const tenantOptions = computed(() => {
  const tenants = new Set(rawDataSource.value.map((item) => item.tenant));
  return [...tenants].map((t) => ({ label: t, value: t }));
});

// 根据筛选过滤数据
const filteredDataSource = computed(() => {
  if (!selectedTenant.value) {
    return dataSource.value;
  }
  return dataSource.value.filter((item) => item.tenant === selectedTenant.value);
});
</script>

<template>
  <ListPageLayout>
    <template #before>
      <!-- 资源统计卡片 -->
      <Card :bordered="false" class="shadow-sm mb-4">
        <Row :gutter="24">
          <Col :span="6">
            <div
              class="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100"
            >
              <div class="flex items-center gap-2 mb-3">
                <Layers class="size-5 text-blue-500" />
                <span class="text-sm text-gray-600">GPU总资源</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">
                vGPU/MIG已转换为等效卡数
              </div>
              <div class="text-3xl font-bold text-blue-600 mb-3">
                {{ resourceStats.total.value }}卡
              </div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span
                  >整卡:
                  <span class="font-semibold">{{
                    resourceStats.total.fullCard
                  }}</span></span
                >
                <span
                  >MIG:
                  <span class="font-semibold">{{
                    resourceStats.total.mig
                  }}</span></span
                >
                <span
                  >vGPU:
                  <span class="font-semibold">{{
                    resourceStats.total.vgpu
                  }}</span></span
                >
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div
              class="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100"
            >
              <div class="flex items-center gap-2 mb-3">
                <ArrowUpFromLine class="size-5 text-green-500" />
                <span class="text-sm text-gray-600">已分配(白名单)</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">包含逻辑GPU等效分配</div>
              <div class="text-3xl font-bold text-green-600 mb-3">
                {{ resourceStats.allocated.value }}卡
              </div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span
                  >整卡:
                  <span class="font-semibold">{{
                    resourceStats.allocated.fullCard
                  }}</span></span
                >
                <span
                  >MIG:
                  <span class="font-semibold">{{
                    resourceStats.allocated.mig
                  }}</span></span
                >
                <span
                  >vGPU:
                  <span class="font-semibold">{{
                    resourceStats.allocated.vgpu
                  }}</span></span
                >
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div
              class="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100"
            >
              <div class="flex items-center gap-2 mb-3">
                <HardDrive class="size-5 text-orange-500" />
                <span class="text-sm text-gray-600">已出售(用户购买)</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">包含逻辑GPU等效售出</div>
              <div class="text-3xl font-bold text-orange-600 mb-3">
                {{ resourceStats.sold.value }}卡
              </div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span
                  >整卡:
                  <span class="font-semibold">{{
                    resourceStats.sold.fullCard
                  }}</span></span
                >
                <span
                  >MIG:
                  <span class="font-semibold">{{
                    resourceStats.sold.mig
                  }}</span></span
                >
                <span
                  >vGPU:
                  <span class="font-semibold">{{
                    resourceStats.sold.vgpu
                  }}</span></span
                >
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div
              class="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100"
            >
              <div class="flex items-center gap-2 mb-3">
                <Database class="size-5 text-purple-500" />
                <span class="text-sm text-gray-600">剩余可用配额</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">
                {{ resourceStats.available.rate }}% 总体可用率
              </div>
              <div class="text-3xl font-bold text-purple-600 mb-3">
                {{ resourceStats.available.value }}卡
              </div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span
                  >整卡:
                  <span class="font-semibold">{{
                    resourceStats.available.fullCard
                  }}</span></span
                >
                <span
                  >MIG:
                  <span class="font-semibold">{{
                    resourceStats.available.mig
                  }}</span></span
                >
                <span
                  >vGPU:
                  <span class="font-semibold">{{
                    resourceStats.available.vgpu
                  }}</span></span
                >
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </template>

    <template #filters>
      <Select
        v-model:value="selectedTenant"
        allow-clear
        style="width: 200px"
        placeholder="请选择租户"
        :options="tenantOptions"
      />
    </template>

    <Table
      row-key="id"
      :data-source="filteredDataSource"
      :pagination="{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      }"
      :columns="columns"
      :scroll="{ x: 1200 }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Space>
            <Button
              type="link"
              size="small"
              @click="showNotify(`缩减资源 ${record.tenant}`)"
            >
              缩减资源
            </Button>
            <Popconfirm
              title="确认释放资源？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="showNotify(`释放资源 ${record.tenant}`)"
            >
              <Button type="link" size="small" danger> 释放资源 </Button>
            </Popconfirm>
          </Space>
        </template>
      </template>
    </Table>
  </ListPageLayout>
</template>
