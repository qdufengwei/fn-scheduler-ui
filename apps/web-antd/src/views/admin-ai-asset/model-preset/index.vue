<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Button,
  Card,
  Col,
  Empty,
  Input,
  Pagination,
  Row,
  Tag,
  Tooltip,
} from 'ant-design-vue';
import { RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { getModelIconSrc } from '#/utils/model-icon';

// 筛选条件
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(12);

// 预置模型数据
const presetModels = ref([
  // 国内大模型 - 阿里云
  {
    id: 1,
    name: 'Qwen3-4B-Thinking-2507',
    description:
      'Qwen3-4B-Thinking-2507是阿里巴巴的推理增强模型，具有思维链能力，专为复杂推理任务优化，支持多步推理和自我反思。',
    updateTime: '2026-03-30 05:46:07',
    provider: '阿里云',
    category: '推理模型',
    params: '4B',
    color: 'from-violet-500 to-purple-600',
    icon: 'brain',
  },
  {
    id: 2,
    name: 'Qwen3-30B-A3B-Instruct-2507',
    description:
      'Qwen3-30B-A3B-Instruct-2507是阿里巴巴的指令调优模型，具有优化的MoE架构，可实现均衡的效能与速度，适合大规模部署场景。',
    updateTime: '2026-03-30 05:46:07',
    provider: '阿里云',
    category: '大语言模型',
    params: '30B',
    color: 'from-blue-500 to-cyan-600',
    icon: 'sparkles',
  },
  {
    id: 3,
    name: 'Qwen2.5-72B-Instruct',
    description:
      '通义千问2.5系列最强模型，支持128K上下文，具备强大的推理、数学、代码能力，在多项评测中表现优异。',
    updateTime: '2026-03-28 10:22:33',
    provider: '阿里云',
    category: '大语言模型',
    params: '72B',
    color: 'from-indigo-500 to-blue-600',
    icon: 'sparkles',
  },
  {
    id: 4,
    name: 'Qwen2.5-32B-Instruct',
    description:
      '通义千问2.5系列中等规模模型，平衡性能与效率，支持32K上下文，适合中等规模推理任务。',
    updateTime: '2026-03-28 10:22:33',
    provider: '阿里云',
    category: '大语言模型',
    params: '32B',
    color: 'from-blue-400 to-indigo-500',
    icon: 'sparkles',
  },
  {
    id: 5,
    name: 'Qwen2-VL-72B',
    description:
      '通义千问视觉语言模型，支持图像视频理解，OCR能力强，可处理多模态输入，在视觉理解任务中表现出色。',
    updateTime: '2026-03-25 08:15:42',
    provider: '阿里云',
    category: '多模态模型',
    params: '72B',
    color: 'from-teal-500 to-emerald-600',
    icon: 'zap',
  },
  // 国内大模型 - DeepSeek
  {
    id: 6,
    name: 'DeepSeek-Prover-V2-671B',
    description:
      'DeepSeek-Prover-V2-671B是DeepSeek AI开发的高级开源语言模型，专为数学定理证明和形式化推理优化，在数学领域表现卓越。',
    updateTime: '2026-03-30 05:46:07',
    provider: 'DeepSeek',
    category: '推理模型',
    params: '671B',
    color: 'from-indigo-500 to-violet-600',
    icon: 'brain',
  },
  {
    id: 7,
    name: 'DeepSeek-R1-Distill-Llama-70B',
    description:
      'DeepSeek-R1-Distill-Llama-70B是DeepSeek开发的大型语言模型的知识蒸馏版本，基于Llama架构，保留了强大的推理能力。',
    updateTime: '2026-03-30 05:46:07',
    provider: 'DeepSeek',
    category: '大语言模型',
    params: '70B',
    color: 'from-rose-500 to-pink-600',
    icon: 'zap',
  },
  {
    id: 8,
    name: 'DeepSeek-R1-Distill-Llama-8B',
    description:
      'DeepSeek-R1-Distill模型是基于开源模型，使用DeepSeek-R1生成的样本进行微调，在保持较小参数量的同时具备出色的推理性能。',
    updateTime: '2026-03-30 05:46:07',
    provider: 'DeepSeek',
    category: '轻量模型',
    params: '8B',
    color: 'from-fuchsia-500 to-purple-600',
    icon: 'sparkles',
  },
  {
    id: 9,
    name: 'DeepSeek-V3-671B',
    description:
      'DeepSeek第三代大模型，MoE架构，推理能力出众，数学和代码表现优异，在多项评测中超越同级别模型。',
    updateTime: '2026-03-18 14:30:25',
    provider: 'DeepSeek',
    category: '大语言模型',
    params: '671B',
    color: 'from-blue-600 to-indigo-700',
    icon: 'sparkles',
  },
  {
    id: 10,
    name: 'DeepSeek-Coder-V2-33B',
    description:
      'DeepSeek代码生成专用模型，支持多种编程语言，代码补全、解释、重构能力强，适合软件开发场景。',
    updateTime: '2026-03-20 09:45:18',
    provider: 'DeepSeek',
    category: '代码模型',
    params: '33B',
    color: 'from-slate-500 to-gray-600',
    icon: 'cpu',
  },
  // 国内大模型 - 智谱AI
  {
    id: 11,
    name: 'ChatGLM4-9B',
    description:
      'GLM系列最新模型，支持多模态理解，工具调用能力强，中文理解出色，适合对话和知识问答场景。',
    updateTime: '2026-03-15 16:20:33',
    provider: '智谱AI',
    category: '大语言模型',
    params: '9B',
    color: 'from-teal-600 to-cyan-700',
    icon: 'sparkles',
  },
  {
    id: 12,
    name: 'GLM-4-Plus',
    description:
      '智谱AI旗舰模型，支持128K上下文，具备强大的逻辑推理和长文本理解能力，适合复杂任务处理。',
    updateTime: '2026-03-22 11:05:47',
    provider: '智谱AI',
    category: '大语言模型',
    params: 'Plus',
    color: 'from-emerald-500 to-green-600',
    icon: 'brain',
  },
  {
    id: 13,
    name: 'GLM-4V-9B',
    description:
      '智谱AI多模态版本，支持图像理解、视频分析，视觉问答能力强，可处理图文混合输入。',
    updateTime: '2026-03-10 18:42:56',
    provider: '智谱AI',
    category: '多模态模型',
    params: '9B',
    color: 'from-lime-500 to-emerald-600',
    icon: 'zap',
  },
  // 国内大模型 - 百川智能
  {
    id: 14,
    name: 'Baichuan4',
    description:
      '百川第四代大模型，参数规模更大，推理能力更强，支持长文本理解，中文能力突出。',
    updateTime: '2026-03-12 08:30:15',
    provider: '百川智能',
    category: '大语言模型',
    params: '旗舰',
    color: 'from-indigo-600 to-purple-700',
    icon: 'sparkles',
  },
  {
    id: 15,
    name: 'Baichuan2-13B-Chat',
    description:
      '百川第二代对话模型，13B参数，擅长角色扮演、知识问答，支持多轮对话，响应速度快。',
    updateTime: '2026-03-08 14:55:22',
    provider: '百川智能',
    category: '大语言模型',
    params: '13B',
    color: 'from-purple-400 to-fuchsia-500',
    icon: 'sparkles',
  },
  // 国内大模型 - 月之暗面
  {
    id: 16,
    name: 'Kimi-MoE',
    description:
      '月之暗面超长上下文模型，支持200K+上下文，擅长文档总结、长文本理解和信息检索。',
    updateTime: '2026-03-08 09:18:44',
    provider: '月之暗面',
    category: '大语言模型',
    params: 'MoE',
    color: 'from-violet-600 to-indigo-700',
    icon: 'brain',
  },
  {
    id: 17,
    name: 'Kimi-Chat',
    description:
      '月之暗面对话模型，支持长上下文对话，文件解析能力强，可处理PDF、Word等文档格式。',
    updateTime: '2026-03-05 20:33:11',
    provider: '月之暗面',
    category: '大语言模型',
    params: 'Chat',
    color: 'from-purple-500 to-violet-600',
    icon: 'sparkles',
  },
  // 国内大模型 - 零一万物
  {
    id: 18,
    name: 'Yi-Large',
    description:
      '李开复博士领衔打造，具备强大的逻辑推理和创意写作能力，支持多语言处理。',
    updateTime: '2026-03-10 11:25:38',
    provider: '零一万物',
    category: '大语言模型',
    params: 'Large',
    color: 'from-cyan-500 to-teal-600',
    icon: 'sparkles',
  },
  {
    id: 19,
    name: 'Yi-34B-Chat',
    description:
      '零一万物34B参数对话模型，中文理解能力强，适合日常对话和知识问答场景。',
    updateTime: '2026-03-06 15:48:29',
    provider: '零一万物',
    category: '大语言模型',
    params: '34B',
    color: 'from-sky-400 to-cyan-500',
    icon: 'sparkles',
  },
  // 国际大模型 - Meta
  {
    id: 20,
    name: 'Llama-4-Scout-17B-16E-Instruct',
    description:
      'Llama-4原生多模态模型，具备优异的文字处理与多模态互动能力，采用16个专家模组的MoE架构。',
    updateTime: '2026-03-30 05:46:07',
    provider: 'Meta',
    category: '多模态模型',
    params: '17B',
    color: 'from-emerald-500 to-teal-600',
    icon: 'zap',
  },
  {
    id: 21,
    name: 'Llama3.3-70B-Instruct',
    description:
      'Meta开源700亿参数指令微调模型，支持8种语言与128K上下文，采用GQA技术，效能堪比405B版本。',
    updateTime: '2026-03-30 05:46:07',
    provider: 'Meta',
    category: '大语言模型',
    params: '70B',
    color: 'from-orange-500 to-amber-600',
    icon: 'cpu',
  },
  {
    id: 22,
    name: 'Llama3.2-3B-Instruct',
    description:
      'Meta轻量级模型，3B参数，适合端侧部署和边缘计算场景，支持多语言处理。',
    updateTime: '2026-03-30 05:46:07',
    provider: 'Meta',
    category: '轻量模型',
    params: '3B',
    color: 'from-sky-500 to-blue-600',
    icon: 'sparkles',
  },
  {
    id: 23,
    name: 'Llama3.1-405B-Instruct',
    description:
      'Meta开源最大模型，405B参数，性能接近GPT-4，支持多语言和128K上下文，可免费商用。',
    updateTime: '2026-03-20 08:15:33',
    provider: 'Meta',
    category: '大语言模型',
    params: '405B',
    color: 'from-sky-600 to-indigo-700',
    icon: 'brain',
  },
  {
    id: 24,
    name: 'Llama3.1-8B-Instruct',
    description:
      'Meta轻量级模型，8B参数，性能优异，适合资源受限环境部署，支持多语言。',
    updateTime: '2026-03-18 12:40:55',
    provider: 'Meta',
    category: '轻量模型',
    params: '8B',
    color: 'from-blue-400 to-sky-500',
    icon: 'sparkles',
  },
  // 国际大模型 - OpenAI
  {
    id: 25,
    name: 'GPT-4o',
    description:
      'OpenAI最新旗舰模型，支持多模态输入输出，响应速度快，推理能力强，适合复杂任务处理。',
    updateTime: '2026-03-25 14:22:18',
    provider: 'OpenAI',
    category: '多模态模型',
    params: '旗舰',
    color: 'from-emerald-600 to-teal-700',
    icon: 'zap',
  },
  {
    id: 26,
    name: 'GPT-4o-mini',
    description:
      'OpenAI轻量级多模态模型，成本低、速度快，适合大规模部署和日常对话场景。',
    updateTime: '2026-03-22 09:35:44',
    provider: 'OpenAI',
    category: '轻量模型',
    params: 'mini',
    color: 'from-green-400 to-emerald-500',
    icon: 'sparkles',
  },
  {
    id: 27,
    name: 'GPT-4-Turbo',
    description:
      'OpenAI高性能版本，支持128K上下文，推理能力强，图像理解能力出色，适合复杂推理任务。',
    updateTime: '2026-03-15 16:50:33',
    provider: 'OpenAI',
    category: '大语言模型',
    params: 'Turbo',
    color: 'from-teal-500 to-cyan-600',
    icon: 'brain',
  },
  // 国际大模型 - Anthropic
  {
    id: 28,
    name: 'Claude-3.5-Sonnet',
    description:
      'Claude系列最强模型，擅长代码、数学、分析推理，支持200K上下文，安全可靠。',
    updateTime: '2026-03-22 10:18:27',
    provider: 'Anthropic',
    category: '大语言模型',
    params: 'Sonnet',
    color: 'from-amber-500 to-orange-600',
    icon: 'brain',
  },
  {
    id: 29,
    name: 'Claude-3-Opus',
    description:
      'Claude旗舰版本，推理能力最强，适合复杂任务处理，支持长上下文和多语言。',
    updateTime: '2026-03-18 14:45:16',
    provider: 'Anthropic',
    category: '大语言模型',
    params: 'Opus',
    color: 'from-orange-400 to-amber-500',
    icon: 'brain',
  },
  {
    id: 30,
    name: 'Claude-3.5-Haiku',
    description:
      'Claude轻量级版本，响应速度快，成本低，适合大规模部署和日常对话场景。',
    updateTime: '2026-03-20 08:30:55',
    provider: 'Anthropic',
    category: '轻量模型',
    params: 'Haiku',
    color: 'from-yellow-400 to-orange-500',
    icon: 'sparkles',
  },
  // 国际大模型 - Google
  {
    id: 31,
    name: 'Gemini-1.5-Pro',
    description:
      'Google最新多模态大模型，支持100万token上下文，多模态理解能力强，适合长文档处理。',
    updateTime: '2026-03-18 11:42:33',
    provider: 'Google',
    category: '多模态模型',
    params: 'Pro',
    color: 'from-rose-500 to-pink-600',
    icon: 'zap',
  },
  {
    id: 32,
    name: 'Gemini-1.5-Flash',
    description:
      'Google轻量级多模态模型，速度快，成本低，适合大规模部署和实时响应场景。',
    updateTime: '2026-03-15 15:28:44',
    provider: 'Google',
    category: '轻量模型',
    params: 'Flash',
    color: 'from-pink-400 to-rose-500',
    icon: 'sparkles',
  },
  // 国际大模型 - Mistral
  {
    id: 33,
    name: 'Mistral-Large-2',
    description:
      '欧洲最强开源模型厂商旗舰产品，推理速度快，性能优异，支持多语言处理。',
    updateTime: '2026-03-15 09:55:22',
    provider: 'Mistral AI',
    category: '大语言模型',
    params: 'Large',
    color: 'from-orange-600 to-red-700',
    icon: 'brain',
  },
  {
    id: 34,
    name: 'Mistral-7B-Instruct',
    description:
      'Mistral轻量级模型，7B参数性能优异，适合资源受限环境，开源可商用。',
    updateTime: '2026-03-12 14:18:33',
    provider: 'Mistral AI',
    category: '轻量模型',
    params: '7B',
    color: 'from-red-400 to-orange-500',
    icon: 'sparkles',
  },
  {
    id: 35,
    name: 'Mixtral-8x7B-Instruct',
    description:
      'Mistral MoE架构模型，8个7B专家，性能接近大模型，推理效率高，开源可商用。',
    updateTime: '2026-03-10 11:25:44',
    provider: 'Mistral AI',
    category: '大语言模型',
    params: '8x7B',
    color: 'from-amber-500 to-red-600',
    icon: 'zap',
  },
  // 国际大模型 - xAI
  {
    id: 36,
    name: 'Grok-2',
    description:
      '马斯克旗下xAI打造，具备实时信息获取能力，风格幽默直接，适合实时对话场景。',
    updateTime: '2026-03-12 08:42:15',
    provider: 'xAI',
    category: '大语言模型',
    params: 'Grok-2',
    color: 'from-zinc-500 to-gray-600',
    icon: 'sparkles',
  },
  // 国际大模型 - Cohere
  {
    id: 37,
    name: 'Command-R+',
    description:
      '专为企业打造的RAG优化模型，支持工具调用和多语言，适合企业级应用。',
    updateTime: '2026-03-10 16:35:28',
    provider: 'Cohere',
    category: '大语言模型',
    params: 'R+',
    color: 'from-fuchsia-600 to-purple-700',
    icon: 'brain',
  },
  {
    id: 38,
    name: 'Command-R',
    description:
      'Cohere企业级模型，RAG能力强，支持多语言和工具调用，适合企业知识库场景。',
    updateTime: '2026-03-08 12:50:33',
    provider: 'Cohere',
    category: '大语言模型',
    params: 'R',
    color: 'from-purple-400 to-fuchsia-500',
    icon: 'sparkles',
  },
  // 国际大模型 - Microsoft
  {
    id: 39,
    name: 'Phi-3-Medium',
    description:
      '微软小型高效模型，14B参数却有强劲性能，适合端侧部署，多任务处理能力强。',
    updateTime: '2026-03-08 09:18:44',
    provider: 'Microsoft',
    category: '轻量模型',
    params: '14B',
    color: 'from-sky-600 to-blue-700',
    icon: 'sparkles',
  },
  {
    id: 40,
    name: 'Phi-3-mini',
    description: '微软最小模型，3.8B参数，性能出色，适合移动端和边缘设备部署。',
    updateTime: '2026-03-05 14:33:55',
    provider: 'Microsoft',
    category: '轻量模型',
    params: '3.8B',
    color: 'from-blue-400 to-sky-500',
    icon: 'sparkles',
  },
  // 国内大模型 - 上海AI实验室
  {
    id: 41,
    name: 'InternVL2-26B',
    description:
      '开源最强视觉语言模型之一，多模态理解能力突出，适合图像理解和视觉问答场景。',
    updateTime: '2026-03-05 18:25:33',
    provider: '上海AI实验室',
    category: '多模态模型',
    params: '26B',
    color: 'from-pink-500 to-rose-600',
    icon: 'zap',
  },
  {
    id: 42,
    name: 'InternLM2-20B',
    description:
      '上海AI实验室开源模型，20B参数，中文能力强，适合对话和知识问答场景。',
    updateTime: '2026-03-02 11:42:18',
    provider: '上海AI实验室',
    category: '大语言模型',
    params: '20B',
    color: 'from-rose-400 to-pink-500',
    icon: 'sparkles',
  },
]);

// 筛选后的数据
const filteredModels = computed(() => {
  if (!keyword.value) return presetModels.value;
  return presetModels.value.filter((model) =>
    model.name.toLowerCase().includes(keyword.value.toLowerCase()),
  );
});

// 分页后的数据
const displayedModels = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredModels.value.slice(start, end);
});

