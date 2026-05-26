<script setup lang="ts">
import { Button, Card, Drawer, Form, FormItem, Input, InputNumber, Popconfirm, Space, Table, Tag } from 'ant-design-vue';
import { ref } from 'vue';
const visible = ref(false);
const form = ref({ name: '', type: 'example.com/nfs', capacity: 5 });
const rows = ref([
  { id: 1, name: 'test', type: 'example.com/nfs', used: '5 GB', capacity: '5 GB', status: 'Bound', created: '2026-03-03 02:24:23' },
  { id: 2, name: 'cache', type: 'example.com/nfs', used: '2 GB', capacity: '10 GB', status: 'Available', created: '2026-05-22 12:02:00' },
]);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4"><Space><Button type="primary" @click="visible = true">添加PVC</Button><Button>示例</Button></Space></Card>
    <Card title="存储卷列表">
      <Table row-key="id" :data-source="rows" :columns="[
        { title: '名称', dataIndex: 'name' }, { title: '类型', dataIndex: 'type' }, { title: '已使用的量', dataIndex: 'used' },
        { title: '容量', dataIndex: 'capacity' }, { title: '状态', dataIndex: 'status' }, { title: '创建时间', dataIndex: 'created' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex==='status'"><Tag :color="record.status === 'Bound' ? 'success' : 'default'">{{record.status}}</Tag></template>
          <template v-else-if="column.dataIndex==='action'"><Space :size="0"><a>更新</a><Popconfirm title="确认删除PVC？"><a class="text-red-500">删除</a></Popconfirm></Space></template>
        </template>
      </Table>
    </Card>
    <Drawer v-model:open="visible" title="添加PVC" placement="right" width="420">
      <Form layout="vertical" :model="form">
        <FormItem label="名称" required><Input v-model:value="form.name" /></FormItem>
        <FormItem label="类型" required><Input v-model:value="form.type" /></FormItem>
        <FormItem label="容量(GB)" required><InputNumber v-model:value="form.capacity" :min="1" style="width: 100%" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="visible = false">取消</Button><Button type="primary">确认</Button></Space></template>
    </Drawer>
  </div>
</template>
