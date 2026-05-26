<script setup lang="ts">
import { Button, Card, Drawer, Form, FormItem, Input, Popconfirm, Space, Table, Tag } from 'ant-design-vue';
import { ref } from 'vue';
const visible = ref(false);
const selected = ref<number[]>([]);
const rows = ref([
  { id: 1, user: 'a01', role: '租户管理员', status: '正常', tenant: 'test01', email: 'a01@example.com', created: '2026-03-10 03:32:24' },
  { id: 2, user: 'a02', role: '算法用户', status: '正常', tenant: 'test01', email: 'a02@example.com', created: '2026-04-18 10:11:00' },
]);
const keyword = ref('');
const form = ref({ user: '', email: '', role: '算法用户' });
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input v-model:value="keyword" placeholder="请输入用户" style="width: 220px" />
        <Button type="primary" @click="visible = true">添加用户</Button>
        <Button :disabled="selected.length === 0">支付方式绑定</Button>
        <Button>筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </Card>
    <Card title="用户列表">
      <Table
        row-key="id"
        :row-selection="{ selectedRowKeys: selected, onChange: (keys: any[]) => (selected = keys) }"
        :data-source="rows.filter((r)=>!keyword || r.user.includes(keyword))"
        :columns="[
        { title: '用户', dataIndex: 'user' }, { title: '角色', dataIndex: 'role' }, { title: '状态', dataIndex: 'status' },
        { title: '租户/别名', dataIndex: 'tenant' }, { title: '邮箱', dataIndex: 'email' }, { title: '创建时间', dataIndex: 'created' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex==='role'"><Tag :color="record.role==='租户管理员'?'blue':'default'">{{record.role}}</Tag></template>
          <template v-else-if="column.dataIndex==='status'"><Tag color="success">{{record.status}}</Tag></template>
          <template v-else-if="column.dataIndex==='action'"><Space :size="0"><a>编辑</a><Popconfirm title="确认重置密码？"><a>修改密码</a></Popconfirm></Space></template>
        </template>
      </Table>
    </Card>
    <Drawer v-model:open="visible" title="添加用户" placement="right" width="420">
      <Form layout="vertical" :model="form">
        <FormItem label="用户" required><Input v-model:value="form.user" /></FormItem>
        <FormItem label="邮箱" required><Input v-model:value="form.email" /></FormItem>
        <FormItem label="角色" required><Input v-model:value="form.role" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="visible = false">取消</Button><Button type="primary">确认</Button></Space></template>
    </Drawer>
  </div>
</template>
