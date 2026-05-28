<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { computed, onMounted, ref } from 'vue';
import {
  Button,
  Card,
  Dropdown,
  Form,
  FormItem,
  Input,
  InputNumber,
  Menu,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';

import { getNodeList } from '#/api/node';
import { showNotify, showWarning, showError } from '#/utils/notify';

interface NodeRow {
  allocatedGpu: number;
  allocationType: string;
  createTime: string;
  gpuModel: string;
  id: number;
  ipAddress: string;
  isOnline: boolean;
  name: string;
  onlineTime: string;
  price: number;
  region: string;
  status: '就绪' | '未就绪' | '维护中';
  totalGpu: number;
}

const loading = ref(false);
const rows = ref<NodeRow[]>([]);
const selectedRowKeys = ref<number[]>([]);

const filters = ref({
  allocationType: [] as string[],
  ipAddress: '',
  isOnline: undefined as string | undefined,
  name: '',
  status: undefined as string | undefined,
});

const allocationTypeOptions = [
  '整机分配',
  '弹性分配',
  'MIG分配',
  'vGPU分配',
  '弹性购买',
  'MIG购买',
  'vGPU购买',
  '未出售',
];

const statusColor: Record<string, string> = {
  就绪: 'success',
  未就绪: 'default',
  维护中: 'warning',
};

const allocationTagColor = (value: string) => {
  if (value.includes('MIG')) return 'purple';
  if (value.includes('vGPU')) return 'blue';
  if (value.includes('弹性')) return 'green';
  if (value === '整机分配') return 'gold';
  return 'default';
};

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const byName =
      !filters.value.name ||
      r.name.toLowerCase().includes(filters.value.name.toLowerCase()) ||
      r.ipAddress.includes(filters.value.name);
    const byType =
      filters.value.allocationType.length === 0 ||
      filters.value.allocationType.includes(r.allocationType);
    const byStatus = !filters.value.status || r.status === filters.value.status;
    const byIp =
      !filters.value.ipAddress || r.ipAddress.includes(filters.value.ipAddress);
    const byOnline =
      !filters.value.isOnline ||
      (filters.value.isOnline === '是' ? r.isOnline : !r.isOnline);
    return byName && byType && byStatus && byIp && byOnline;
  });
});

const resetFilters = () => {
  filters.value = {
    allocationType: [],
    ipAddress: '',
    isOnline: undefined,
    name: '',
    status: undefined,
  };
};

const batchOnline = () => {
  if (selectedRowKeys.value.length === 0) {
    showWarning('请先选择节点');
    return;
  }
  rows.value.forEach((r) => {
    if (selectedRowKeys.value.includes(r.id) && r.status === '就绪') {
      r.isOnline = true;
      r.onlineTime = new Date().toLocaleString('zh-CN');
    }
  });
  showNotify(`已批量上架 ${selectedRowKeys.value.length} 个节点`);
};

const batchOffline = () => {
  if (selectedRowKeys.value.length === 0) {
    showWarning('请先选择节点');
    return;
  }
  rows.value.forEach((r) => {
    if (selectedRowKeys.value.includes(r.id)) {
      r.isOnline = false;
      r.onlineTime = '-';
    }
  });
  showNotify(`已批量下架 ${selectedRowKeys.value.length} 个节点`);
};

const distributionForm = ref({
  cpu: 0,
  memory: 0,
  mode: '整机分配',
  nodeId: undefined as number | undefined,
  sharedStorage: 0,
  spec: '',
  tenant: undefined as string | undefined,
});
const currentNode = ref<NodeRow | null>(null);

const maintenanceAction = ref<'排空' | '恢复'>('排空');

const migAction = ref<'配置MIG' | '关闭MIG'>('配置MIG');

const canConfigMig = (r: NodeRow) =>
  (r.gpuModel.includes('A100') || r.gpuModel.includes('H100')) &&
  (r.allocationType === '整机分配' || r.allocationType === '未出售');

const canCloseMig = (r: NodeRow) => r.allocationType === 'MIG分配';

