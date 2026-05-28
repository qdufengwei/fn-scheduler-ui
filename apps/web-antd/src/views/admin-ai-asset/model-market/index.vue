<script setup lang="ts">
import { computed, ref } from 'vue';
import { Page } from '@vben/common-ui';
import { createIconifyIcon, RotateCw, Search } from '@vben/icons';
import {
  Button,
  Input,
  Pagination,
  Select,
  Tag,
  message,
  Popconfirm,
  Drawer,
} from 'ant-design-vue';

const SlidersHorizontal = createIconifyIcon('lucide:sliders-horizontal');
const ShieldAlert = createIconifyIcon('lucide:shield-alert');
const BarChart3 = createIconifyIcon('lucide:bar-chart-3');
const Settings = createIconifyIcon('lucide:settings');
const Power = createIconifyIcon('lucide:power');
const Globe = createIconifyIcon('lucide:globe');
const Cpu = createIconifyIcon('lucide:cpu');
const Zap = createIconifyIcon('lucide:zap');
const Activity = createIconifyIcon('lucide:activity');
const Database = createIconifyIcon('lucide:database');


interface ModelService {
  id: string;
  category: string;
  createTime: string;
  inputPrice: number;
  modelName: string;
  outputPrice: number;
  serviceName: string;
  tenant: string;
  totalCalls: number;
  user: string;
  status: 'active' | 'suspended';
}

const tenantId = ref<string>();
const userId = ref<string>();
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(8); // 每页 8 个卡片，正好 2x4 或 4x2 完美布局
const selectedCategory = ref<string>();
const sortField = ref<string | undefined>('totalCalls'); // 默认按调用量排序，避免首屏空态
const sortDirection = ref<string | undefined>('desc');

const tenantOptions = [
  { label: '算网运营平台', value: 'platform' },
  { label: '成都智算中心', value: 'cd-aic' },
  { label: '深圳视觉实验室', value: 'sz-vision' },
];

const userOptions = [
  { label: 'admin', value: 'admin' },
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
];

const categoryOptions = ['文本生成', '代码生成', '视觉识别', '语音处理'];
const sortFieldOptions = [
  { label: '输入价格', value: 'inputPrice' },
  { label: '输出价格', value: 'outputPrice' },
  { label: '创建时间', value: 'createTime' },
  { label: '调用次数', value: 'totalCalls' },
];
const sortDirectionOptions = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' },
];

const modelServices = ref<ModelService[]>([
  {
    id: 'svc-001',
    category: '文本生成',
    createTime: '2026-05-20 10:24:00',
    inputPrice: 0.002,
    modelName: 'DeepSeek-R1-Chat',
    outputPrice: 0.008,
    serviceName: 'deepseek-r1-inference',
    tenant: 'platform',
    totalCalls: 128362,
    user: 'admin',
    status: 'active',
  },
  {
    id: 'svc-002',
    category: '代码生成',
    createTime: '2026-05-19 15:12:00',
    inputPrice: 0.0035,
    modelName: 'Qwen2.5-Coder-7B',
    outputPrice: 0.012,
    serviceName: 'qwen-coder-assistant',
    tenant: 'cd-aic',
    totalCalls: 86420,
    user: 'test01',
    status: 'active',
  },
  {
    id: 'svc-003',
    category: '视觉识别',
    createTime: '2026-05-17 09:35:00',
    inputPrice: 0.0012,
    modelName: 'Qwen2.5-VL-7B-Instruct',
    outputPrice: 0.0048,
    serviceName: 'vision-inspection-vl',
    tenant: 'sz-vision',
    totalCalls: 61044,
    user: 'test02',
    status: 'active',
  },
  {
    id: 'svc-004',
    category: '语音处理',
    createTime: '2026-05-16 18:40:00',
    inputPrice: 0.001,
    modelName: 'Whisper-Large-V3',
    outputPrice: 0.0035,
    serviceName: 'speech-transcribe-whisper',
    tenant: 'platform',
    totalCalls: 43190,
    user: 'admin',
    status: 'active',
  },
  {
    id: 'svc-005',
    category: '文本生成',
    createTime: '2026-05-14 11:08:00',
    inputPrice: 0.015,
    modelName: 'GPT-4o-Mini',
    outputPrice: 0.045,
    serviceName: 'gpt-4o-mini-service',
    tenant: 'cd-aic',
    totalCalls: 39720,
    user: 'test01',
    status: 'active',
  },
  {
    id: 'svc-006',
    category: '代码生成',
    createTime: '2026-05-11 14:22:00',
    inputPrice: 0.0028,
    modelName: 'Llama-3.1-405B-Instruct',
    outputPrice: 0.0096,
    serviceName: 'llama-405b-heavy',
    tenant: 'sz-vision',
    totalCalls: 27560,
    user: 'test02',
    status: 'suspended',
  },
  {
    id: 'svc-007',
    category: '视觉识别',
    createTime: '2026-05-08 16:30:00',
    inputPrice: 0.05,
    modelName: 'Stable-Diffusion-3-Medium',
    outputPrice: 0.05,
    serviceName: 'sd3-image-generation',
    tenant: 'platform',
    totalCalls: 18450,
    user: 'admin',
    status: 'active',
  },
  {
    id: 'svc-008',
    category: '语音处理',
    createTime: '2026-05-05 09:15:00',
    inputPrice: 0.0015,
    modelName: 'SenseVoice-Large-Speed',
    outputPrice: 0.004,
    serviceName: 'sensevoice-speed-asr',
    tenant: 'cd-aic',
    totalCalls: 12530,
    user: 'test01',
    status: 'active',
  },
]);

