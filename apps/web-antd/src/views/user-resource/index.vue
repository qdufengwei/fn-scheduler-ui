<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Button,
  Drawer,
  Form,
  FormItem,
  InputNumber,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'ant-design-vue';
import { createIconifyIcon } from '@vben/icons';
import ListPageLayout from '#/components/business/list-page-layout.vue';

// Lucide 图标引用
const Trash2 = createIconifyIcon('lucide:trash-2');
const Plus = createIconifyIcon('lucide:plus');
const ArrowLeft = createIconifyIcon('lucide:arrow-left');

// 路由与过滤相关 state
const selectedSpec = ref<string | undefined>(undefined);
const selectedStatus = ref<string | undefined>(undefined);
const selectedCycle = ref<string | undefined>(undefined);

// 资源规格与状态的可选项
const specOptions = [
  { label: 'NVIDIA-GPU-HBM2E-80GB', value: 'NVIDIA-GPU-HBM2E-80GB' },
  { label: 'NVIDIA-H100-HBM2E-80GB', value: 'NVIDIA-H100-HBM2E-80GB' },
];

const statusOptions = [
  { label: '整机分配', value: '整机分配' },
  { label: '弹性分配', value: '弹性分配' },
  { label: 'MIG分配', value: 'MIG分配' },
  { label: 'vGPU分配', value: 'vGPU分配' },
];

const cycleOptions = [
  { label: '按需（小时）', value: '按需（小时）' },
  { label: '包月', value: '包月' },
  { label: '包年', value: '包年' },
];

// 数据接口定义
interface NodeResource {
  id: string;
  migConfig: string;
}

interface UserResource {
  id: string;
  spec: string;
  status: string;
  usage: string;
  gpuCount: number;
  cycle: string;
  createdAt: string;
  endedAt: string;
  price: string;
  nodes: NodeResource[];
}

// Mock 数据源
const resourceRows = ref<UserResource[]>([
  {
    id: 'res-01',
    spec: 'NVIDIA-GPU-HBM2E-80GB',
    status: '弹性分配',
    usage: '1 卡',
    gpuCount: 1,
    cycle: '按需（小时）',
    createdAt: '2026-04-28 06:44:37',
    endedAt: '-',
    price: '¥0.00 / 时',
    nodes: [
      { id: 'node201 - 0', migConfig: 'Whole GPU' },
    ],
  },
  {
    id: 'res-02',
    spec: 'NVIDIA-GPU-HBM2E-80GB',
    status: '弹性分配',
    usage: '3 卡',
    gpuCount: 3,
    cycle: '按需（小时）',
    createdAt: '2026-04-28 02:12:43',
    endedAt: '-',
    price: '¥0.00 / 时',
    nodes: [
      { id: 'node201 - 0', migConfig: 'Whole GPU' },
      { id: 'node201 - 1', migConfig: 'Whole GPU' },
      { id: 'node201 - 2', migConfig: 'Whole GPU' },
    ],
  },
  {
    id: 'res-03',
    spec: 'NVIDIA-H100-HBM2E-80GB',
    status: '整机分配',
    usage: '8 卡',
    gpuCount: 8,
    cycle: '按需（小时）',
    createdAt: '2026-03-25 12:45:43',
    endedAt: '-',
    price: '¥0.00 / 时',
    nodes: [
      { id: 'node201 - 0', migConfig: 'Whole GPU' },
      { id: 'node201 - 1', migConfig: 'Whole GPU' },
      { id: 'node201 - 2', migConfig: 'Whole GPU' },
      { id: 'node201 - 3', migConfig: 'Whole GPU' },
      { id: 'node201 - 4', migConfig: 'Whole GPU' },
      { id: 'node201 - 5', migConfig: 'Whole GPU' },
      { id: 'node201 - 6', migConfig: 'Whole GPU' },
      { id: 'node201 - 7', migConfig: 'Whole GPU' },
    ],
  },
]);

