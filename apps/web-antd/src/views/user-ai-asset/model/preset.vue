<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Pagination,
  Row,
  Segmented,
  Select,
  Space,
  Tag,
  Tooltip,
} from 'ant-design-vue';
import {
  BookOpenText,
  Eye,
  Grid,
  LayoutGrid,
  Search,
  Settings,
} from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const router = useRouter();
const searchText = ref('');
const categoryFilter = ref<string>();
const viewMode = ref('card');
const currentPage = ref(1);
const pageSize = ref(12);

interface Model {
  id: number;
  name: string;
  provider: string;
  description: string;
  updated: string;
  category: string;
  tags: string[];
  color: string;
  icon: string;
}

const presetModels = ref<Model[]>([
  // 国内大模型
  {
    id: 1,
    name: 'Qwen2.5-72B-Instruct',
    provider: '阿里云',
    description:
      '通义千问2.5系列最强模型，支持128K上下文，具备强大的推理、数学、代码能力',
    updated: '2026-05-20',
    category: '大语言模型',
    tags: ['128K上下文', '多语言', '代码生成'],
    color: 'from-slate-600 to-slate-700',
    icon: 'book',
  },
  {
    id: 2,
    name: 'DeepSeek-V3-671B',
    provider: 'DeepSeek',
    description:
      'DeepSeek第三代大模型，MoE架构，推理能力出众，数学和代码表现优异',
    updated: '2026-05-18',
    category: '大语言模型',
    tags: ['MoE架构', '推理增强', '代码生成'],
    color: 'from-blue-600 to-blue-700',
    icon: 'grid',
  },
  {
    id: 3,
    name: 'ChatGLM4-9B',
    provider: '智谱AI',
    description:
      'GLM系列最新模型，支持多模态理解，工具调用能力强，中文理解出色',
    updated: '2026-05-15',
    category: '大语言模型',
    tags: ['多模态', '工具调用', '中文优化'],
    color: 'from-teal-600 to-teal-700',
    icon: 'layout',
  },
  {
    id: 4,
    name: 'Baichuan4',
    provider: '百川智能',
    description: '百川第四代大模型，参数规模更大，推理能力更强，支持长文本理解',
    updated: '2026-05-12',
    category: '大语言模型',
    tags: ['长文本', '知识问答', '角色扮演'],
    color: 'from-indigo-600 to-indigo-700',
    icon: 'book',
  },
  {
    id: 5,
    name: 'Yi-Large',
    provider: '零一万物',
    description: '李开复博士领衔打造，具备强大的逻辑推理和创意写作能力',
    updated: '2026-05-10',
    category: '大语言模型',
    tags: ['推理能力', '创意写作', '多语言'],
    color: 'from-cyan-600 to-cyan-700',
    icon: 'grid',
  },
  {
    id: 6,
    name: 'Kimi-MoE',
    provider: '月之暗面',
    description: '支持超长上下文(200K+)，擅长文档总结、长文本理解和信息检索',
    updated: '2026-05-08',
    category: '大语言模型',
    tags: ['超长上下文', '文档理解', '信息检索'],
    color: 'from-violet-600 to-violet-700',
    icon: 'eye',
  },
  // 国际大模型
  {
    id: 7,
    name: 'GPT-4o',
    provider: 'OpenAI',
    description:
      'OpenAI最新旗舰模型，支持多模态输入输出，响应速度快，推理能力强',
    updated: '2026-05-25',
    category: '大语言模型',
    tags: ['多模态', '快速响应', '复杂推理'],
    color: 'from-emerald-600 to-emerald-700',
    icon: 'grid',
  },
  {
    id: 8,
    name: 'Claude-3.5-Sonnet',
    provider: 'Anthropic',
    description: 'Claude系列最强模型，擅长代码、数学、分析推理，支持200K上下文',
    updated: '2026-05-22',
    category: '大语言模型',
    tags: ['代码专家', '安全可靠', '长上下文'],
    color: 'from-amber-600 to-amber-700',
    icon: 'book',
  },
  {
    id: 9,
    name: 'Llama-3.1-405B',
    provider: 'Meta',
    description: 'Meta开源最大模型，405B参数，性能接近GPT-4，支持多语言',
    updated: '2026-05-20',
    category: '大语言模型',
    tags: ['开源', '多语言', '可定制'],
    color: 'from-sky-600 to-sky-700',
    icon: 'layout',
  },
  {
    id: 10,
    name: 'Gemini-1.5-Pro',
    provider: 'Google',
    description:
      'Google最新多模态大模型，支持100万token上下文，多模态理解能力强',
    updated: '2026-05-18',
    category: '多模态模型',
    tags: ['百万上下文', '多模态', '视频理解'],
    color: 'from-rose-600 to-rose-700',
    icon: 'eye',
  },
  {
    id: 11,
    name: 'Mistral-Large-2',
    provider: 'Mistral AI',
    description: '欧洲最强开源模型厂商旗舰产品，推理速度快，性能优异',
    updated: '2026-05-15',
    category: '大语言模型',
    tags: ['高效推理', '开源友好', '多语言'],
    color: 'from-orange-600 to-orange-700',
    icon: 'settings',
  },
  {
    id: 12,
    name: 'Grok-2',
    provider: 'xAI',
    description: '马斯克旗下xAI打造，具备实时信息获取能力，风格幽默直接',
    updated: '2026-05-12',
    category: '大语言模型',
    tags: ['实时信息', '幽默风格', '实时更新'],
    color: 'from-zinc-600 to-zinc-700',
    icon: 'grid',
  },
  {
    id: 13,
    name: 'Command-R+',
    provider: 'Cohere',
    description: '专为企业打造的RAG优化模型，支持工具调用和多语言',
    updated: '2026-05-10',
    category: '大语言模型',
    tags: ['RAG优化', '企业级', '多语言'],
    color: 'from-fuchsia-600 to-fuchsia-700',
    icon: 'eye',
  },
  {
    id: 14,
    name: 'Phi-3-Medium',
    provider: 'Microsoft',
    description: '微软小型高效模型，14B参数却有强劲性能，适合端侧部署',
    updated: '2026-05-08',
    category: '轻量模型',
    tags: ['轻量高效', '端侧部署', '多任务'],
    color: 'from-sky-600 to-blue-700',
    icon: 'grid',
  },
  {
    id: 15,
    name: 'Qwen2-VL-72B',
    provider: '阿里云',
    description: '通义千问视觉语言模型，支持图像视频理解，OCR能力强',
    updated: '2026-05-05',
    category: '多模态模型',
    tags: ['视觉理解', '视频分析', 'OCR'],
    color: 'from-stone-600 to-stone-700',
    icon: 'eye',
  },
  {
    id: 16,
    name: 'InternVL2-26B',
    provider: '上海AI实验室',
    description: '开源最强视觉语言模型之一，多模态理解能力突出',
    updated: '2026-05-03',
    category: '多模态模型',
    tags: ['开源', '视觉理解', '科研友好'],
    color: 'from-pink-600 to-pink-700',
    icon: 'eye',
  },
]);