// 极简中性 Morandi 风格色彩映射
const avatarColorMap: Record<string, string> = {
  文本生成: 'bg-blue-50/70 border border-blue-150 text-blue-600',
  代码生成: 'bg-teal-50/70 border border-teal-150 text-teal-600',
  视觉识别: 'bg-purple-50/70 border border-purple-150 text-purple-600',
  语音处理: 'bg-orange-50/70 border border-orange-150 text-orange-600',
};



const filteredServices = computed(() => {
  let result = [...modelServices.value];

  if (tenantId.value) {
    result = result.filter((item) => item.tenant === tenantId.value);
  }
  if (userId.value) {
    result = result.filter((item) => item.user === userId.value);
  }
  if (selectedCategory.value) {
    result = result.filter((item) => item.category === selectedCategory.value);
  }
  if (keyword.value.trim()) {
    const searchText = keyword.value.trim().toLowerCase();
    result = result.filter(
      (item) =>
        item.modelName.toLowerCase().includes(searchText) ||
        item.serviceName.toLowerCase().includes(searchText),
    );
  }

  if (sortField.value && sortDirection.value) {
    const field = sortField.value as keyof ModelService;
    result.sort((a, b) => {
      const left = a[field];
      const right = b[field];
      if (left === right) return 0;
      const order = left > right ? 1 : -1;
      return sortDirection.value === 'asc' ? order : -order;
    });
  }

  return result;
});

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredServices.value.slice(start, start + pageSize.value);
});

const paginationTotal = computed(() => filteredServices.value.length);

function handleSearch() {
  currentPage.value = 1;
}

function handleReset() {
  tenantId.value = undefined;
  userId.value = undefined;
  keyword.value = '';
  selectedCategory.value = undefined;
  sortField.value = 'totalCalls';
  sortDirection.value = 'desc';
  currentPage.value = 1;
}

function selectCategory(value: string) {
  selectedCategory.value = selectedCategory.value === value ? undefined : value;
  handleSearch();
}

function selectSortField(value: string) {
  sortField.value = sortField.value === value ? undefined : value;
  handleSearch();
}

function selectSortDirection(value: string) {
  sortDirection.value = sortDirection.value === value ? undefined : value;
  handleSearch();
}

function toggleServiceStatus(service: ModelService) {
  if (service.status === 'active') {
    service.status = 'suspended';
    message.warning(`服务 ${service.serviceName} 已下架`);
  } else {
    service.status = 'active';
    message.success(`服务 ${service.serviceName} 已上架`);
  }
}

function showConfigMessage(serviceName: string) {
  message.success(`正在打开服务 ${serviceName} 的资源配置选项...`);
}

function showMonitorMessage(serviceName: string) {
  message.success(`正在调取服务 ${serviceName} 的调用统计大屏...`);
}

