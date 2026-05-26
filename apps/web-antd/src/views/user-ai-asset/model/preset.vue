<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Input, Pagination, Popconfirm, Space, Table, Tag, message } from 'ant-design-vue';
import { Search, Inbox, Plus } from '@vben/icons';

const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);
const selectedRowKeys = ref<number[]>([]);

const columns = [
  { title: '模型名称', dataIndex: 'name', width: 250 },
  { title: '模型类型', dataIndex: 'type', width: 120 },
  { title: '版本', dataIndex: 'version', width: 100 },
  { title: '资源规格', dataIndex: 'spec', width: 150 },
  { title: '更新时间', dataIndex: 'updated', width: 180 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', width: 150 },
];

const dataSource = ref([
  { id: 1, name: 'Qwen2-7B-Instruct', type: '大语言模型', version: 'v1.2', spec: 'A800 80GB', updated: '2026-05-25 10:30', status: '可用' },
  { id: 2, name: 'Llama3-8B-CN', type: '大语言模型', version: 'v1.0', spec: 'A100 40GB', updated: '2026-05-24 15:20', status: '可用' },
  { id: 3, name: 'ChatGLM3-6B', type: '大语言模型', version: 'v2.1', spec: 'A10 24GB', updated: '2026-05-23 09:15', status: '可用' },
  { id: 4, name: 'Baichuan2-13B-Chat', type: '大语言模型', version: 'v1.0', spec: 'A800 80GB', updated: '2026-05-22 14:00', status: '可用' },
  { id: 5, name: 'Yi-34B-Chat', type: '大语言模型', version: 'v1.0', spec: 'H100 80GB', updated: '2026-05-21 11:30', status: '可用' },
]);

const notify = (text: string) => message.success(text);

function handleDeploy(record: any) {
  notify(`部署模型 ${record.name}`);
}

function handleFinetune(record: any) {
  notify(`微调模型 ${record.name}`);
}

function handleDetail(record: any) {
  notify(`查看模型 ${record.name} 详情`);
}
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <Inbox class="size-5 text-blue-500" />
          <span class="text-lg font-semibold">预置模型</span>
        </div>

        <div class="flex items-center justify-between mb-4">
          <Space>
            <Input v-model:value="searchText" placeholder="支持模糊搜索模型名称" style="width: 280px" allow-clear>
              <template #prefix><Search class="size-4 text-gray-400" /></template>
            </Input>
            <Button>筛选</Button>
            <Button @click="searchText = ''">重置</Button>
          </Space>
          <Space>
            <Button type="primary" :disabled="selectedRowKeys.length === 0" @click="notify('批量部署')">
              批量部署
            </Button>
            <Button :disabled="selectedRowKeys.length === 0" @click="notify('批量微调')">
              批量微调
            </Button>
          </Space>
        </div>

        <Table
          row-key="id"
          :data-source="dataSource.filter(r => !searchText || r.name.includes(searchText))"
          :pagination="false"
          :columns="columns"
          :row-selection="{ selectedRowKeys, onChange: (keys: number[]) => selectedRowKeys = keys }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
            </template>
            <template v-if="column.dataIndex === 'type'">
              <Tag class="rounded-full">{{ record.type }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag color="success" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <Button type="link" size="small" @click="handleDetail(record)">详情</Button>
                <Button type="link" size="small" @click="handleDeploy(record)">部署</Button>
                <Button type="link" size="small" @click="handleFinetune(record)">微调</Button>
              </Space>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="5"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>
    </div>
  </Page>
</template>
