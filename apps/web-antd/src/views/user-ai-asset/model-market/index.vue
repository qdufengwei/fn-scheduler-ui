<script setup lang="ts">
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { createIconifyIcon, RotateCw, Search } from '@vben/icons';

import {
  Button,
  Drawer,
  Input,
  message,
  Pagination,
  Select,
  TabPane,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { getModelIconSrc } from '#/utils/model-icon';

const SlidersHorizontal = createIconifyIcon('lucide:sliders-horizontal');
const ShieldAlert = createIconifyIcon('lucide:shield-alert');
const Terminal = createIconifyIcon('lucide:terminal');
const Key = createIconifyIcon('lucide:key');
const Copy = createIconifyIcon('lucide:copy');

const Globe = createIconifyIcon('lucide:globe');
const Cpu = createIconifyIcon('lucide:cpu');
const Zap = createIconifyIcon('lucide:zap');

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
    totalCalls: 128_362,
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
    totalCalls: 86_420,
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
    totalCalls: 61_044,
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
    totalCalls: 43_190,
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
    totalCalls: 39_720,
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
    totalCalls: 27_560,
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
    totalCalls: 18_450,
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
    totalCalls: 12_530,
    user: 'test01',
  },
]);

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
  message.success(
    `成功为服务 ${serviceName} 生成临时调试 API-Key！已自动保存至您的凭证管理。`,
  );
}

function copyEndpoint(serviceName: string) {
  navigator.clipboard.writeText(
    `https://api.fn-compute.net/v1/models/${serviceName}/chat/completions`,
  );
  message.success(`已复制 ${serviceName} 的服务 Endpoint！`);
}

// 模型详情抽屉相关数据与控制
const detailVisible = ref(false);
const selectedService = ref<ModelService | null>(null);
const activeTabKey = ref('curl');

// 模拟的高级模型元数据定义
interface ModelMeta {
  provider: string;
  contextWindow: string;
  maxOutput: string;
  description: string;
  advantages: string[];
}

const mockModelMetaMap: Record<string, ModelMeta> = {
  文本生成: {
    provider: 'DeepSeek / Meta / Google',
    contextWindow: '128K Tokens',
    maxOutput: '8,192 Tokens',
    description:
      '采用最先进的指令微调与强化学习算法。在大规模多任务语言理解（MMLU）、复杂推理、数学计算及代码编写方面展现出极其出色的水平，特别适用于智能助手、专业文本生成、逻辑推导及语义分析等企业级复杂场景。',
    advantages: [
      '业界顶级数学与逻辑推理表现',
      '深度支持中文与英文指令遵循',
      '超长上下文关联感知能力',
    ],
  },
  代码生成: {
    provider: 'DeepSeek / Meta / Qwen',
    contextWindow: '64K Tokens',
    maxOutput: '4,096 Tokens',
    description:
      '专为多语言代码生成、补全、解释和重构而优化。理解复杂系统架构设计，支持数十种编程语言，生成符合行业最佳实践的高安全性、高质量规范代码，内置单元测试建议及错误排查提示。',
    advantages: [
      '跨文件上下文代码补全',
      '出色的 SQL 与 Shell 脚本处理',
      '开箱即用的单元测试生成能力',
    ],
  },
  视觉识别: {
    provider: 'OpenAI / Google / Meta',
    contextWindow: '32K Tokens',
    maxOutput: '4,096 Tokens',
    description:
      '结合领先的多模态视觉-语言大模型，不仅支持精准的通用物体识别和多语言 OCR 文本提取，更能深度解析复杂图表、电路图、医学影像、工程图纸等多行业视觉资产，具备高精度语义理解。',
    advantages: [
      '业界顶级的 OCR 识别精度',
      '深度支持多图复杂关联推理',
      '智能图表及数据大屏数据还原',
    ],
  },
  语音处理: {
    provider: 'OpenAI / Bilibili / Alibaba',
    contextWindow: '16K Tokens',
    maxOutput: '2,048 Tokens',
    description:
      '多语种高保真语音识别与合成大模型。支持几十种方言与外语混合识别，能够自动进行背景降噪与说话人角色区分，提供自然感叹词、情绪合成等拟真语音服务，实现近乎零延迟的音频吞吐。',
    advantages: [
      '抗噪及多说话人声学分离',
      '毫秒级流式语音识别响应',
      '超写实拟人化情绪声线合成',
    ],
  },
};