const canDistribute = (r: NodeRow) =>
  r.isOnline && r.status === '就绪' && r.allocatedGpu < r.totalGpu;

const onShelf = (r: NodeRow) => {
  if (r.status !== '就绪') {
    showWarning('节点状态非就绪，无法上架');
    return;
  }
  r.isOnline = true;
  r.onlineTime = new Date().toLocaleString('zh-CN');
  showNotify(`节点 ${r.name} 上架成功`);
};

const offShelf = (r: NodeRow) => {
  if (r.status === '维护中') {
    showWarning('维护中节点无法直接下架');
    return;
  }
  r.isOnline = false;
  r.onlineTime = '-';
  showNotify(`节点 ${r.name} 已下架`);
};

const openDistribution = (r: NodeRow) => {
  currentNode.value = r;
  distributionForm.value = {
    cpu: 0,
    memory: 0,
    mode: '整机分配',
    nodeId: r.id,
    sharedStorage: 0,
    spec: r.totalGpu > 0 ? `${r.totalGpu}x${r.gpuModel}` : '',
    tenant: undefined,
  };
  distributionDrawerApi.open();
};

const handleDistributionClick = () => {
  const node =
    filteredRows.value.length > 0
      ? filteredRows.value[0]
      : rows.value.length > 0
        ? rows.value[0]
        : null;
  if (node) {
    openDistribution(node);
  }
};

const submitDistribution = () => {
  const node = rows.value.find((n) => n.id === distributionForm.value.nodeId);
  if (!node) return;
  node.allocationType = distributionForm.value.mode;
  node.allocatedGpu = Math.min(
    node.totalGpu,
    Math.max(1, node.allocatedGpu + 1),
  );
  showNotify(`已完成节点 ${node.name} 的资源分配（原型）`);
  distributionDrawerApi.close();
};

const openMaintenance = (r: NodeRow) => {
  currentNode.value = r;
  maintenanceAction.value = r.status === '维护中' ? '恢复' : '排空';
  maintenanceDrawerApi.open();
};

const handleMaintenanceClick = () => {
  const node =
    filteredRows.value.length > 0
      ? filteredRows.value[0]
      : rows.value.length > 0
        ? rows.value[0]
        : null;
  if (node) {
    openMaintenance(node);
  }
};

const confirmMaintenance = () => {
  if (!currentNode.value) return;
  currentNode.value.status =
    maintenanceAction.value === '排空' ? '维护中' : '就绪';
  showNotify(`节点 ${currentNode.value.name} 已${maintenanceAction.value}`);
  maintenanceDrawerApi.close();
};

const openMig = (r: NodeRow, action: '关闭MIG' | '配置MIG') => {
  currentNode.value = r;
  migAction.value = action;
  migDrawerApi.open();
};

const confirmMig = () => {
  if (!currentNode.value) return;
  currentNode.value.allocationType =
    migAction.value === '配置MIG' ? 'MIG分配' : '整机分配';
  showNotify(`节点 ${currentNode.value.name} 已${migAction.value}`);
  migDrawerApi.close();
};

const releaseResource = (r: NodeRow) => {
  r.allocatedGpu = 0;
  r.allocationType = '未出售';
  r.isOnline = false;
  r.onlineTime = '-';
  showNotify(`节点 ${r.name} 资源已释放`);
};

const onMoreAction = (record: NodeRow, action: string) => {
  if (action === 'distribute' && canDistribute(record))
    openDistribution(record);
  if (action === 'maintain') openMaintenance(record);
  if (action === 'migConfig' && canConfigMig(record))
    openMig(record, '配置MIG');
  if (action === 'migClose' && canCloseMig(record)) openMig(record, '关闭MIG');
  if (action === 'release') releaseResource(record);
};

