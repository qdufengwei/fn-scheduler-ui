<script setup lang="ts">
import { Button, Card, Col, Drawer, Dropdown, Form, FormItem, Input, Menu, Popconfirm, Row, Select, Space, Table, Tag } from 'ant-design-vue';
import { ref } from 'vue';
const visible = ref(false);
const userFilter = ref<string>();
const form = ref({ name: '', scope: '推理调用' });
const rows = ref([
  { id: 'ak_live_001', name: 'default-infer', perm: '推理调用', status: '运行', owner: 'test01', created: '2026-05-21', lastUsed: '2026-05-26', bindJobs: 2 },
  { id: 'ak_test_002', name: 'tmp-key', perm: '只读', status: '禁用', owner: 'test01', created: '2026-05-01', lastUsed: '-', bindJobs: 0 },
]);

const resetFilters = () => {
  userFilter.value = undefined;
};
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Row :gutter="12" class="mb-4">
      <Col :span="6"><Card>API KEY总数：2</Card></Col>
      <Col :span="6"><Card>活跃API KEY：1</Card></Col>
      <Col :span="6"><Card>最近30天调用：0</Card></Col>
      <Col :span="6"><Card>平均延迟：0毫秒</Card></Col>
    </Row>
    <Card class="mb-4">
      <Space>
        <Select v-model:value="userFilter" allow-clear style="width: 180px" :options="[{label:'test01',value:'test01'}]" placeholder="请选择用户" />
        <Button type="primary" @click="visible = true">创建API KEY</Button>
        <Button>示例</Button>
        <Button>筛选</Button>
        <Button @click="resetFilters">重置</Button>
      </Space>
    </Card>
    <Card title="API KEY列表">
      <Table row-key="id" :data-source="rows.filter((r)=>!userFilter || r.owner===userFilter)" :columns="[
        { title: '名称/ID', dataIndex: 'name' }, { title: '权限', dataIndex: 'perm' }, { title: '状态', dataIndex: 'status' },
        { title: '所属用户', dataIndex: 'owner' }, { title: '创建时间', dataIndex: 'created' }, { title: '最近使用时间', dataIndex: 'lastUsed' },
        { title: '绑定推理任务数量', dataIndex: 'bindJobs' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex==='name'">
            <div>{{ record.name }}</div>
            <div class="text-xs text-gray-500">{{ record.id }}</div>
          </template>
          <template v-if="column.dataIndex==='status'"><Tag :color="record.status==='运行'?'success':'default'">{{record.status}}</Tag></template>
          <template v-else-if="column.dataIndex==='action'">
            <Space :size="0">
              <a>编辑</a>
              <a>{{ record.status === '运行' ? '禁用' : '启用' }}</a>
              <Dropdown>
                <a>更多</a>
                <template #overlay>
                  <Menu>
                    <Menu.Item key="copy">复制KEY</Menu.Item>
                    <Menu.Item key="rotate">轮转密钥</Menu.Item>
                    <Menu.Item key="delete"><Popconfirm title="确认删除API KEY？"><span class="text-red-500">删除</span></Popconfirm></Menu.Item>
                  </Menu>
                </template>
              </Dropdown>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
    <Drawer v-model:open="visible" title="创建API KEY" placement="right" width="420">
      <Form layout="vertical" :model="form">
        <FormItem label="名称" required><Input v-model:value="form.name" /></FormItem>
        <FormItem label="权限" required><Select v-model:value="form.scope" :options="[{label:'推理调用',value:'推理调用'},{label:'只读',value:'只读'}]" /></FormItem>
      </Form>
      <template #footer><Space><Button @click="visible = false">取消</Button><Button type="primary">创建</Button></Space></template>
    </Drawer>
  </div>
</template>