const activeMeta = computed<ModelMeta>(() => {
  if (!selectedService.value) {
    return {
      provider: '开源社区',
      contextWindow: '32K Tokens',
      maxOutput: '4,096 Tokens',
      description: '通用智能算力调度平台大模型服务。',
      advantages: ['高性能推理吞吐', '极速并发响应'],
    };
  }
  return (
    mockModelMetaMap[selectedService.value.category] ?? {
      provider: '开源社区',
      contextWindow: '32K Tokens',
      maxOutput: '4,096 Tokens',
      description: '通用智能算力调度平台大模型服务。',
      advantages: ['高性能推理吞吐', '极速并发响应'],
    }
  );
});

function showDetail(service: ModelService) {
  selectedService.value = service;
  detailVisible.value = true;
  activeTabKey.value = 'curl';
}

// 获取模型图标 URL
function getModelIcon(modelName: string): string {
  return getModelIconSrc(modelName);
}

const curlCode = computed(() => {
  if (!selectedService.value) return '';
  return String.raw`curl https://api.fn-compute.net/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "${selectedService.value.modelName}",
    "messages": [
      {
        "role": "user",
        "content": "请用简短的语言向我介绍你自己"
      }
    ],
    "temperature": 0.7
  }'`;
});

const pythonCode = computed(() => {
  if (!selectedService.value) return '';
  return `from openai import OpenAI

client = OpenAI(
    base_url="https://api.fn-compute.net/v1",
    api_key="YOUR_API_KEY"
)

response = client.chat.completions.create(
    model="${selectedService.value.modelName}",
    messages=[
        {"role": "user", "content": "请用简短的语言向我介绍你自己"}
    ],
    temperature=0.7
)

print(response.choices[0].message.content)`;
});

const jsCode = computed(() => {
  if (!selectedService.value) return '';
  return `import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.fn-compute.net/v1",
  apiKey: "YOUR_API_KEY"
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "${selectedService.value.modelName}",
    messages: [
      { role: "user", content: "请用简短的语言向我介绍你自己" }
    ],
    temperature: 0.7
  });

  console.log(completion.choices[0].message.content);
}

main();`;
});

function handleCopyCode(code: string) {
  navigator.clipboard
    .writeText(code)
    .then(() => {
      message.success('示例代码已复制到剪贴板！');
    })
    .catch(() => {
      message.error('复制失败，请手动选择复制');
    });
}
</script>

