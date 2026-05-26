<script setup lang="ts">
import { Button, Input, Select, Space, Table, Tag } from 'ant-design-vue';
import { ref } from 'vue';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const category = ref<string>();
const sortBy = ref('input');
const order = ref('desc');
const keyword = ref('');
const rows = ref([
  { id: 1, name: 'chat-qwen2', category: '文本生成', inputPrice: 0.002, outputPrice: 0.006, calls: 1203, owner: '平台', created: '2026-05-02' },
  { id: 2, name: 'vision-ocr', category: '视觉识别', inputPrice: 0.001, outputPrice: 0.002, calls: 873, owner: '平台', created: '2026-05-10' },
]);
</script>

<template>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Select v-model:value="category" placeholder="选择分类" allow-clear style="width: 140px" :options="['文本生成','代码生成','视觉识别','语音处理'].map((v)=>({label:v,value:v}))" />
        <Select v-model:value="sortBy" style="width: 140px" :options="[{label:'输入价格',value:'input'},{label:'输出价格',value:'output'},{label:'创建时间',value:'created'},{label:'调用次数',value:'calls'}]" />
        <Select v-model:value="order" style="width: 100px" :options="[{label:'升序',value:'asc'},{label:'降序',value:'desc'}]" />
        <Input v-model:value="keyword" placeholder="搜索服务名/模型名" style="width: 220px" />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="category = undefined; sortBy = 'input'; order = 'desc'; keyword = ''">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button>批量导入</Button>
      <Button>批量导出</Button>
      <Button>刷新</Button>
    </template>

      <Table
        row-key="id"
        :data-source="rows.filter((r)=>!category || r.category===category).filter((r) => !keyword || r.name.includes(keyword))"
        :columns="[
          { title: '服务名称', dataIndex: 'name' },
          { title: '分类', dataIndex: 'category' },
          { title: '输入价格(¥/1K token)', dataIndex: 'inputPrice' },
          { title: '输出价格(¥/1K token)', dataIndex: 'outputPrice' },
          { title: '调用次数', dataIndex: 'calls' },
          { title: '发布用户', dataIndex: 'owner' },
          { title: '创建时间', dataIndex: 'created' },
        ]"
      >
        <template #bodyCell="{ column, record }"><template v-if="column.dataIndex==='category'"><Tag color="blue">{{record.category}}</Tag></template></template>
      </Table>
  </ListPageLayout>
</template>