const columns = [
  { title: '名称', dataIndex: 'name', key: 'name', width: 130 },
  { title: '区域', dataIndex: 'region', key: 'region', width: 80 },
  { title: 'GPU型号', dataIndex: 'gpuModel', key: 'gpuModel', width: 190 },
  { title: '已分配GPU', key: 'allocatedGpu', width: 110 },
  { title: '总GPU', dataIndex: 'totalGpu', key: 'totalGpu', width: 90 },
  {
    title: '分配类型',
    dataIndex: 'allocationType',
    key: 'allocationType',
    width: 120,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: 'IP地址', dataIndex: 'ipAddress', key: 'ipAddress', width: 120 },
  { title: '是否上架', key: 'isOnline', width: 90 },
  { title: '上架时间', dataIndex: 'onlineTime', key: 'onlineTime', width: 160 },
  { title: '单价', key: 'price', width: 110 },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const },
];

async function fetchData() {
  loading.value = true;
  try {
    const res: any = await getNodeList();
    const payload = res?.data ?? res ?? {};
    rows.value = (payload.list ?? []) as NodeRow[];
  } catch {
    showError('节点数据加载失败，请稍后重试');
    rows.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchData);

const [DistributionDrawer, distributionDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[460px]!',
  title: '资源分配',
});

const [MaintenanceDrawer, maintenanceDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[380px]!',
  title: '节点维护',
});

const [MigDrawer, migDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[420px]!',
  title: '',
});
</script>