// 管理员端服务运营详情抽屉相关数据
const detailVisible = ref(false);
const selectedService = ref<ModelService | null>(null);

interface ModelMeta {
  provider: string;
  contextWindow: string;
  maxOutput: string;
  description: string;
  deploymentNode: string;
  rateLimit: string;
  gpuInstance: string;
  concurrency: number;
}

const mockModelMetaMap: Record<string, ModelMeta> = {
  '文本生成': {
    provider: 'DeepSeek / Meta / Google',
    contextWindow: '128K Tokens',
    maxOutput: '8,192 Tokens',
    description: '此服务依托混合架构，部署于成都智算中心 GPU 节点群。主要用于大规模多任务语言理解（MMLU）、复杂逻辑推理及长文理解。',
    deploymentNode: '成都智算中心 (GPU 节点群)',
    rateLimit: '120 req/s',
    gpuInstance: 'NVIDIA-A100-SXM4-80GB × 8',
    concurrency: 150,
  },
  '代码生成': {
    provider: 'DeepSeek / Meta / Qwen',
    contextWindow: '64K Tokens',
    maxOutput: '4,096 Tokens',
    description: '用于代码生成与补全服务，采用 TensorRT-LLM 优化吞吐，针对高并发补全环境进行了长效调度调优。',
    deploymentNode: '成都智算中心 (GPU 节点群)',
    rateLimit: '80 req/s',
    gpuInstance: 'NVIDIA-A30-24GB × 4',
    concurrency: 80,
  },
  '视觉识别': {
    provider: 'OpenAI / Google / Meta',
    contextWindow: '32K Tokens',
    maxOutput: '4,096 Tokens',
    description: '多模态图像/视觉识别算力服务。结合了 OCR 提取和复杂图表结构化分析，适用于多行业多模态视觉资产解析。',
    deploymentNode: '深圳视觉实验室',
    rateLimit: '50 req/s',
    gpuInstance: 'NVIDIA-RTX-4090 × 8',
    concurrency: 50,
  },
  '语音处理': {
    provider: 'OpenAI / Bilibili / Alibaba',
    contextWindow: '16K Tokens',
    maxOutput: '2,048 Tokens',
    description: '大模型高保真语音识别与拟真合成服务。支持多说话人角色声学分离及流式音频转写吞吐。',
    deploymentNode: '深圳视觉实验室',
    rateLimit: '60 req/s',
    gpuInstance: 'NVIDIA-A10G-24GB × 2',
    concurrency: 60,
  },
};

const activeMeta = computed<ModelMeta>(() => {
  if (!selectedService.value) {
    return {
      provider: '开源社区',
      contextWindow: '32K Tokens',
      maxOutput: '4,096 Tokens',
      description: '通用模型服务。',
      deploymentNode: '默认调度节点',
      rateLimit: '50 req/s',
      gpuInstance: 'NVIDIA-A10G × 2',
      concurrency: 50,
    };
  }
  return mockModelMetaMap[selectedService.value.category] ?? {
    provider: '开源社区',
    contextWindow: '32K Tokens',
    maxOutput: '4,096 Tokens',
    description: '通用模型服务。',
    deploymentNode: '默认调度节点',
    rateLimit: '50 req/s',
    gpuInstance: 'NVIDIA-A10G × 2',
    concurrency: 50,
  };
});

// 各租户调用量分布 Mock 数据
interface TenantShare {
  tenantName: string;
  calls: string;
  revenue: string;
  percentage: number;
}

const mockTenantShares = computed<TenantShare[]>(() => {
  if (!selectedService.value) return [];
  const total = selectedService.value.totalCalls;
  return [
    {
      tenantName: '算网运营平台',
      calls: (total * 0.65).toFixed(0),
      revenue: `¥${(selectedService.value.inputPrice * total * 0.65).toFixed(2)}`,
      percentage: 65,
    },
    {
      tenantName: '深圳视觉实验室',
      calls: (total * 0.23).toFixed(0),
      revenue: `¥${(selectedService.value.inputPrice * total * 0.23).toFixed(2)}`,
      percentage: 23,
    },
    {
      tenantName: '成都智算中心',
      calls: (total * 0.12).toFixed(0),
      revenue: `¥${(selectedService.value.inputPrice * total * 0.12).toFixed(2)}`,
      percentage: 12,
    },
  ];
});

