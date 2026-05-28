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
} from 'ant-design-vue';

const SlidersHorizontal = createIconifyIcon('lucide:sliders-horizontal');
const ShieldAlert = createIconifyIcon('lucide:shield-alert');
const Terminal = createIconifyIcon('lucide:terminal');
const Key = createIconifyIcon('lucide:key');
const Copy = createIconifyIcon('lucide:copy');

interface ModelService {
  id: string;
  category: string;
  createTime: string;
  inputPrice: number;
  modelName: string;
  outputPrice: number;
  serviceName: string;
  totalCalls: number;
  user: string;
}

const userId = ref<string>();
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(8); // 每页 8 个卡片，正好 2x4 或 4x2 完美布局
const selectedCategory = ref<string>();
const sortField = ref<string | undefined>('totalCalls'); // 默认按调用量排序，避免首屏空态
const sortDirection = ref<string | undefined>('desc');

const userOptions = [
  { label: 'test01', value: 'test01' },
  { label: 'test02', value: 'test02' },
  { label: 'platform', value: 'platform' },
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
    id: 'svc-101',
    category: '文本生成',
    createTime: '2026-05-20 10:24:00',
    inputPrice: 0.002,
    modelName: 'Qwen2.5-72B-Instruct',
    outputPrice: 0.008,
    serviceName: 'qwen-chat-enterprise',
    totalCalls: 128362,
    user: 'platform',
  },
  {
    id: 'svc-102',
    category: '代码生成',
    createTime: '2026-05-19 15:12:00',
    inputPrice: 0.0035,
    modelName: 'DeepSeek-Coder-V2',
    outputPrice: 0.012,
    serviceName: 'deepseek-code-assistant',
    totalCalls: 86420,
    user: 'test01',
  },
  {
    id: 'svc-103',
    category: '视觉识别',
    createTime: '2026-05-17 09:35:00',
    inputPrice: 0.0012,
    modelName: 'Qwen2.5-VL-32B',
    outputPrice: 0.0048,
    serviceName: 'vision-inspection-vl',
    totalCalls: 61044,
    user: 'test02',
  },
  {
    id: 'svc-104',
    category: '语音处理',
    createTime: '2026-05-16 18:40:00',
    inputPrice: 0.001,
    modelName: 'SenseVoice-Large',
    outputPrice: 0.0035,
    serviceName: 'speech-transcribe-cn',
    totalCalls: 43190,
    user: 'platform',
  },
  {
    id: 'svc-105',
    category: '文本生成',
    createTime: '2026-05-14 11:08:00',
    inputPrice: 0.0018,
    modelName: 'Baichuan4-Turbo',
    outputPrice: 0.0072,
    serviceName: 'baichuan-knowledge-chat',
    totalCalls: 39720,
    user: 'test01',
  },
  {
    id: 'svc-106',
    category: '代码生成',
    createTime: '2026-05-11 14:22:00',
    inputPrice: 0.0028,
    modelName: 'CodeLlama-34B-Instruct',
    outputPrice: 0.0096,
    serviceName: 'codellama-review-api',
    totalCalls: 27560,
    user: 'test02',
  },
  {
    id: 'svc-107',
    category: '视觉识别',
    createTime: '2026-05-08 16:30:00',
    inputPrice: 0.04,
    modelName: 'Stable-Diffusion-3-Medium',
    outputPrice: 0.04,
    serviceName: 'stable-diffusion-image',
    totalCalls: 18450,
    user: 'platform',
  },
  {
    id: 'svc-108',
    category: '语音处理',
    createTime: '2026-05-05 09:15:00',
    inputPrice: 0.0015,
    modelName: 'Whisper-Large-V3',
    outputPrice: 0.004,
    serviceName: 'whisper-voice-to-text',
    totalCalls: 12530,
    user: 'test01',
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

function startDebug(serviceName: string) {
  message.success(`已为您开启 ${serviceName} 的云端 API 交互式调试面板！`);
}

function generateApiKey(serviceName: string) {
  message.success(`成功为服务 ${serviceName} 生成临时调试 API-Key！已自动保存至您的凭证管理。`);
}

function copyEndpoint(serviceName: string) {
  navigator.clipboard.writeText(`https://api.fn-compute.net/v1/models/${serviceName}/chat/completions`);
  message.success(`已复制 ${serviceName} 的服务 Endpoint！`);
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
        <!-- 头部搜索表单（租户端仅有用户选择与搜索框） -->
        <div class="flex items-center justify-between gap-4 px-6 py-4.5 border-b border-gray-100 bg-white shrink-0">
          <div class="text-sm font-bold text-gray-800 shrink-0">模型服务列表</div>
          <div class="flex items-center gap-2.5">
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
              class="group relative bg-white rounded-2xl border border-gray-150 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.05)] hover:border-blue-200/80 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-[215px]"
            >
              <div>
                <!-- 头部：渐变图标（发光呼吸灯效果）、标题、服务分类 -->
                <div class="flex items-start justify-between gap-2.5">
                  <div class="flex items-center gap-3 min-w-0">
                    <div 
                      class="h-10.5 w-10.5 rounded-xl flex items-center justify-center text-white font-extrabold text-xs bg-gradient-to-br shadow-sm relative shrink-0"
                      :class="avatarGradientMap[service.category] ?? 'from-gray-400 to-gray-600'"
                    >
                      <span class="absolute inset-0 rounded-xl bg-inherit blur-md opacity-25 group-hover:opacity-50 transition-opacity duration-300"></span>
                      <span class="relative z-10">{{ service.modelName.substring(0, 2).toUpperCase() }}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="truncate text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200">
                        {{ service.serviceName }}
                      </div>
                      <div class="mt-0.5 flex items-center gap-1.5">
                        <span class="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded truncate max-w-[125px]">
                          {{ service.modelName }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tag :color="categoryTagColorMap[service.category] ?? 'default'" class="m-0 rounded-full text-[10px] scale-95 shrink-0 px-2.5 border-0 bg-opacity-10">
                    {{ service.category }}
                  </Tag>
                </div>

                <!-- 价格条目展示区 (极简分栏虚线分割设计) -->
                <div class="mt-4 flex items-center justify-between border-y border-dashed border-gray-150 py-2.5">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-400 leading-none">输入价格 / K Token</span>
                    <span class="text-xs font-bold text-gray-700 mt-1.5 font-mono">¥{{ service.inputPrice.toFixed(4) }}</span>
                  </div>
                  <div class="h-6 w-px bg-gray-200"></div>
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] text-gray-400 leading-none">输出价格 / K Token</span>
                    <span class="text-xs font-bold text-gray-700 mt-1.5 font-mono">¥{{ service.outputPrice.toFixed(4) }}</span>
                  </div>
                </div>
              </div>

              <!-- 底部调用量和动作栏 (呼吸小绿点) -->
              <div class="mt-3.5 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div class="flex items-center gap-1.5">
                  <span class="relative flex h-2 w-2">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span class="text-[11px] text-gray-400 font-medium">
                    调用 <span class="font-bold text-gray-700 font-mono">{{ service.totalCalls >= 10000 ? (service.totalCalls / 10000).toFixed(1) + 'W' : service.totalCalls }}</span> 次
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <Button type="text" size="small" class="flex items-center justify-center p-0 h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200" title="在线调试" @click="startDebug(service.serviceName)">
                    <template #icon><Terminal class="size-4" /></template>
                  </Button>
                  <Button type="text" size="small" class="flex items-center justify-center p-0 h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200" title="生成 Key" @click="generateApiKey(service.serviceName)">
                    <template #icon><Key class="size-4" /></template>
                  </Button>
                  <Button type="text" size="small" class="flex items-center justify-center p-0 h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200" title="复制 Endpoint" @click="copyEndpoint(service.serviceName)">
                    <template #icon><Copy class="size-4" /></template>
                  </Button>
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
