<script setup lang="ts">
import { Button, Card, Drawer, Form, FormItem, Input, Space, Table, Tabs, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const tab = ref('preset');
const keyword = ref('');
const visible = ref(false);
const rows = ref([
  { id: 1, name: 'Qwen2-7B-Instruct', version: 'v1.2', source: '预置', status: '已发布' },
  { id: 2, name: 'Llama3-8B-CN', version: 'v0.9', source: '自定义', status: '草稿' },
]);
const form = ref({ name: '', version: '' });
const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Tabs v-model:activeKey="tab" class="mb-3">
        <Tabs.TabPane key="preset" tab="预置模型" />
        <Tabs.TabPane key="custom" tab="自定义模型" />
      </Tabs>
      <Space wrap><Input v-model:value="keyword" placeholder="搜索模型名称" style="width: 260px" /><Button type="primary" @click="visible = true">导入模型</Button><Button>筛选</Button><Button @click="keyword = ''">重置</Button></Space>
    </Card>
    <Card title="模型仓库">
      <Table row-key="id" :data-source="rows.filter((r) => !keyword || r.name.includes(keyword)).filter((r)=>tab==='preset'?r.source==='预置':r.source!=='预置')" :columns="[
        { title: '模型名称', dataIndex: 'name' }, { title: '版本', dataIndex: 'version' }, { title: '来源', dataIndex: 'source' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '已发布' ? 'success' : 'default'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`部署模型 ${record.name}`)">部署</a><a @click="notify(`编辑模型 ${record.name}`)">编辑</a></Space></template>
        </template>
      </Table>
    </Card>
    <Drawer v-model:open="visible" title="导入模型" placement="right" width="420">
      <Form layout="vertical" :model="form">
        <FormItem label="模型名称" required><Input v-model:value="form.name" /></FormItem>
        <FormItem label="版本" required><Input v-model:value="form.version" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="visible = false">取消</Button><Button type="primary" @click="notify('已提交导入模型（原型）')">确认</Button></Space></template>
    </Drawer>
  </div>
</template>