<template>
  <div class="p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input
          v-model:value="filters.name"
          style="width: 220px"
          placeholder="名称/IP模糊搜索"
          allow-clear
        />
        <Select
          v-model:value="filters.allocationType"
          mode="multiple"
          style="width: 260px"
          placeholder="分配类型"
          :options="allocationTypeOptions.map((x) => ({ label: x, value: x }))"
        />
        <Select
          v-model:value="filters.status"
          style="width: 130px"
          allow-clear
          placeholder="状态"
          :options="
            ['就绪', '未就绪', '维护中'].map((x) => ({ label: x, value: x }))
          "
        />
        <Input
          v-model:value="filters.ipAddress"
          style="width: 170px"
          placeholder="IP地址"
          allow-clear
        />
        <Select
          v-model:value="filters.isOnline"
          style="width: 120px"
          allow-clear
          placeholder="是否上架"
          :options="['是', '否'].map((x) => ({ label: x, value: x }))"
        />
        <Button @click="fetchData">筛选</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>

    <Card>
      <div class="mb-3 flex items-center justify-between">
        <Space wrap>
          <Button type="primary" @click="handleDistributionClick"
            >资源分配</Button
          >
          <Button @click="batchOnline">批量上架</Button>
          <Button @click="batchOffline">批量下架</Button>
          <Button @click="handleMaintenanceClick">维护</Button>
        </Space>
      </div>
      <Table
        row-key="id"
        :columns="columns"
        :data-source="filteredRows"
        :loading="loading"
        :row-selection="{
          selectedRowKeys,
          onChange: (keys: any[]) => (selectedRowKeys = keys as number[]),
        }"
        :pagination="{ pageSize: 10, showSizeChanger: true }"
        :scroll="{ x: 2200 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'allocatedGpu'"
            >{{ (record as NodeRow).allocatedGpu }} 卡</template
          >
          <template v-else-if="column.key === 'allocationType'">
            <Tag
              :color="allocationTagColor((record as NodeRow).allocationType)"
              >{{ (record as NodeRow).allocationType }}</Tag
            >
          </template>
          <template v-else-if="column.key === 'status'">
            <Tag :color="statusColor[(record as NodeRow).status]">{{
              (record as NodeRow).status
            }}</Tag>
          </template>
          <template v-else-if="column.key === 'isOnline'">{{
            (record as NodeRow).isOnline ? '是' : '否'
          }}</template>
          <template v-else-if="column.key === 'price'"
            >¥{{ Number((record as NodeRow).price || 0).toFixed(2) }} /
            时</template
          >
          <template v-else-if="column.key === 'action'">
            <Space :size="0">
              <Button
                type="link"
                size="small"
                :disabled="
                  (record as NodeRow).isOnline ||
                  (record as NodeRow).status !== '就绪'
                "
                @click="onShelf(record as NodeRow)"
                >上架</Button
              >
              <Popconfirm
                title="下架后该节点将无法被分配，确认下架吗？"
                @confirm="offShelf(record as NodeRow)"
              >
                <Button
                  type="link"
                  size="small"
                  :disabled="!(record as NodeRow).isOnline"
                  >下架</Button
                >
              </Popconfirm>
              <Dropdown trigger="click">
                <Button type="link" size="small">...</Button>
                <template #overlay>
                  <Menu
                    @click="
                      ({ key }) => onMoreAction(record as NodeRow, String(key))
                    "
                  >
                    <Menu.Item
                      key="distribute"
                      :disabled="!canDistribute(record as NodeRow)"
                      >资源分配</Menu.Item
                    >
                    <Menu.Item key="maintain">维护</Menu.Item>
                    <Menu.Item
                      key="migConfig"
                      :disabled="!canConfigMig(record as NodeRow)"
                      >MIG配置</Menu.Item
                    >
                    <Menu.Item
                      key="migClose"
                      :disabled="!canCloseMig(record as NodeRow)"
                      >关闭MIG</Menu.Item
                    >
                    <Menu.Item key="release">资源释放</Menu.Item>
                  </Menu>
                </template>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <DistributionDrawer>
      <Form layout="vertical" :model="distributionForm">
        <FormItem label="租户" required>
          <Select
            v-model:value="distributionForm.tenant"
            placeholder="请选择租户"
          >
            <Select.Option value="tenant-a">租户A</Select.Option>
            <Select.Option value="tenant-b" disabled
              >租户B（未分配管理员）</Select.Option
            >
            <Select.Option value="tenant-c">租户C</Select.Option>
          </Select>
        </FormItem>
        <FormItem label="分配模式" required>
          <Select
            v-model:value="distributionForm.mode"
            :options="
              ['整机分配', '弹性分配', 'MIG实例分配', 'vGPU实例分配'].map(
                (x) => ({ label: x, value: x }),
              )
            "
          />
        </FormItem>
        <FormItem label="资源规格" required>
          <Input v-model:value="distributionForm.spec" />
        </FormItem>
        <FormItem label="CPU(核)"
          ><InputNumber
            v-model:value="distributionForm.cpu"
            :min="0"
            style="width: 100%"
        /></FormItem>
        <FormItem label="内存(GiB)"
          ><InputNumber
            v-model:value="distributionForm.memory"
            :min="0"
            style="width: 100%"
        /></FormItem>
        <FormItem label="包括共享存储(GB)"
          ><InputNumber
            v-model:value="distributionForm.sharedStorage"
            :min="0"
            style="width: 100%"
        /></FormItem>
        <FormItem label="节点" required>
          <Select
            v-model:value="distributionForm.nodeId"
            :options="rows.map((x) => ({ label: x.name, value: x.id }))"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button @click="distributionDrawerApi.close()">取消</Button>
          <Button type="primary" @click="submitDistribution">确认分配</Button>
        </Space>
      </template>
    </DistributionDrawer>

    <MaintenanceDrawer>
      <Form layout="vertical">
        <FormItem label="节点">{{ currentNode?.name }}</FormItem>
        <FormItem label="操作">
          <Select
            v-model:value="maintenanceAction"
            :options="[
              { label: '排空', value: '排空' },
              { label: '恢复', value: '恢复' },
            ]"
          />
        </FormItem>
      </Form>
      <template #footer>
        <Space>
          <Button @click="maintenanceDrawerApi.close()">取消</Button>
          <Button type="primary" @click="confirmMaintenance">确认</Button>
        </Space>
      </template>
    </MaintenanceDrawer>

    <MigDrawer>
      <template #title>{{ migAction }}</template>
      <div class="text-sm text-gray-600">
        <p>节点：{{ currentNode?.name }}</p>
        <p class="mt-2">
          {{
            migAction === '配置MIG'
              ? '将按预设规格创建MIG实例并切换分配类型。'
              : '将销毁MIG实例并恢复整机模式。'
          }}
        </p>
      </div>
      <template #footer>
        <Space>
          <Button @click="migDrawerApi.close()">取消</Button>
          <Button type="primary" @click="confirmMig">确认</Button>
        </Space>
      </template>
    </MigDrawer>
  </div>
</template>
