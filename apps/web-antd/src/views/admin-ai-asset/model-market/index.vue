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
} from 'ant-design-vue';

const SlidersHorizontal = createIconifyIcon('lucide:sliders-horizontal');
const ShieldAlert = createIconifyIcon('lucide:shield-alert');
const BarChart3 = createIconifyIcon('lucide:bar-chart-3');
const Settings = createIconifyIcon('lucide:settings');
const Power = createIconifyIcon('lucide:power');

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

// 渐变色彩映射，体现高级感
const avatarGradientMap: Record<string, string> = {
  文本生成: 'from-blue-500 to-indigo-600',
  代码生成: 'from-emerald-400 to-teal-600',
  视觉识别: 'from-purple-500 to-pink-600',
  语音处理: 'from-amber-400 to-orange-600',
};

const categoryTagColorMap: Record<string, string> = {
  文本生成: 'processing',
  代码生成: 'success',
  视觉识别: 'warning',
  语音处理: 'error',
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
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-5 border-b border-gray-100 bg-white">
          <h2 class="text-lg font-bold text-gray-900 m-0">模型服务市场</h2>
          <div class="flex flex-wrap items-center gap-3">
            <Select
              v-model:value="tenantId"
              :options="tenantOptions"
              allow-clear
              class="w-48"
              placeholder="请选择租户"
              @change="handleSearch"
            />
            <Select
              v-model:value="userId"
              :options="userOptions"
              allow-clear
              class="w-48"
              placeholder="请选择用户"
              @change="handleSearch"
            />
            <Input
              v-model:value="keyword"
              allow-clear
              class="w-56"
              placeholder="搜索服务名/模型名"
              @press-enter="handleSearch"
            >
              <template #prefix>
                <Search class="size-4 text-gray-400 mr-1.5" />
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
              class="relative bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[210px]"
              :class="service.status === 'suspended' ? 'border-gray-200 bg-gray-50/50' : 'border-gray-150'"
            >
              <!-- 下架状态蒙层提示 -->
              <div v-if="service.status === 'suspended'" class="absolute inset-0 bg-gray-100/40 rounded-xl pointer-events-none flex items-center justify-center">
                <span class="bg-gray-800/80 text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                  <ShieldAlert class="size-3" />
                  已下架暂停调用
                </span>
              </div>

              <div>
                <!-- 头部：渐变图标、标题、服务分类 -->
                <div class="flex items-start justify-between gap-2.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <div 
                      class="h-10 w-10 rounded-lg flex items-center justify-center text-white font-black text-sm bg-gradient-to-br shadow-sm"
                      :class="avatarGradientMap[service.category] ?? 'from-gray-400 to-gray-600'"
                    >
                      {{ service.modelName.substring(0, 2).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <div class="truncate text-sm font-bold text-gray-800 leading-tight">
                        {{ service.serviceName }}
                      </div>
                      <div class="mt-1 flex items-center gap-1.5">
                        <span class="text-[11px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                          {{ service.modelName }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tag :color="categoryTagColorMap[service.category] ?? 'default'" class="m-0 rounded-full text-[10px] scale-95 shrink-0 px-2.5">
                    {{ service.category }}
                  </Tag>
                </div>

                <!-- 价格条目展示区 -->
                <div class="mt-4 grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                  <div>
                    <div class="text-[10px] text-gray-400 leading-none">输入价格 (K Tokens)</div>
                    <div class="text-xs font-semibold text-gray-800 mt-1">¥{{ service.inputPrice.toFixed(4) }}</div>
                  </div>
                  <div>
                    <div class="text-[10px] text-gray-400 leading-none">输出价格 (K Tokens)</div>
                    <div class="text-xs font-semibold text-gray-800 mt-1">¥{{ service.outputPrice.toFixed(4) }}</div>
                  </div>
                </div>
              </div>

              <!-- 底部调用量和动作栏 -->
              <div class="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                <div class="text-[11px] text-gray-400 flex items-center gap-1.5">
                  累计调用
                  <span class="font-bold text-gray-800 font-mono">
                    {{ service.totalCalls >= 10000 ? (service.totalCalls / 10000).toFixed(1) + 'W' : service.totalCalls }}
                  </span>
                  次
                </div>
                <div class="flex items-center gap-2">
                  <Button type="text" size="small" class="flex items-center justify-center p-0.5 h-6 w-6 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded" title="流量监控" @click="showMonitorMessage(service.serviceName)">
                    <template #icon><BarChart3 class="size-4" /></template>
                  </Button>
                  <Button type="text" size="small" class="flex items-center justify-center p-0.5 h-6 w-6 text-gray-400 hover:text-blue-500 hover:bg-gray-100 rounded" title="配置选项" @click="showConfigMessage(service.serviceName)">
                    <template #icon><Settings class="size-4" /></template>
                  </Button>
                  <Popconfirm
                    :title="`确定要${service.status === 'active' ? '下架下线' : '上架启用'}该模型服务吗？`"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="toggleServiceStatus(service)"
                  >
                    <Button type="text" danger size="small" class="flex items-center justify-center p-0.5 h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded">
                      <template #icon><Power class="size-4" /></template>
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
  </Page>
</template>
