<script setup lang="ts">
import { Button, Card, Col, Input, Row, Space } from 'ant-design-vue';
import { ref, computed } from 'vue';
import { RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

// 筛选条件
const keyword = ref('');

// 预置模型数据
const presetModels = ref([
  {
    id: 1,
    name: 'Qwen3-4B-Thinking-2507',
    description: 'Qwen3-4B-Thinking-2507是阿里巴巴的推理增强模型，具有思维链能力。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 2,
    name: 'Qwen3-30B-A3B-Instruct-2507',
    description: 'Qwen3-30B-A3B-Instruct-2507是阿里巴巴的指令调优模型，具有优化的架构，可实现均衡的效能。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 3,
    name: 'Llama-4-Scout-17B-16E-Instruct',
    description: 'Llama-4-Scout-17B-16E-Instruct 是一款原生多模态人工智慧模型，具备优异的文字处理与多模态互动能力。该模型采用 16 个专家模组的混合专家（MoE）架构，在文字与图像理解领域展现出业界领先的效能。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 4,
    name: 'Llama3.3-70B-Instruct',
    description: 'Llama-3.3-70B-Instruct 是 Meta 开源的 700 亿参数纯文字指令微调模型，支援 8 种语言与 128K 上下文视窗。采用 GQA 技术，效能堪比 Llama3.1-4050B，支援免费商用。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 5,
    name: 'Llama3.2-3B-Instruct',
    description: 'Llama-3.2-3B-Instruct 系由一系列预训练及指令微调的生成式模型所组成，具备 3B 参数（文字输入 / 文字输出）。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 6,
    name: 'DeepSeek-Prover-V2-671B',
    description: 'DeepSeek-Prover-V2-671B是DeepSeek AI开发的一种高级开源语言模型，具有670亿个参数。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 7,
    name: 'DeepSeek-R1-Distill-Llama-70B',
    description: 'DeepSeek-R1-Distill-Lama-70B是DeepSeek开发的大型语言模型（LLM）的知识蒸馏版本，基于Llama架构，并利用DeepSeeker R1生成的数据（671B参数）进行微调。',
    updateTime: '2026-03-30 05:46:07',
  },
  {
    id: 8,
    name: 'DeepSeek-R1-Distill-Llama-8B',
    description: 'DeepSeek-R1-Distill模型是基于开源模型，使用DeepSeek-R1生成的样本进行微调的。',
    updateTime: '2026-03-30 05:46:07',
  },
]);

// 筛选后的数据
const filteredModels = computed(() => {
  if (!keyword.value) return presetModels.value;
  return presetModels.value.filter((model) =>
    model.name.toLowerCase().includes(keyword.value.toLowerCase()),
  );
});

function handleFilter() {
  // 筛选逻辑已在computed中处理
}

function handleReset() {
  keyword.value = '';
}

function handleRefresh() {
  // 刷新逻辑
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
      <Space>
        <Button type="primary" @click="handleFilter">筛选</Button>
        <Button @click="handleReset">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button @click="handleRefresh">
        <template #icon><RotateCw class="size-4" /></template>
        刷新
      </Button>
    </template>

    <!-- 卡片列表 -->
    <div class="p-4">
      <Row :gutter="[16, 16]">
        <Col v-for="model in filteredModels" :key="model.id" :span="6">
          <Card
            class="cursor-pointer hover:border-blue-300 hover:shadow-md transition-all h-full"
            :bordered="true"
          >
            <div class="flex flex-col gap-2">
              <div class="font-medium text-blue-600">{{ model.name }}</div>
              <div class="text-xs text-gray-500 line-clamp-3" style="min-height: 48px;">
                {{ model.description }}
              </div>
              <div class="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <span>更新于 {{ model.updateTime }}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </ListPageLayout>
</template>