function showDetail(service: ModelService) {
  selectedService.value = service;
  detailVisible.value = true;
}
</script>

<template>
  <Page auto-content-height>
    <!-- 顶层外壳，确保无 Transition Transition 报错问题 -->
    <div class="flex flex-col md:flex-row w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[calc(100vh-148px)]">
      
      <!-- 左侧筛选控制面板 -->
      <aside class="w-full md:w-60 bg-gray-50 border-r border-gray-150 p-5 flex flex-col gap-6 shrink-0">
        <div class="flex items-center justify-between border-b border-gray-200 pb-3">
          <div class="flex items-center gap-2 text-gray-800 font-bold">
            <SlidersHorizontal class="size-4.5 text-blue-500" />
            <span>筛选模型</span>
          </div>
          <Button type="link" size="small" class="flex items-center gap-1 p-0 font-medium text-blue-500 hover:text-blue-600" @click="handleReset">
            <template #icon><RotateCw class="size-3.5" /></template>
            重置
          </Button>
        </div>

        <!-- 分类选择区 -->
        <div class="flex flex-col gap-3">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">分类</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in categoryOptions"
              :key="item"
              class="h-8.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
              :class="selectedCategory === item 
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'"
              @click="selectCategory(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <!-- 排序字段区 -->
        <div class="flex flex-col gap-3">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">排序字段</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in sortFieldOptions"
              :key="item.value"
              class="h-8.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
              :class="sortField === item.value 
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'"
              @click="selectSortField(item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <!-- 排序方向区 -->
        <div class="flex flex-col gap-3">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">排序方向</div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in sortDirectionOptions"
              :key="item.value"
              class="h-8.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
              :class="sortDirection === item.value 
                ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'"
              @click="selectSortDirection(item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </aside>

      <!-- 右侧主展示区 -->
      <section class="flex-1 flex flex-col bg-white">
        <!-- 头部搜索表单 -->
        <div class="flex items-center justify-between gap-4 px-6 py-4.5 border-b border-gray-100 bg-white shrink-0">
          <div class="text-sm font-bold text-gray-800 shrink-0">模型服务列表</div>
          <div class="flex items-center gap-2.5">
            <Select
              v-model:value="tenantId"
              :options="tenantOptions"
              allow-clear
              class="w-36"
              placeholder="请选择租户"
              @change="handleSearch"
            />
            <Select
              v-model:value="userId"
              :options="userOptions"
              allow-clear
              class="w-32"
              placeholder="请选择用户"
              @change="handleSearch"
            />
            <Input
              v-model:value="keyword"
              allow-clear
              class="w-44"
              placeholder="搜索服务/模型"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <Search class="size-3.5 text-gray-400 mr-1" />
              </template>
            </Input>
          </div>
        </div>

        <!-- 列表展现 -->
        <div class="flex-1 p-6">
          <div v-if="paginatedServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            
            <!-- 单个服务卡片 -->
            <div
              v-for="service in paginatedServices"
              :key="service.id"
              class="group relative bg-white rounded-xl border border-gray-150 p-5 hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 flex flex-col justify-between h-[180px]"
              :class="service.status === 'suspended' ? 'bg-gray-50/50' : ''"
            >
              <!-- 下架状态蒙层提示 -->
              <div v-if="service.status === 'suspended'" class="absolute inset-0 bg-gray-100/50 backdrop-blur-[0.5px] rounded-xl pointer-events-none flex items-center justify-center z-20">
                <span class="bg-gray-800/90 text-white text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                  <ShieldAlert class="size-3" />
                  已下架
                </span>
              </div>

              <div>
                <!-- 头部：极简头像、标题、服务分类 (点击可查看详情) -->
                <div class="flex items-start justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200" @click="showDetail(service)">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div 
                      class="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      :class="avatarColorMap[service.category] ?? 'bg-gray-50 border border-gray-200 text-gray-600'"
                    >
                      {{ service.modelName.substring(0, 2).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <div class="truncate text-sm font-semibold text-gray-900 leading-tight">
                        {{ service.serviceName }}
                      </div>
                      <div class="mt-0.5 flex items-center">
                        <span class="text-[10px] text-gray-400 font-mono">
                          {{ service.modelName }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tag class="m-0 rounded-md text-[10px] bg-gray-50 border-gray-200 text-gray-500 px-2 shrink-0">
                    {{ service.category }}
                  </Tag>
                </div>

                <!-- 价格条目展示区 (极简空白对齐设计，无虚线，无实线) -->
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-400">输入价格 / K Token</span>
                    <span class="text-xs font-medium text-gray-700 mt-1 font-mono">¥{{ service.inputPrice.toFixed(4) }}</span>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] text-gray-400">输出价格 / K Token</span>
                    <span class="text-xs font-medium text-gray-700 mt-1 font-mono">¥{{ service.outputPrice.toFixed(4) }}</span>
                  </div>
                </div>
              </div>

              <!-- 底部调用量和动作栏 (极简冷淡圆点) -->
              <div class="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
                  <span>调用 <span class="font-semibold text-gray-700 font-mono">{{ service.totalCalls >= 10000 ? (service.totalCalls / 10000).toFixed(1) + 'W' : service.totalCalls }}</span> 次</span>
                </div>
                
                <div class="flex items-center gap-1">
                  <Button type="text" size="small" class="flex items-center justify-center p-0 h-6.5 w-6.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100/80 rounded-md transition-colors" title="流量监控" @click="showMonitorMessage(service.serviceName)">
                    <template #icon><BarChart3 class="size-3.5" /></template>
                  </Button>
                  <Button type="text" size="small" class="flex items-center justify-center p-0 h-6.5 w-6.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100/80 rounded-md transition-colors" title="配置选项" @click="showConfigMessage(service.serviceName)">
                    <template #icon><Settings class="size-3.5" /></template>
                  </Button>
                  <Popconfirm
                    :title="`确定要${service.status === 'active' ? '下架下线' : '上架启用'}该模型服务吗？`"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="toggleServiceStatus(service)"
                  >
                    <Button type="text" danger size="small" class="flex items-center justify-center p-0 h-6.5 w-6.5 text-gray-400 hover:text-red-500 hover:bg-red-50/80 rounded-md transition-colors">
                      <template #icon><Power class="size-3.5" /></template>
                    </Button>
                  </Popconfirm>
                </div>
              </div>
            </div>

          </div>

          <!-- 空数据状态 -->
          <div v-else class="min-h-[380px] flex flex-col items-center justify-center text-center">
            <ShieldAlert class="size-16 text-gray-300 mb-4" />
            <h3 class="text-base font-bold text-gray-700 m-0">暂无符合条件的模型服务</h3>
            <p class="text-xs text-gray-400 mt-1.5 max-w-xs">当前没有相关记录，增加服务或重置筛选条件后在此处查看数据。</p>
            <Button type="primary" size="small" class="mt-4 px-4" @click="handleReset">重置筛选</Button>
          </div>
        </div>

        <!-- 底部大分页区 -->
        <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-end">
          <Pagination
            v-model:current="currentPage"
            v-model:page-size="pageSize"
            :page-size-options="['8', '16', '32', '64']"
            :show-quick-jumper="true"
            :show-size-changer="true"
            :total="paginationTotal"
          />
        </div>
      </section>

    </div>

    <!-- 极细致莫兰迪风模型服务运营详情抽屉 -->
    <Drawer
      v-model:open="detailVisible"
      :title="null"
      width="580"
      placement="right"
      :closable="false"
      class="fn-model-detail-drawer"
    >
      <div v-if="selectedService" class="flex flex-col h-full gap-6 text-sm text-gray-750 p-1">
        <!-- 头部标题区 -->
        <div class="flex items-start justify-between pb-4.5 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div 
              class="h-11 w-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
              :class="avatarColorMap[selectedService.category] ?? 'bg-gray-50 border border-gray-200 text-gray-600'"
            >
              {{ selectedService.modelName.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <div class="text-base font-bold text-gray-900 leading-tight">
                {{ selectedService.serviceName }}
              </div>
              <div class="mt-1 text-[11px] font-mono text-gray-400">
                {{ selectedService.modelName }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <Tag class="m-0 rounded-md text-[10px] bg-gray-50 border-gray-200 text-gray-500 px-2 shrink-0">
              {{ selectedService.category }}
            </Tag>
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100/60 text-[10px] font-medium shrink-0">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              在线运行
            </span>
          </div>
        </div>

        <!-- 运营指标网格 -->
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">运营调度指标 / Scheduling Specs</div>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                <Globe class="size-3" />
                限流速率 (Rate Limit)
              </div>
              <div class="mt-1 text-xs font-semibold text-gray-800 font-mono">{{ activeMeta.rateLimit }}</div>
            </div>
            <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                <Cpu class="size-3" />
                并发阈值 (Concurrency)
              </div>
              <div class="mt-1 text-xs font-semibold text-gray-800 font-mono">{{ activeMeta.concurrency }} req</div>
            </div>
            <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                <Zap class="size-3" />
                上下文长度 (Context)
              </div>
              <div class="mt-1 text-xs font-semibold text-gray-800 font-mono">{{ activeMeta.contextWindow }}</div>
            </div>
          </div>
        </div>

        <!-- 部署集群与算力规格 -->
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">部署集群与硬件规格 / Deployment & Hardware</div>
          <div class="bg-gray-50/40 border border-gray-100 rounded-xl p-4 flex flex-col gap-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <Database class="size-3.5" />
                <span>部署节点/集群</span>
              </div>
              <span class="text-xs font-medium text-gray-800">{{ activeMeta.deploymentNode }}</span>
            </div>
            <div class="h-px bg-gray-200/60"></div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-xs text-gray-400">
                <Activity class="size-3.5" />
                <span>算力硬件规格</span>
              </div>
              <span class="text-xs font-mono font-medium text-gray-800">{{ activeMeta.gpuInstance }}</span>
            </div>
          </div>
        </div>

        <!-- 价格明细 -->
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">资费与单价 / Service Pricing</div>
          <div class="bg-gray-50/40 border border-gray-100 rounded-xl p-4 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-[10px] text-gray-400">输入价格 / K Token</span>
              <span class="text-sm font-semibold text-gray-800 mt-1 font-mono">¥{{ selectedService.inputPrice.toFixed(4) }}</span>
            </div>
            <div class="h-6 w-px bg-gray-200"></div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] text-gray-400">输出价格 / K Token</span>
              <span class="text-sm font-semibold text-gray-800 mt-1 font-mono">¥{{ selectedService.outputPrice.toFixed(4) }}</span>
            </div>
          </div>
        </div>

        <!-- 租户调用比例分担 -->
        <div class="flex flex-col gap-2 flex-1 min-h-0">
          <div class="text-xs font-semibold text-gray-400 uppercase tracking-wider">租户消费与调用分布 / Tenant Allocation Details</div>
          <div class="border border-gray-100 rounded-xl overflow-hidden flex-1 flex flex-col min-h-0 bg-white">
            <div class="bg-gray-50/70 border-b border-gray-100 px-4 py-2 flex items-center justify-between text-[11px] text-gray-400 uppercase font-semibold shrink-0">
              <div class="w-1/3">租户名称</div>
              <div class="w-1/3 text-right">调用量 (次)</div>
              <div class="w-1/3 text-right">产生资费</div>
            </div>
            <div class="overflow-auto divide-y divide-gray-100 flex-1">
              <div 
                v-for="tenantShare in mockTenantShares" 
                :key="tenantShare.tenantName"
                class="px-4 py-2.5 flex items-center justify-between text-xs text-gray-700 hover:bg-gray-50/50"
              >
                <div class="w-1/3 font-medium text-gray-800 truncate" :title="tenantShare.tenantName">
                  {{ tenantShare.tenantName }}
                </div>
                <div class="w-1/3 text-right font-mono">
                  {{ Number(tenantShare.calls).toLocaleString() }}
                  <span class="text-[10px] text-gray-400 ml-1">({{ tenantShare.percentage }}%)</span>
                </div>
                <div class="w-1/3 text-right font-mono text-emerald-600 font-semibold">
                  {{ tenantShare.revenue }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 关闭抽屉按钮 -->
        <div class="mt-auto pt-3 border-t border-gray-100 flex justify-end shrink-0">
          <Button class="rounded-lg text-xs" @click="detailVisible = false">关闭窗口</Button>
        </div>
      </div>
    </Drawer>
  </Page>
</template>
