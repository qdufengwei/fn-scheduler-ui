<script setup lang="ts">
import { Button, Card, Popconfirm, Select, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = ref<string>();
const rows = ref([
  { id: 'DV-001', name: '测试1', status: '排队中', type: 'Jupyter', spec: '-', gpu: 0, cpu: 4, user: 'a01', created: '2026-04-28 01:33:13' },
]);
const notify = (text: string) => message.info(text);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space>
        <Select v-model:value="user" allow-clear placeholder="请选择用户" style="width: 180px" :options="[{ label: 'a01', value: 'a01' }, { label: 'a02', value: 'a02' }]" />
        <Button type="primary" @click="router.push('/user-task/devbox/create')">创建开发机</Button>
        <Button>筛选</Button>
        <Button @click="user = undefined">重置</Button>
      </Space>
    </Card>
    <Card title="开发机列表">
      <Table row-key="id" :data-source="rows.filter((r) => !user || r.user === user)" :columns="[
        { title: '名称/ID', dataIndex: 'name' }, { title: '状态', dataIndex: 'status' }, { title: '类型', dataIndex: 'type' },
        { title: '资源规格', dataIndex: 'spec' }, { title: 'GPU', dataIndex: 'gpu' }, { title: 'CPU', dataIndex: 'cpu' },
        { title: '用户', dataIndex: 'user' }, { title: '创建时间', dataIndex: 'created' }, { title: '操作', dataIndex: 'action' },
      ]">
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'"><Tag color="default">{{ record.status }}</Tag></template>
          <template v-else-if="column.dataIndex === 'action'">
            <Space>
              <Button type="link" size="small" @click="notify(`进入开发机 ${record.id}`)">进入</Button>
              <Button type="link" size="small" @click="notify(`保存开发机 ${record.id} 为镜像`)">保存镜像</Button>
              <Popconfirm title="确认删除开发机？" @confirm="notify(`删除开发机 ${record.id}`)"><Button type="link" danger size="small">删除</Button></Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