// 过滤计算
const filteredRows = computed(() => {
  return resourceRows.value.filter((row) => {
    const matchSpec = !selectedSpec.value || row.spec === selectedSpec.value;
    const matchStatus = !selectedStatus.value || row.status === selectedStatus.value;
    const matchCycle = !selectedCycle.value || row.cycle === selectedCycle.value;
    return matchSpec && matchStatus && matchCycle;
  });
});

const handleReset = () => {
  selectedSpec.value = undefined;
  selectedStatus.value = undefined;
  selectedCycle.value = undefined;
};

// 表格列定义
const columns = [
  { title: '资源规格', dataIndex: 'spec', key: 'spec' },
  { title: '资源状态', dataIndex: 'status', key: 'status', width: 140 },
  { title: '资源用量', dataIndex: 'usage', key: 'usage', width: 120 },
  { title: 'GPU数量', dataIndex: 'gpuCount', key: 'gpuCount', width: 120 },
  { title: '购买周期', dataIndex: 'cycle', key: 'cycle', width: 140 },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  { title: '结束时间', dataIndex: 'endedAt', key: 'endedAt' },
  { title: '单价', dataIndex: 'price', key: 'price' },
  { title: '操作', dataIndex: 'action', key: 'action', width: 180 },
];

const innerColumns = [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'MIG配置', dataIndex: 'migConfig', key: 'migConfig' },
  { title: '操作', dataIndex: 'action', key: 'action', width: 180 },
];

// MIG Drawer 相关配置与 State
const isDrawerVisible = ref(false);
const activeInstance = ref<UserResource | null>(null);
const activeNode = ref<NodeResource | null>(null);

const migType = ref<'template' | 'custom'>('template');
const selectedTemplate = ref<string>('Whole GPU');

interface CustomMigItem {
  id: number;
  compute: number;
  memory: number;
}
const customConfigs = ref<CustomMigItem[]>([
  { id: Date.now(), compute: 0, memory: 0 },
]);

const addCustomConfig = () => {
  customConfigs.value.push({
    id: Date.now() + Math.random(),
    compute: 0,
    memory: 0,
  });
};

const removeCustomConfig = (index: number) => {
  customConfigs.value.splice(index, 1);
};

// 计算已分配指标
const allocatedCompute = computed(() => {
  if (migType.value === 'template') {
    if (selectedTemplate.value === 'Whole GPU') return 7;
    if (selectedTemplate.value === '1g.10gb') return 1;
    if (selectedTemplate.value === '2g.20gb') return 2;
    if (selectedTemplate.value === '3g.40gb') return 3;
    if (selectedTemplate.value === '4g.40gb') return 4;
    return 0;
  } else {
    return customConfigs.value.reduce(
      (acc, curr) => acc + (Number(curr.compute) || 0),
      0,
    );
  }
});

const allocatedMemory = computed(() => {
  if (migType.value === 'template') {
    if (selectedTemplate.value === 'Whole GPU') return 80;
    if (selectedTemplate.value === '1g.10gb') return 10;
    if (selectedTemplate.value === '2g.20gb') return 20;
    if (selectedTemplate.value === '3g.40gb') return 40;
    if (selectedTemplate.value === '4g.40gb') return 40;
    return 0;
  } else {
    return customConfigs.value.reduce(
      (acc, curr) => acc + (Number(curr.memory) || 0),
      0,
    );
  }
});

const isOverLimit = computed(() => {
  return allocatedCompute.value > 7 || allocatedMemory.value > 80;
});

