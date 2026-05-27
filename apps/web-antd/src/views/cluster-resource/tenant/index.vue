<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Col, Divider, Popconfirm, Row, Select, Space, Table, message } from 'ant-design-vue';


const selectedTenant = ref<string>();

const resourceStats = ref({
  total: { value: 16, fullCard: 16, mig: 0, vgpu: 0 },
  allocated: { value: 14, fullCard: 14, mig: 0, vgpu: 0 },
  sold: { value: 0, fullCard: 0, mig: 0, vgpu: 0 },
  available: { value: 2, fullCard: 2, mig: 0, vgpu: 0, rate: 12.50 },
});

const columns = [
  { title: '租户/别名', dataIndex: 'tenant', width: 150 },
  { title: '存储', dataIndex: 'storage', width: 180 },
  { title: '配额来源', dataIndex: 'source', width: 100 },
  { title: '配额类型', dataIndex: 'type', width: 120 },
  { title: 'GPU资源名称', dataIndex: 'gpuResource', width: 250 },
  { title: '已用/总计', dataIndex: 'used', width: 120 },
  { title: '到期时间', dataIndex: 'expireTime', width: 120 },
  { title: '操作', dataIndex: 'action', width: 180, fixed: 'right' as const },
];

const dataSource = ref([
  { id: 1, tenant: 'test-0415', alias: '-', storage: '0.00 GB / 200.00 GB', source: '分配', type: 'GPU卡', gpuResource: '10x（NVIDIA-GPU-HBM2E-80GB）', used: '7 卡 / 10 卡', expireTime: '-' },
  { id: 2, tenant: 'test01', alias: '-', storage: '5.00 GB / 5.00 GB', source: '分配', type: '整机分配', gpuResource: 'node201（NVIDIA-H100-HBM2E-80GB）', used: '0 节点 / 1 节点', expireTime: '-' },
  { id: 3, tenant: 'test01', alias: '-', storage: '-', source: '分配', type: 'GPU卡', gpuResource: '4x（NVIDIA-GPU-HBM2E-80GB）', used: '9 卡 / 4 卡', expireTime: '-' },
  { id: 4, tenant: 'test01', alias: '-', storage: '-', source: '购买', type: '-', gpuResource: '-', used: '0 卡 / 0 卡', expireTime: '-' },
]);

const notify = (text: string) => message.success(text);
</script>

<template>
  <Page auto-content-height>
    <div class="p-4 space-y-4">
      <!-- 资源统计卡片 -->
      <Card :bordered="false" class="shadow-sm">
        <Row :gutter="24">
          <Col :span="6">
            <div class="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-100">
              <div class="flex items-center gap-2 mb-3">
                <Layers class="size-5 text-blue-500" />
                <span class="text-sm text-gray-600">GPU总资源</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">vGPU/MIG已转换为等效卡数</div>
              <div class="text-3xl font-bold text-blue-600 mb-3">{{ resourceStats.total.value }}卡</div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span>整卡: <span class="font-semibold">{{ resourceStats.total.fullCard }}</span></span>
                <span>MIG: <span class="font-semibold">{{ resourceStats.total.mig }}</span></span>
                <span>vGPU: <span class="font-semibold">{{ resourceStats.total.vgpu }}</span></span>
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div class="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-100">
              <div class="flex items-center gap-2 mb-3">
                <ArrowUpFromLine class="size-5 text-green-500" />
                <span class="text-sm text-gray-600">已分配(白名单)</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">包含逻辑GPU等效分配</div>
              <div class="text-3xl font-bold text-green-600 mb-3">{{ resourceStats.allocated.value }}卡</div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span>整卡: <span class="font-semibold">{{ resourceStats.allocated.fullCard }}</span></span>
                <span>MIG: <span class="font-semibold">{{ resourceStats.allocated.mig }}</span></span>
                <span>vGPU: <span class="font-semibold">{{ resourceStats.allocated.vgpu }}</span></span>
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div class="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100">
              <div class="flex items-center gap-2 mb-3">
                <HardDrive class="size-5 text-orange-500" />
                <span class="text-sm text-gray-600">已出售(用户购买)</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">包含逻辑GPU等效售出</div>
              <div class="text-3xl font-bold text-orange-600 mb-3">{{ resourceStats.sold.value }}卡</div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span>整卡: <span class="font-semibold">{{ resourceStats.sold.fullCard }}</span></span>
                <span>MIG: <span class="font-semibold">{{ resourceStats.sold.mig }}</span></span>
                <span>vGPU: <span class="font-semibold">{{ resourceStats.sold.vgpu }}</span></span>
              </div>
            </div>
          </Col>
          <Col :span="6">
            <div class="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-100">
              <div class="flex items-center gap-2 mb-3">
                <Database class="size-5 text-purple-500" />
                <span class="text-sm text-gray-600">剩余可用配额</span>
              </div>
              <div class="text-xs text-gray-400 mb-2">{{ resourceStats.available.rate }}% 总体可用率</div>
              <div class="text-3xl font-bold text-purple-600 mb-3">{{ resourceStats.available.value }}卡</div>
              <Divider class="my-2" />
              <div class="flex justify-between text-xs">
                <span>整卡: <span class="font-semibold">{{ resourceStats.available.fullCard }}</span></span>
                <span>MIG: <span class="font-semibold">{{ resourceStats.available.mig }}</span></span>
                <span>vGPU: <span class="font-semibold">{{ resourceStats.available.vgpu }}</span></span>
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      <!-- 租户资源列表 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="mb-4">
          <Select
            v-model:value="selectedTenant"
            allow-clear
            style="width: 200px"
            placeholder="请选择租户"
            :options="[{ label: 'test-0415', value: 'test-0415' }, { label: 'test01', value: 'test01' }]"
          />
        </div>
        <Table
          row-key="id"
          :data-source="dataSource"
          :pagination="{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }"
          :columns="columns"
          :scroll="{ x: 1200 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'tenant'">
              <div>
                <span class="font-medium text-gray-800">{{ record.tenant }}</span>
                <span class="text-gray-400 ml-1">{{ record.alias }}</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <Button type="link" size="small" @click="notify(`缩减资源 ${record.tenant}`)">
                  缩减资源
                </Button>
                <Popconfirm
                  title="确认释放资源？"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="notify(`释放资源 ${record.tenant}`)"
                >
                  <Button type="link" size="small" danger>
                    释放资源
                  </Button>
                </Popconfirm>
              </Space>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