<template>
  <Page auto-content-height>
    <!-- 顶层外壳，确保无 Transition Transition 报错问题 -->
    <div
      class="flex flex-col md:flex-row w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[calc(100vh-148px)]"
    >
      <!-- 左侧筛选控制面板 -->
      <aside
        class="w-full md:w-60 bg-gray-50 border-r border-gray-150 p-5 flex flex-col gap-6 shrink-0"
      >
        <div
          class="flex items-center justify-between border-b border-gray-200 pb-3"
        >
          <div class="flex items-center gap-2 text-gray-800 font-bold">
            <SlidersHorizontal class="size-4.5 text-blue-500" />
            <span>筛选模型</span>
          </div>
          <Button
            type="link"
            size="small"
            class="flex items-center gap-1 p-0 font-medium text-blue-500 hover:text-blue-600"
            @click="handleReset"
          >
            <template #icon><RotateCw class="size-3.5" /></template>
            重置
          </Button>
        </div>

        <!-- 分类选择区 -->
        <div class="flex flex-col gap-3">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            分类
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in categoryOptions"
              :key="item"
              class="h-8.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
              :class="
                selectedCategory === item
                  ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'
              "
              @click="selectCategory(item)"
            >
              {{ item }}
            </button>
          </div>
        </div>

        <!-- 排序字段区 -->
        <div class="flex flex-col gap-3">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            排序字段
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in sortFieldOptions"
              :key="item.value"
              class="h-8.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
              :class="
                sortField === item.value
                  ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'
              "
              @click="selectSortField(item.value)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <!-- 排序方向区 -->
        <div class="flex flex-col gap-3">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            排序方向
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="item in sortDirectionOptions"
              :key="item.value"
              class="h-8.5 rounded-lg border text-xs font-medium transition-all duration-200 flex items-center justify-center cursor-pointer"
              :class="
                sortDirection === item.value
                  ? 'bg-blue-50 border-blue-500 text-blue-600 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:text-blue-500'
              "
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
        <div
          class="flex items-center justify-between gap-4 px-6 py-4.5 border-b border-gray-100 bg-white shrink-0"
        >
          <div class="text-sm font-bold text-gray-800 shrink-0">
            模型服务列表
          </div>
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
          <div
            v-if="paginatedServices.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
          >
            <!-- 单个服务卡片 -->
            <div
              v-for="service in paginatedServices"
              :key="service.id"
              class="group relative bg-white rounded-xl border border-gray-150 p-5 hover:border-gray-300 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-all duration-200 flex flex-col justify-between h-[180px]"
            >
              <div>
                <!-- 头部：极简头像、标题、服务分类 (点击可查看详情) -->
                <div
                  class="flex items-start justify-between gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  @click="showDetail(service)"
                >
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div
                      class="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-gray-50"
                    >
                      <img
                        :src="getModelIcon(service.modelName)"
                        :alt="service.modelName"
                        class="size-7 object-contain"
                      />
                    </div>
                    <div class="min-w-0">
                      <div
                        class="truncate text-sm font-semibold text-gray-900 leading-tight"
                      >
                        {{ service.serviceName }}
                      </div>
                      <div class="mt-0.5 flex items-center">
                        <span class="text-[10px] text-gray-400 font-mono">
                          {{ service.modelName }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Tag
                    class="m-0 rounded-md text-[10px] bg-gray-50 border-gray-200 text-gray-500 px-2 shrink-0"
                  >
                    {{ service.category }}
                  </Tag>
                </div>

                <!-- 价格条目展示区 (极简空白对齐设计，无虚线，无实线) -->
                <div class="mt-4 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-gray-400"
                      >输入价格 / K Token</span
                    >
                    <span
                      class="text-xs font-medium text-gray-700 mt-1 font-mono"
                      >¥{{ service.inputPrice.toFixed(4) }}</span
                    >
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] text-gray-400"
                      >输出价格 / K Token</span
                    >
                    <span
                      class="text-xs font-medium text-gray-700 mt-1 font-mono"
                      >¥{{ service.outputPrice.toFixed(4) }}</span
                    >
                  </div>
                </div>
              </div>

              <!-- 底部调用量和动作栏 (极简冷淡圆点) -->
              <div
                class="mt-3.5 pt-3.5 border-t border-gray-100 flex items-center justify-between"
              >
                <div
                  class="flex items-center gap-1.5 text-[11px] text-gray-400"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full bg-emerald-500/80"
                  ></span>
                  <span
                    >调用
                    <span class="font-semibold text-gray-700 font-mono">{{
                      service.totalCalls >= 10000
                        ? `${(service.totalCalls / 10000).toFixed(1)}W`
                        : service.totalCalls
                    }}</span>
                    次</span
                  >
                </div>
                <div class="flex items-center gap-1">
                  <Button
                    type="text"
                    size="small"
                    class="flex items-center justify-center p-0 h-6.5 w-6.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100/80 rounded-md transition-colors"
                    title="在线调试"
                    @click="startDebug(service.serviceName)"
                  >
                    <template #icon><Terminal class="size-3.5" /></template>
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    class="flex items-center justify-center p-0 h-6.5 w-6.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100/80 rounded-md transition-colors"
                    title="生成 Key"
                    @click="generateApiKey(service.serviceName)"
                  >
                    <template #icon><Key class="size-3.5" /></template>
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    class="flex items-center justify-center p-0 h-6.5 w-6.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100/80 rounded-md transition-colors"
                    title="复制 Endpoint"
                    @click="copyEndpoint(service.serviceName)"
                  >
                    <template #icon><Copy class="size-3.5" /></template>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空数据状态 -->
          <div
            v-else
            class="min-h-[380px] flex flex-col items-center justify-center text-center"
          >
            <ShieldAlert class="size-16 text-gray-300 mb-4" />
            <h3 class="text-base font-bold text-gray-700 m-0">
              暂无符合条件的模型服务
            </h3>
            <p class="text-xs text-gray-400 mt-1.5 max-w-xs">
              当前没有相关记录，增加服务或重置筛选条件后在此处查看数据。
            </p>
            <Button
              type="primary"
              size="small"
              class="mt-4 px-4"
              @click="handleReset"
            >
              重置筛选
            </Button>
          </div>
        </div>

        <!-- 底部大分页区 -->
        <div
          class="px-6 py-4 border-t border-gray-100 flex items-center justify-end"
        >
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

    <!-- 极细致莫兰迪风模型详情抽屉 -->
    <Drawer
      v-model:open="detailVisible"
      :title="null"
      width="580"
      placement="right"
      :closable="false"
      class="fn-model-detail-drawer"
    >
      <div
        v-if="selectedService"
        class="flex flex-col h-full gap-6 text-sm text-gray-750 p-1"
      >
        <!-- 头部标题区 -->
        <div
          class="flex items-start justify-between pb-4.5 border-b border-gray-100"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-gray-50"
            >
              <img
                :src="getModelIcon(selectedService.modelName)"
                :alt="selectedService.modelName"
                class="size-9 object-contain"
              />
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
            <Tag
              class="m-0 rounded-md text-[10px] bg-gray-50 border-gray-200 text-gray-500 px-2 shrink-0"
            >
              {{ selectedService.category }}
            </Tag>
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100/60 text-[10px] font-medium shrink-0"
            >
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              在线运行
            </span>
          </div>
        </div>

        <!-- 技术参数网格 -->
        <div class="flex flex-col gap-2">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            技术指标 / Specifications
          </div>
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                <Globe class="size-3" />
                Provider
              </div>
              <div
                class="mt-1 text-xs font-semibold text-gray-800 truncate"
                :title="activeMeta.provider"
              >
                {{ activeMeta.provider }}
              </div>
            </div>
            <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                <Cpu class="size-3" />
                Context Window
              </div>
              <div class="mt-1 text-xs font-semibold text-gray-800 font-mono">
                {{ activeMeta.contextWindow }}
              </div>
            </div>
            <div class="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
              <div class="text-[10px] text-gray-400 flex items-center gap-1">
                <Zap class="size-3" />
                Max Output
              </div>
              <div class="mt-1 text-xs font-semibold text-gray-800 font-mono">
                {{ activeMeta.maxOutput }}
              </div>
            </div>
          </div>
        </div>

        <!-- 价格明细 -->
        <div class="flex flex-col gap-2">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            计费规则 / Pricing
          </div>
          <div
            class="bg-gray-50/40 border border-gray-100 rounded-xl p-4 flex items-center justify-between"
          >
            <div class="flex flex-col">
              <span class="text-[10px] text-gray-400">输入价格 / K Token</span>
              <span class="text-sm font-semibold text-gray-800 mt-1 font-mono"
                >¥{{ selectedService.inputPrice.toFixed(4) }}</span
              >
            </div>
            <div class="h-6 w-px bg-gray-200"></div>
            <div class="flex flex-col items-end">
              <span class="text-[10px] text-gray-400">输出价格 / K Token</span>
              <span class="text-sm font-semibold text-gray-800 mt-1 font-mono"
                >¥{{ selectedService.outputPrice.toFixed(4) }}</span
              >
            </div>
          </div>
        </div>

        <!-- 详细介绍 -->
        <div class="flex flex-col gap-2">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
          >
            模型描述 / Model Profile
          </div>
          <div
            class="bg-white text-xs leading-relaxed text-gray-550 text-justify"
          >
            {{ activeMeta.description }}
          </div>
          <div class="flex flex-wrap gap-2 mt-1">
            <span
              v-for="adv in activeMeta.advantages"
              :key="adv"
              class="inline-block px-2.5 py-1 text-[10px] bg-gray-50 text-gray-500 rounded-full border border-gray-200"
            >
              ✓ {{ adv }}
            </span>
          </div>
        </div>

        <!-- 快速集成与示例代码 -->
        <div class="flex flex-col gap-2 flex-1 min-h-0">
          <div
            class="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center justify-between"
          >
            <span>快速集成 / Quick Start</span>
            <span class="text-[10px] font-normal text-gray-400 font-mono"
              >OpenAI SDK 兼容</span
            >
          </div>

          <Tabs
            v-model:active-key="activeTabKey"
            class="fn-integration-tabs flex-1 flex flex-col min-h-0"
          >
            <TabPane key="curl" tab="cURL">
              <div
                class="relative bg-gray-900 rounded-xl p-4 overflow-hidden h-full flex flex-col justify-between"
              >
                <pre
                  class="m-0 text-xs text-blue-100 font-mono overflow-auto max-h-[150px] leading-relaxed"
                  >{{ curlCode }}</pre
                >
                <div class="mt-2.5 flex justify-end">
                  <Button
                    type="primary"
                    size="small"
                    class="h-7 px-3 text-xs bg-blue-600 border-0 hover:bg-blue-500 flex items-center gap-1"
                    @click="handleCopyCode(curlCode)"
                  >
                    <template #icon><Copy class="size-3" /></template>
                    复制代码
                  </Button>
                </div>
              </div>
            </TabPane>
            <TabPane key="python" tab="Python">
              <div
                class="relative bg-gray-900 rounded-xl p-4 overflow-hidden h-full flex flex-col justify-between"
              >
                <pre
                  class="m-0 text-xs text-blue-100 font-mono overflow-auto max-h-[150px] leading-relaxed"
                  >{{ pythonCode }}</pre
                >
                <div class="mt-2.5 flex justify-end">
                  <Button
                    type="primary"
                    size="small"
                    class="h-7 px-3 text-xs bg-blue-600 border-0 hover:bg-blue-500 flex items-center gap-1"
                    @click="handleCopyCode(pythonCode)"
                  >
                    <template #icon><Copy class="size-3" /></template>
                    复制代码
                  </Button>
                </div>
              </div>
            </TabPane>
            <TabPane key="js" tab="Node.js">
              <div
                class="relative bg-gray-900 rounded-xl p-4 overflow-hidden h-full flex flex-col justify-between"
              >
                <pre
                  class="m-0 text-xs text-blue-100 font-mono overflow-auto max-h-[150px] leading-relaxed"
                  >{{ jsCode }}</pre
                >
                <div class="mt-2.5 flex justify-end">
                  <Button
                    type="primary"
                    size="small"
                    class="h-7 px-3 text-xs bg-blue-600 border-0 hover:bg-blue-500 flex items-center gap-1"
                    @click="handleCopyCode(jsCode)"
                  >
                    <template #icon><Copy class="size-3" /></template>
                    复制代码
                  </Button>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>

        <!-- 关闭抽屉按钮 -->
        <div
          class="mt-auto pt-3 border-t border-gray-100 flex justify-end shrink-0"
        >
          <Button class="rounded-lg text-xs" @click="detailVisible = false">
            关闭窗口
          </Button>
        </div>
      </div>
    </Drawer>
  </Page>
</template>
