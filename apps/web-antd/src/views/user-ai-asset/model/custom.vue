<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Input, Pagination, Popconfirm, Space, Table, Tag, Drawer, Form, FormItem, Select, message } from 'ant-design-vue';
import { Search, Inbox, Plus, Trash2 } from '@vben/icons';

const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);
const selectedRowKeys = ref<number[]>([]);
const drawerVisible = ref(false);
const form = ref({ name: '', type: '', version: '', spec: '' });

const columns = [
  { title: '模型名称', dataIndex: 'name', width: 250 },
  { title: '模型类型', dataIndex: 'type', width: 120 },
  { title: '版本', dataIndex: 'version', width: 100 },
  { title: '资源规格', dataIndex: 'spec', width: 150 },
  { title: '更新时间', dataIndex: 'updated', width: 180 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '操作', dataIndex: 'action', width: 180 },
];

const dataSource = ref([
  { id: 1, name: 'MyQwen-Finetuned', type: '大语言模型', version: 'v0.3', spec: 'A800 80GB', updated: '2026-05-24 15:20', status: '审核中' },
  { id: 2, name: 'Custom-Llama3-Chat', type: '大语言模型', version: 'v0.1', spec: 'A100 40GB', updated: '2026-05-23 09:15', status: '可用' },
  { id: 3, name: 'MyGLM-LoRA', type: '大语言模型', version: 'v0.2', spec: 'A10 24GB', updated: '2026-05-22 14:00', status: '可用' },
]);

const statusColor: Record<string, string> = {
  '可用': 'success',
  '审核中': 'processing',
  '审核失败': 'error',
};

const notify = (text: string) => message.success(text);

function handleImport() {
  drawerVisible.value = true;
}

function handleSave() {
  notify('导入模型成功（原型）');
  drawerVisible.value = false;
}

function handleDeploy(record: any) {
  notify(`部署模型 ${record.name}`);
}

function handleFinetune(record: any) {
  notify(`微调模型 ${record.name}`);
}

function handleDetail(record: any) {
  notify(`查看模型 ${record.name} 详情`);
}

function handleDelete(record: any) {
  notify(`删除模型 ${record.name}`);
}
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <Inbox class="size-5 text-purple-500" />
          <span class="text-lg font-semibold">自定义模型</span>
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
            <Button type="primary" @click="handleImport">
              <template #icon><Plus class="size-4" /></template>
              导入模型
            </Button>
            <Popconfirm
              title="确认删除选中的模型？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="notify('批量删除成功')"
            >
              <Button danger :disabled="selectedRowKeys.length === 0">
                <template #icon><Trash2 class="size-4" /></template>
                批量删除
              </Button>
            </Popconfirm>
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
              <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <Button type="link" size="small" @click="handleDetail(record)">详情</Button>
                <Button type="link" size="small" @click="handleDeploy(record)">部署</Button>
                <Button type="link" size="small" @click="handleFinetune(record)">微调</Button>
                <Popconfirm
                  title="确认删除该模型？"
                  ok-text="确认"
                  cancel-text="取消"
                  @confirm="handleDelete(record)"
                >
                  <Button type="link" size="small" danger>删除</Button>
                </Popconfirm>
              </Space>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="3"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>

      <!-- 导入模型抽屉 -->
      <Drawer
        v-model:open="drawerVisible"
        title="导入模型"
        placement="right"
        :width="480"
      >
        <Form layout="vertical" :model="form">
          <FormItem label="模型名称" required>
            <Input v-model:value="form.name" placeholder="请输入模型名称" />
          </FormItem>
          <FormItem label="模型类型" required>
            <Select v-model:value="form.type" placeholder="请选择模型类型" :options="[
              { label: '大语言模型', value: 'llm' },
              { label: '多模态模型', value: 'multimodal' },
              { label: 'Embedding模型', value: 'embedding' },
            ]" />
          </FormItem>
          <FormItem label="版本号">
            <Input v-model:value="form.version" placeholder="请输入版本号，如 v1.0" />
          </FormItem>
          <FormItem label="资源规格">
            <Select v-model:value="form.spec" placeholder="请选择资源规格" :options="[
              { label: 'A10 24GB', value: 'A10' },
              { label: 'A100 40GB', value: 'A100-40G' },
              { label: 'A100 80GB', value: 'A100-80G' },
              { label: 'A800 80GB', value: 'A800' },
              { label: 'H100 80GB', value: 'H100' },
            ]" />
          </FormItem>
        </Form>
        <template #footer>
          <Space>
            <Button @click="drawerVisible = false">取消</Button>
            <Button type="primary" @click="handleSave">导入</Button>
          </Space>
        </template>
      </Drawer>
    </div>
  </Page>
</template>