// 打开 MIG 配置弹窗
const openMigDrawer = (record: any, node?: any) => {
  activeInstance.value = record;
  activeNode.value = node || null;

  // 恢复之前配置的默认值
  const currentConfig = node ? node.migConfig : record.nodes[0]?.migConfig || 'Whole GPU';
  if (['Whole GPU', '1g.10gb', '2g.20gb', '3g.40gb', '4g.40gb'].includes(currentConfig)) {
    migType.value = 'template';
    selectedTemplate.value = currentConfig;
  } else {
    migType.value = 'custom';
    // 解析如 "1g.10gb, 2g.20gb" 格式
    const parsed = currentConfig.split(',').map((part: any, idx: number) => {
      const match = part.trim().match(/(\d+)g\.(\d+)gb/);
      return {
        id: Date.now() + idx + Math.random(),
        compute: match ? parseInt(match[1], 10) : 0,
        memory: match ? parseInt(match[2], 10) : 0,
      };
    });
    customConfigs.value = parsed.length ? parsed : [{ id: Date.now(), compute: 0, memory: 0 }];
  }

  isDrawerVisible.value = true;
};

// 关闭 MIG 配置
const closeMigConfig = (record: any, node?: any) => {
  if (node) {
    node.migConfig = 'Whole GPU';
    message.success(`已成功关闭并重置节点 ${node.id} 的 MIG 配置`);
  } else {
    record.nodes.forEach((n: any) => {
      n.migConfig = 'Whole GPU';
    });
    message.success(`已成功关闭该实例所有节点的 MIG 配置`);
  }
};

// 保存配置
const handleSaveMig = () => {
  if (isOverLimit.value) {
    message.error('分配的资源总数不能超过硬件上限 (7 g / 80 GiB)');
    return;
  }

  let finalConfig = '';
  if (migType.value === 'template') {
    finalConfig = selectedTemplate.value;
  } else {
    finalConfig =
      customConfigs.value
        .map((c) => `${c.compute}g.${c.memory}gb`)
        .join(', ') || 'Whole GPU';
  }

  if (activeNode.value && activeInstance.value) {
    // 仅修改单个物理 GPU 卡的配置
    const targetInst = resourceRows.value.find((r) => r.id === activeInstance.value!.id);
    if (targetInst) {
      const targetNode = targetInst.nodes.find((n) => n.id === activeNode.value!.id);
      if (targetNode) {
        targetNode.migConfig = finalConfig;
      }
    }
  } else if (activeInstance.value) {
    // 修改该实例包含的所有物理 GPU 卡配置
    const targetInst = resourceRows.value.find((r) => r.id === activeInstance.value!.id);
    if (targetInst) {
      targetInst.nodes.forEach((n) => {
        n.migConfig = finalConfig;
      });
    }
  }

  message.success('MIG 配置配置成功');
  isDrawerVisible.value = false;
};
</script>

