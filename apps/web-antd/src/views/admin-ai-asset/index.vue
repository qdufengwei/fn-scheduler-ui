<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Col, Row, Tabs } from 'ant-design-vue';

const activeTab = ref('preset');
const presetModels = ref([
  { id: 1, name: 'Qwen3-4B-Thinking-2507', description: '推理增强模型，具备思维链能力。', updateTime: '2026-03-30 05:46:07' },
  { id: 2, name: 'Llama3.3-70B-Instruct', description: '70B 参数指令模型，支持多语言与长上下文。', updateTime: '2026-03-30 05:46:07' },
  { id: 3, name: 'DeepSeek-R1-Distill-Llama-8B', description: '蒸馏模型，适配推理场景。', updateTime: '2026-03-30 05:46:07' },
]);
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Card :bordered="false" class="shadow-sm">
        <div class="mb-4 text-lg font-semibold">AI资产管理</div>
        <Tabs v-model:activeKey="activeTab">
          <Tabs.TabPane key="preset" tab="预置模型">
            <Row :gutter="16">
              <Col v-for="model in presetModels" :key="model.id" :span="8">
                <Card class="mb-4" :bordered="true">
                  <div class="font-medium">{{ model.name }}</div>
                  <div class="mt-2 text-xs text-gray-500">{{ model.description }}</div>
                  <div class="mt-3 text-xs text-gray-400">{{ model.updateTime }}</div>
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
          <Tabs.TabPane key="custom" tab="自定义模型">
            <div class="py-10 text-center text-gray-400">暂无自定义模型</div>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    </div>
  </Page>
</template>