const categoryOptions = [
  { label: '全部类型', value: undefined },
  { label: '大语言模型', value: '大语言模型' },
  { label: '多模态模型', value: '多模态模型' },
  { label: '轻量模型', value: '轻量模型' },
];

const filteredModels = computed(() => {
  let result = presetModels.value;

  if (categoryFilter.value) {
    result = result.filter((m) => m.category === categoryFilter.value);
  }

  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(keyword) ||
        m.provider.toLowerCase().includes(keyword) ||
        m.description.toLowerCase().includes(keyword) ||
        m.tags.some((t) => t.toLowerCase().includes(keyword)),
    );
  }

  return result;
});

const displayedModels = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredModels.value.slice(start, end);
});

const handleSearch = () => {
  currentPage.value = 1;
};

function handleReset() {
  searchText.value = '';
  categoryFilter.value = undefined;
  currentPage.value = 1;
}

function handleDeploy(model: Model) {
  router.push('/user-task/inference/create');
  showNotify(`开始部署 ${model.name}`);
}

function handleFinetune(model: Model) {
  router.push('/user-task/finetune/create');
  showNotify(`开始微调 ${model.name}`);
}

function getIconComponent(icon: string) {
  const icons: Record<string, any> = {
    book: BookOpenText,
    eye: Eye,
    grid: Grid,
    layout: LayoutGrid,
    settings: Settings,
  };
  return icons[icon] || Grid;
}
</script>

