<script setup lang="ts">
import { ref } from 'vue';

import { Button, Card, Input, Space, Table, Tag } from 'ant-design-vue';

const keyword = ref('');
const rows = ref([
  {
    id: 'TM-001',
    name: 'terminal-test01-1',
    runtime: 'JupyterLab',
    status: '运行中',
    endpoint: 'https://terminal.demo/1',
    created: '2026-05-26 10:20',
  },
  {
    id: 'TM-002',
    name: 'terminal-test01-2',
    runtime: 'VSCode',
    status: '已停止',
    endpoint: '-',
    created: '2026-05-25 13:00',
  },
]);
</script>

<template>
  <div class="min-h-full bg-gray-50 p-4">
    <Card class="mb-4">
      <Space wrap>
        <Input
          v-model:value="keyword"
          placeholder="搜索终端名称/ID"
          style="width: 260px"
        />
        <Button type="primary">创建云终端</Button>
        <Button>筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </Card>
    <Card title="云终端列表">
      <Table
        row-key="id"
        :data-source="
          rows.filter((r) => !keyword || `${r.id}${r.name}`.includes(keyword))
        "
        :columns="[
          { title: '名称/ID', dataIndex: 'name' },
          { title: '运行环境', dataIndex: 'runtime' },
          { title: '状态', dataIndex: 'status' },
          { title: '访问地址', dataIndex: 'endpoint' },
          { title: '创建时间', dataIndex: 'created' },
          { title: '操作', dataIndex: 'action' },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="record.status === '运行中' ? 'success' : 'default'">
              {{ record.status }}
            </Tag>
          </template>
          <template v-else-if="column.dataIndex === 'action'">
            <Space :size="0">
              <a>进入</a><a>停止</a><a class="text-red-500">删除</a>
            </Space>
          </template>
        </template>
      </Table>
    </Card>
  </div>
</template>
