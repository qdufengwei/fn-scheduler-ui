<script setup lang="ts">
import { Button, Card, Drawer, Form, FormItem, Input, Popconfirm, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
const visible = ref(false);
const rows = ref([
  { id: 'DV-001', owner: '张三', spec: '8C32G + A10', expire: '2026-06-30', status: '运行中' },
  { id: 'DV-002', owner: '李四', spec: '16C64G + H100', expire: '2026-05-28', status: '即将到期' },
]);
const form = ref({ owner: '', spec: '' });
const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4"><Space><Button type="primary" @click="visible = true">创建开发机</Button><Button>筛选</Button></Space></Card>
    <Card title="开发机">
      <Table row-key="id" :data-source="rows" :columns="[
        { title: '实例ID', dataIndex: 'id' }, { title: '归属人', dataIndex: 'owner' }, { title: '规格', dataIndex: 'spec' },
        { title: '到期时间', dataIndex: 'expire' }, { title: '状态', dataIndex: 'status' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag :color="record.status === '即将到期' ? 'warning' : 'processing'">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'"><Space><a @click="notify(`查看开发机 ${record.id}`)">详情</a><a @click="notify(`续期开发机 ${record.id}`)">续期</a><Popconfirm title="确认删除开发机？" @confirm="notify(`删除开发机 ${record.id}`)"><a class="text-red-500">删除</a></Popconfirm></Space></template>
        </template>
      </Table>
    </Card>
    <Drawer v-model:open="visible" title="创建开发机" placement="right" width="420">
      <Form layout="vertical" :model="form">
        <FormItem label="归属人" required><Input v-model:value="form.owner" /></FormItem>
        <FormItem label="规格" required><Input v-model:value="form.spec" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="visible = false">取消</Button><Button type="primary" @click="notify('已提交创建开发机（原型）')">确认</Button></Space></template>
    </Drawer>
  </div>
</template>