<template>
  <ListPageLayout list-title="预置模型">
    <template #filters>
      <Space size="middle" wrap>
        <Input
          v-model:value="searchText"
          placeholder="搜索模型名称、厂商、特性..."
          class="!w-[280px]"
          allow-clear
          @change="handleSearch"
        >
          <template #prefix>
            <Search class="size-4 text-gray-400" />
          </template>
        </Input>
        <Select
          v-model:value="categoryFilter"
          :options="categoryOptions"
          style="width: 140px"
          @change="handleSearch"
        />
      </Space>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary" @click="handleSearch">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button @click="handleSearch">刷新</Button>
    </template>

    <template #viewSwitch>
      <Segmented
        v-model:value="viewMode"
        :options="[
          { label: '列表', value: 'table' },
          { label: '卡片', value: 'card' },
        ]"
      />
    </template>

    <div class="flex-1 overflow-auto">
      <Row :gutter="[20, 20]" v-if="displayedModels.length > 0">
        <Col
          v-for="model in displayedModels"
          :key="model.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
        >
          <Card
            :bordered="false"
            class="h-full shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            :body-style="{ padding: 0 }"
          >
            <!-- 卡片头部 - 渐变背景 -->
            <div
              class="relative h-44 flex flex-col items-center justify-center bg-gradient-to-br"
              :class="model.color"
            >
              <!-- 模型图标 -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-20"
              >
                <component
                  :is="getIconComponent(model.icon)"
                  class="size-24 text-white"
                />
              </div>
              <div class="relative z-10 text-white text-center">
                <div class="text-3xl font-bold tracking-tight mb-1">
                  {{ model.name.split('-')[0] }}
                </div>
                <div class="text-sm opacity-80 font-medium">
                  {{ model.provider }}
                </div>
              </div>
              <!-- 分类标签 -->
              <Tag
                class="absolute top-3 left-3 !rounded-full !bg-white/20 !border-white/30 !text-white !px-2"
              >
                {{ model.category }}
              </Tag>
            </div>

            <!-- 卡片内容 -->
            <div class="p-4">
              <!-- 模型名称 -->
              <Tooltip :title="model.name">
                <h3
                  class="font-semibold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors"
                >
                  {{ model.name }}
                </h3>
              </Tooltip>

              <!-- 简介 -->
              <p class="text-sm text-gray-500 line-clamp-2 mb-3 h-10 leading-5">
                {{ model.description }}
              </p>

              <!-- 特性标签 -->
              <div class="flex flex-wrap gap-1.5 mb-3">
                <Tag
                  v-for="tag in model.tags.slice(0, 3)"
                  :key="tag"
                  class="!rounded-full !text-xs !px-2 !py-0.5 !border-gray-200 !text-gray-600"
                >
                  {{ tag }}
                </Tag>
              </div>

              <!-- 更新时间 -->
              <div class="flex items-center text-xs text-gray-400 mb-4">
                <Settings class="size-3 mr-1.5" />
                <span>更新于 {{ model.updated }}</span>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-3 pt-3 border-t border-gray-100">
                <Button
                  type="primary"
                  size="small"
                  class="!flex-1 !rounded-lg !h-8"
                  @click.stop="handleDeploy(model)"
                >
                  部署
                </Button>
                <Button
                  size="small"
                  class="!flex-1 !rounded-lg !h-8"
                  @click.stop="handleFinetune(model)"
                >
                  微调
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <!-- 空状态 -->
      <div v-else class="flex flex-col items-center justify-center py-20">
        <Empty description="未找到匹配的预置模型">
          <Button type="primary" @click="handleReset">清空筛选</Button>
        </Empty>
      </div>

      <!-- 分页 -->
      <div
        v-if="filteredModels.length > pageSize"
        class="fn-list-pagination flex items-center justify-center"
      >
        <Pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="filteredModels.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['12', '24', '48', '96']"
        />
      </div>
    </div>
  </ListPageLayout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 卡片hover效果增强 */
.ant-card:hover {
  transform: translateY(-4px);
}

/* 渐变背景动画 */
.group:hover .bg-gradient-to-br {
  filter: brightness(1.1);
}
</style>