<template>
  <div class="min-h-full">
    <ListPageLayout list-title="我的资源">
      <!-- 顶部筛选区域 -->
      <template #filters>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-4">
            <Select
              v-model:value="selectedSpec"
              allow-clear
              placeholder="资源规格"
              style="width: 220px"
              :options="specOptions"
            />
            <Select
              v-model:value="selectedStatus"
              allow-clear
              placeholder="资源状态"
              style="width: 160px"
              :options="statusOptions"
            />
            <Select
              v-model:value="selectedCycle"
              allow-clear
              placeholder="购买周期"
              style="width: 160px"
              :options="cycleOptions"
            />
          </div>
          <Space>
            <Button type="primary" @click="() => {}">筛选</Button>
            <Button @click="handleReset">重置</Button>
          </Space>
        </div>
      </template>

      <!-- 核心表格渲染，支持折叠行 -->
      <Table
        row-key="id"
        :data-source="filteredRows"
        :columns="columns"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }"
        class="border-t border-slate-100"
      >
        <!-- 子列表：GPU 节点折叠展开详情 -->
        <template #expandedRowRender="{ record }">
          <div class="bg-slate-50/50 p-4 rounded-lg border border-slate-100 shadow-inner">
            <Table
              row-key="id"
              :columns="innerColumns"
              :data-source="record.nodes"
              :pagination="false"
              size="small"
              class="bg-white"
            >
              <template #bodyCell="{ column: innerCol, record: innerRec }">
                <template v-if="innerCol.key === 'action'">
                  <Space :size="16">
                    <a
                      class="text-blue-600 hover:text-blue-500 font-medium"
                      @click="openMigDrawer(record, innerRec)"
                      >MIG配置</a
                    >
                    <Popconfirm
                      title="确定要关闭该节点的 MIG 分配吗？配置将重置为 Whole GPU。"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="closeMigConfig(record, innerRec)"
                    >
                      <a class="text-slate-400 hover:text-rose-500 font-medium"
                        >关闭MIG</a
                      >
                    </Popconfirm>
                  </Space>
                </template>
              </template>
            </Table>
          </div>
        </template>

        <!-- 主表字段自定义渲染 -->
        <template #bodyCell="{ column, record }">
          <!-- 资源状态莫兰迪彩色 Tag 呈现 -->
          <template v-if="column.key === 'status'">
            <Tag
              v-if="record.status === '整机分配'"
              class="px-2.5 py-0.5 rounded-full bg-slate-100/70 border-slate-200 text-slate-600 font-medium"
              >整机分配</Tag
            >
            <Tag
              v-else-if="record.status === '弹性分配'"
              class="px-2.5 py-0.5 rounded-full bg-blue-50 border-blue-100 text-blue-500 font-medium"
              >弹性分配</Tag
            >
            <Tag
              v-else-if="record.status === 'MIG分配'"
              class="px-2.5 py-0.5 rounded-full bg-purple-50 border-purple-100 text-purple-500 font-medium"
              >MIG分配</Tag
            >
            <Tag
              v-else-if="record.status === 'vGPU分配'"
              class="px-2.5 py-0.5 rounded-full bg-emerald-50 border-emerald-100 text-emerald-500 font-medium"
              >vGPU分配</Tag
            >
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <Space :size="16">
              <a
                class="text-blue-600 hover:text-blue-500 font-medium"
                @click="openMigDrawer(record)"
                >MIG配置</a
              >
              <Popconfirm
                title="确定要关闭该实例所有节点的 MIG 分配吗？配置将统一重置为 Whole GPU。"
                ok-text="确定"
                cancel-text="取消"
                @confirm="closeMigConfig(record)"
              >
                <a class="text-slate-400 hover:text-rose-500 font-medium"
                  >关闭MIG</a
                >
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </ListPageLayout>

    <!-- MIG 配置高级控制右侧 Drawer -->
    <Drawer
      v-model:open="isDrawerVisible"
      width="640"
      placement="right"
      :closable="false"
      destroy-on-close
    >
      <!-- 自定义美化头部 -->
      <template #title>
        <div class="flex items-center gap-3">
          <Button
            type="text"
            shape="circle"
            class="flex items-center justify-center hover:bg-slate-100"
            @click="isDrawerVisible = false"
          >
            <ArrowLeft class="h-4 w-4 text-slate-600" />
          </Button>
          <span class="text-lg font-semibold text-slate-800">MIG配置</span>
        </div>
      </template>

      <!-- 抽屉主要表单区域 -->
      <div class="h-full flex flex-col justify-between p-4 space-y-6">
        <div class="space-y-6">
          <div class="border-b border-slate-100 pb-3">
            <span class="text-sm font-bold text-slate-700">基础信息</span>
          </div>

          <Form layout="vertical">
            <!-- MIG类型单选按钮 -->
            <FormItem label="MIG类型" required>
              <Radio.Group
                v-model:value="migType"
                button-style="solid"
                class="w-full flex"
              >
                <Radio.Button value="template" class="flex-1 text-center"
                  >MIG模版</Radio.Button
                >
                <Radio.Button value="custom" class="flex-1 text-center"
                  >自定义MIG</Radio.Button
                >
              </Radio.Group>
            </FormItem>

            <!-- 模板选择模式 -->
            <FormItem
              v-if="migType === 'template'"
              label="MIG模版"
              required
            >
              <Select
                v-model:value="selectedTemplate"
                placeholder="请选择MIG模版"
                :options="[
                  { label: 'Whole GPU (7g.80gb)', value: 'Whole GPU' },
                  { label: '1g.10gb (1计算单元 10GB显存)', value: '1g.10gb' },
                  { label: '2g.20gb (2计算单元 20GB显存)', value: '2g.20gb' },
                  { label: '3g.40gb (3计算单元 40GB显存)', value: '3g.40gb' },
                  { label: '4g.40gb (4计算单元 40GB显存)', value: '4g.40gb' },
                ]"
              />
            </FormItem>

            <!-- 自定义MIG配置列表模式 -->
            <div v-else class="space-y-4">
              <label class="text-xs font-semibold text-slate-500"
                >自定义MIG *</label
              >
              <div
                class="rounded-xl border border-slate-200 bg-slate-50/30 p-4 space-y-3"
              >
                <div class="text-xs font-bold text-slate-400 mb-1">MIG配置</div>

                <div
                  v-for="(config, index) in customConfigs"
                  :key="config.id"
                  class="flex items-center gap-3"
                >
                  <InputNumber
                    v-model:value="config.compute"
                    :min="0"
                    :max="7"
                    placeholder="0"
                    style="width: 120px"
                    addon-after="g"
                  />
                  <span class="text-slate-400">—</span>
                  <InputNumber
                    v-model:value="config.memory"
                    :min="0"
                    :max="80"
                    placeholder="0"
                    style="width: 140px"
                    addon-after="GiB"
                  />
                  <Button
                    type="text"
                    danger
                    shape="circle"
                    class="flex items-center justify-center hover:bg-rose-50"
                    @click="removeCustomConfig(index)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="dashed"
                  block
                  class="flex items-center justify-center gap-1.5 mt-2 text-slate-500 hover:text-blue-500 border-dashed"
                  @click="addCustomConfig"
                >
                  <Plus class="h-4 w-4" />
                  + MIG配置
                </Button>
              </div>
            </div>
          </Form>
        </div>

        <!-- 底部数据统计与动作区域 -->
        <div class="space-y-6">
          <!-- 统计信息框 -->
          <div class="rounded-xl bg-slate-50 border border-slate-100 p-5 space-y-4">
            <div class="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-medium">计算单元</span>
                <span class="text-slate-800 font-semibold">7 g</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-medium">已分配计算单元</span>
                <span
                  class="font-bold font-mono"
                  :class="allocatedCompute > 7 ? 'text-rose-500' : 'text-slate-800'"
                  >{{ allocatedCompute }} g</span
                >
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-medium">显存单元</span>
                <span class="text-slate-800 font-semibold">80 GiB</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-500 font-medium">已分配显存单元</span>
                <span
                  class="font-bold font-mono"
                  :class="allocatedMemory > 80 ? 'text-rose-500' : 'text-slate-800'"
                  >{{ allocatedMemory }} GiB</span
                >
              </div>
            </div>
            <!-- 超限警告 -->
            <div
              v-if="isOverLimit"
              class="text-xs text-rose-500 font-medium bg-rose-50 border border-rose-100 rounded-lg p-2.5 text-center"
            >
              ⚠️ 分配规格已超出单张卡的最大硬件上限 (7 g / 80 GiB)
            </div>
          </div>

          <!-- Drawer 动作按钮 -->
          <div class="flex gap-4 border-t border-slate-100 pt-4">
            <Button class="flex-1" @click="isDrawerVisible = false"
              >取消</Button
            >
            <Button
              type="primary"
              class="flex-1"
              :disabled="isOverLimit"
              @click="handleSaveMig"
              >确定</Button
            >
          </div>
        </div>
      </div>
    </Drawer>
  </div>
</template>
