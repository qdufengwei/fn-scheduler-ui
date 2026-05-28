<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import {
  Button,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'ant-design-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, RotateCw } from '@vben/icons';

import ListPageLayout from '#/components/business/list-page-layout.vue';
import { showNotify } from '#/utils/notify';

const router = useRouter();
const keyword = ref('');
const selected = ref<string[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);

const rows = ref([
  {
    id: 'FT-1001',
    name: '客服场景微调',
    model: 'Qwen2-7B',
    status: '运行中',
    ready: 'Ready',
    duration: '1h 10m',
    created: '2026-05-26 11:20',
    instances: 2,
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'FT-1002',
    name: '法务语料微调',
    model: 'Llama3-8B',
    status: '成功',
    ready: 'Ready',
    duration: '3h 40m',
    created: '2026-05-25 14:03',
    instances: 1,
    gpu: 2,
    spec: 'A10',
  },
  {
    id: 'FT-1003',
    name: '医疗问答微调',
    model: 'ChatGLM3-6B',
    status: '排队中',
    ready: 'NotReady',
    duration: '-',
    created: '2026-05-27 09:00',
    instances: 1,
    gpu: 4,
    spec: 'A800',
  },
  {
    id: 'FT-1004',
    name: '代码助手微调',
    model: 'DeepSeek-Coder-33B',
    status: '失败',
    ready: 'NotReady',
    duration: '0h 45m',
    created: '2026-05-24 08:30',
    instances: 2,
    gpu: 8,
    spec: 'A100',
  },
]);

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '创建微调任务',
});

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    运行中: 'processing',
    成功: 'success',
    失败: 'error',
    排队中: 'default',
  };
  return colorMap[status] || 'default';
};
</script>

<template>
  <div>
    <ListPageLayout>
      <template #filters>
        <div class="flex flex-wrap items-center gap-4">
          <Input
            v-model:value="keyword"
            placeholder="搜索任务ID/模型名/任务名"
            style="width: 280px"
            allow-clear
          />
        </div>
      </template>

      <template #filterActions>
        <Space>
          <Button type="primary">筛选</Button>
          <Button @click="keyword = ''">重置</Button>
        </Space>
      </template>

      <template #toolbar>
        <Button
          type="primary"
          @click="router.push('/user-task/latest/finetune/create')"
        >
          <template #icon><Plus class="size-4" /></template>
          创建微调任务
        </Button>
        <Button @click="showNotify('刷新成功')">
          <template #icon><RotateCw class="size-4" /></template>
          刷新
        </Button>
        <Popconfirm
          title="确认删除选中的任务？"
          @confirm="showNotify(`已删除 ${selected.length} 个任务`)"
          :disabled="selected.length === 0"
        >
          <Button danger :disabled="selected.length === 0">批量删除</Button>
        </Popconfirm>
      </template>

      <Table
        row-key="id"
        :row-selection="{
          selectedRowKeys: selected,
          onChange: (keys: any[]) => (selected = keys),
        }"
        :data-source="
          rows.filter(
            (r) => !keyword || `${r.id}${r.model}${r.name}`.includes(keyword),
          )
        "
        :pagination="false"
        :columns="[
          { title: '任务名称', dataIndex: 'name' },
          { title: '任务ID', dataIndex: 'id' },
          { title: '状态', dataIndex: 'status' },
          { title: '模型名称', dataIndex: 'model' },
          { title: '就绪状态', dataIndex: 'ready' },
          { title: '运行时长', dataIndex: 'duration' },
          { title: '实例数', dataIndex: 'instances' },
          { title: 'GPU数', dataIndex: 'gpu' },
          { title: '资源规格', dataIndex: 'spec' },
          { title: '创建时间', dataIndex: 'created' },
          { title: '操作', dataIndex: 'action' },
        ]"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a class="text-blue-600 hover:text-blue-700">{{ record.name }}</a>
          </template>
          <template v-if="column.dataIndex === 'status'">
            <Tag :color="getStatusColor(record.status)" class="rounded-full">
              {{ record.status }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'ready'">
            <Tag
              :color="record.ready === 'Ready' ? 'success' : 'warning'"
              class="rounded-full"
            >
              {{ record.ready }}
            </Tag>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space :size="12">
              <a @click="showNotify(`查看微调任务 ${record.id}`)">详情</a>
              <a
                :class="{
                  'pointer-events-none text-gray-300':
                    record.status !== '运行中',
                }"
                @click="
                  record.status === '运行中' &&
                  showNotify(`停止微调任务 ${record.id}`)
                "
              >
                停止
              </a>
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
      <div class="text-center text-gray-400 py-8">
        创建微调任务表单（原型演示）
      </div>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button
            type="primary"
            @click="
              showNotify('已提交创建微调任务');
              createDrawerApi.close();
            "
          >
            确认
          </Button>
        </Space>
      </template>
    </CreateDrawer>
  </div>
</template>