function handleFilter() {
  currentPage.value = 1;
}

function handleReset() {
  keyword.value = '';
  currentPage.value = 1;
}

function handleRefresh() {
  // 刷新逻辑
}

// 获取模型图标 URL
function getModelIcon(model: { name: string; provider: string }): string {
  return getModelIconSrc(model.name, model.provider);
}
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-3">
        <Input
          v-model:value="keyword"
          placeholder="搜索模型名称"
          style="width: 280px"
          allow-clear
          @press-enter="handleFilter"
        />
      </div>
    </template>

    <template #filterActions>
      <Button type="primary" @click="handleFilter">筛选</Button>
      <Button @click="handleReset">重置</Button>
    </template>

    <template #toolbar>
      <Button @click="handleRefresh">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
    </template>

    <!-- 卡片列表 -->
    <div class="flex-1 overflow-auto p-4">
      <Row v-if="displayedModels.length > 0" :gutter="[20, 20]">
        <Col
          v-for="model in displayedModels"
          :key="model.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <Card
            :bordered="false"
            class="model-card h-full shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden"
            :body-style="{ padding: 0 }"
          >
            <!-- 卡片头部 - 渐变背景 -->
            <div
              class="relative h-32 flex flex-col items-center justify-center bg-gradient-to-br"
              :class="model.color"
            >
              <!-- 背景图标 -->
              <div
                class="absolute inset-0 flex items-center justify-center opacity-15"
              >
                <img
                  :src="getModelIcon(model)"
                  :alt="model.provider"
                  class="size-20 object-contain"
                />
              </div>
              <!-- 模型图标 -->
              <div class="relative z-10 flex flex-col items-center">
                <img
                  :src="getModelIcon(model)"
                  :alt="model.provider"
                  class="size-14 object-contain mb-2"
                />
                <div class="text-xs text-white/80">{{ model.provider }}</div>
              </div>
              <!-- 参数量标签 -->
              <Tag
                class="absolute top-3 right-3 !rounded-full !bg-white/20 !border-white/30 !text-white !px-2 !text-xs"
              >
                {{ model.params }}
              </Tag>
              <!-- 分类标签 -->
              <Tag
                class="absolute top-3 left-3 !rounded-full !bg-white/20 !border-white/30 !text-white !px-2 !text-xs"
              >
                {{ model.category }}
              </Tag>
            </div>

            <!-- 卡片内容 -->
            <div class="p-4">
              <!-- 模型名称 -->
              <Tooltip :title="model.name">
                <h3
                  class="font-semibold text-gray-900 truncate mb-2 group-hover:text-blue-600 transition-colors text-sm"
                >
                  {{ model.name }}
                </h3>
              </Tooltip>

              <!-- 简介 - 最多三行，悬浮显示全部 -->
              <Tooltip :title="model.description" placement="bottom">
                <p class="model-description text-xs text-gray-500 mb-3">
                  {{ model.description }}
                </p>
              </Tooltip>

              <!-- 更新时间 -->
              <div
                class="flex items-center text-xs text-gray-400 pt-3 border-t border-gray-100"
              >
                <RotateCw class="size-3 mr-1.5" />
                <span>更新于 {{ model.updateTime }}</span>
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
        class="fn-list-pagination flex items-center justify-center mt-6"
      >
        <Pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="filteredModels.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['12', '24', '48']"
        />
      </div>
    </div>
  </ListPageLayout>
</template>

<style scoped>
/* 模型简介三行截断 */
.model-description {
  display: -webkit-box;
  min-height: 54px;
  overflow: hidden;
  -webkit-line-clamp: 3;
  line-height: 1.5;
  -webkit-box-orient: vertical;
}

/* 卡片悬浮效果 */
.model-card:hover {
  transform: translateY(-4px);
}

/* 渐变背景悬浮增强 */
.model-card:hover .bg-gradient-to-br {
  filter: brightness(1.1);
}

/* 卡片边框光效 */
.model-card {
  position: relative;
}

.model-card::before {
  position: absolute;
  inset: 0;
  padding: 1px;
  content: '';
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgb(255 255 255 / 30%) 50%,
    transparent 60%
  );
  border-radius: inherit;
  opacity: 0;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  transition: opacity 0.3s;
}

.model-card:hover::before {
  opacity: 1;
}
</style>
