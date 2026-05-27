<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Form, FormItem, Input, Pagination, Segmented, Space, Table, Tag, message } from 'ant-design-vue';
import { ref } from 'vue';
import { Plus } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';

const tab = ref('preset');
const keyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const form = ref({ name: '', version: '' });

const rows = ref([
  { id: 1, name: 'Qwen2-7B-Instruct', version: 'v1.2', source: '预置', status: '已发布' },
  { id: 2, name: 'Llama3-8B-CN', version: 'v0.9', source: '自定义', status: '草稿' },
  { id: 3, name: 'ChatGLM3-6B', version: 'v1.0', source: '预置', status: '已发布' },
]);

const notify = (text: string) => message.success(text);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[420px]!',
  title: '导入模型',
});
</script>

<template>
  <div>
  <ListPageLayout>
    <template #filters>
      <div class="flex flex-wrap items-center gap-4">
        <Input v-model:value="keyword" placeholder="搜索模型名称" style="width: 260px" />
      </div>
    </template>

    <template #filterActions>
      <Space>
        <Button type="primary">筛选</Button>
        <Button @click="keyword = ''">重置</Button>
      </Space>
    </template>

    <template #toolbar>
      <Button type="primary" @click="createDrawerApi.open()">
        <template #icon><Plus class="size-4" /></template>
        导入模型
      </Button>
      <Button @click="notify('刷新成功')">刷新</Button>
    </template>

    <template #viewSwitch>
      <Segmented v-model:value="tab" :options="[{ label: '预置模型', value: 'preset' }, { label: '自定义模型', value: 'custom' }]" />
    </template>

    <Table
      row-key="id"
      :data-source="rows.filter((r) => !keyword || r.name.includes(keyword)).filter((r) => tab === 'preset' ? r.source === '预置' : r.source !== '预置')"
      :pagination="false"
      :columns="[
        { title: '模型名称', dataIndex: 'name' },
        { title: '版本', dataIndex: 'version' },
        { title: '来源', dataIndex: 'source' },
        { title: '状态', dataIndex: 'status' },
        { title: '操作', dataIndex: 'action' },
      ]"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
        </template>
        <template v-if="column.dataIndex === 'source'">
          <Tag :color="record.source === '预置' ? 'blue' : 'default'" class="rounded-full">
            {{ record.source }}
          </Tag>
        </template>
        <template v-if="column.dataIndex === 'status'">
          <Tag :color="record.status === '已发布' ? 'success' : 'default'" class="rounded-full">
            {{ record.status }}
          </Tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <Space :size="0">
            <a @click="notify(`部署模型 ${record.name}`)">部署</a>
            <a @click="notify(`编辑模型 ${record.name}`)">编辑</a>
          </Space>
        </template>
      </template>
    </Table>

    <div class="fn-list-pagination flex items-center justify-end">
      <Pagination
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="rows.length"
        :show-size-changer="true"
        :show-quick-jumper="true"
        :page-size-options="['10', '20', '50', '100']"
      />
    </div>
  </ListPageLayout>

  <CreateDrawer>
    <Form layout="vertical" :model="form">
      <FormItem label="模型名称" required>
        <Input v-model:value="form.name" placeholder="请输入模型名称" />
      </FormItem>
      <FormItem label="版本" required>
        <Input v-model:value="form.version" placeholder="请输入版本号" />
      </FormItem>
    </Form>
    <template #footer>
      <Space>
        <Button @click="createDrawerApi.close()">取消</Button>
        <Button type="primary" @click="notify('已提交导入模型'); createDrawerApi.close()">确认</Button>
      </Space>
    </template>
  </CreateDrawer>

  </div>
</template>
