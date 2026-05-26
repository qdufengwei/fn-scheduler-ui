<script setup lang="ts">
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Checkbox, Input, Pagination, Popconfirm, Select, Space, Table, Tabs, Tag, message } from 'ant-design-vue';
import { Inbox, List, ListOrdered, RotateCw, Search, Settings, Square, X } from '@vben/icons';

const activeMainTab = ref('latest');
const activeSubTab = ref('training');
const selectedTenant = ref<string>();
const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

// 训练任务表格配置
const trainingColumns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '名称/ID', dataIndex: 'name', width: 200, fixed: 'left' as const },
  { title: '任务类型', dataIndex: 'taskType', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '就绪状态', dataIndex: 'readyStatus', width: 80 },
  { title: '运行时长', dataIndex: 'runTime', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: '任务优先级', dataIndex: 'priority', width: 150 },
  { title: '回收策略', dataIndex: 'recyclePolicy', width: 100 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const trainingData = ref([
  { id: 1, name: 'test', taskId: 'job-254ce4873fa7-20260523232921', taskType: 'CPU', status: '运行中', readyStatus: '1/1', runTime: '61h 21m 24s', createTime: '2026-05-23 15:29:21', instances: 1, priority: 'high-priority-job', recyclePolicy: '可回收', gpuCount: 0, resourceSpec: '-', user: 'lzj-1', tenant: 'qiji' },
  { id: 2, name: 'cpu6', taskId: 'job-0482129d4b7b-20260415210402', taskType: 'CPU', status: '运行中', readyStatus: '1/1', runTime: '975h 37m 5s', createTime: '2026-04-15 13:04:03', instances: 1, priority: 'high-priority-job', recyclePolicy: '可回收', gpuCount: 0, resourceSpec: '-', user: 'user415', tenant: 'zjw415' },
  { id: 3, name: '123', taskId: 'job-473d0f3c98dd-20260415205154', taskType: 'Simple', status: '停止', readyStatus: '0/1', runTime: '300h 43m 37s', createTime: '2026-04-15 12:51:54', instances: 1, priority: 'high-priority-job', recyclePolicy: '可回收', gpuCount: 1, resourceSpec: 'NVIDIA-GPU-HBM2E-80GB', user: 'test-0415', tenant: 'test-0415' },
  { id: 4, name: 'test2', taskId: 'job-cfd9413b035d-20260415203555', taskType: 'MPI', status: '排队中', readyStatus: '0/2', runTime: '0h 0m 0s', createTime: '2026-04-15 12:35:55', instances: 2, priority: 'high-priority-job', recyclePolicy: '可回收', gpuCount: 0, resourceSpec: '-', user: 'test-0415', tenant: 'test-0415' },
  { id: 5, name: 'test', taskId: 'job-da5d258fcdd0-20260415203536', taskType: 'MPI', status: '排队中', readyStatus: '0/2', runTime: '0h 0m 0s', createTime: '2026-04-15 12:35:36', instances: 2, priority: 'high-priority-job', recyclePolicy: '可回收', gpuCount: 0, resourceSpec: '-', user: 'test-0415', tenant: 'test-0415' },
]);

// 模型微调表格配置
const finetuneColumns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '名称/ID', dataIndex: 'name', width: 200, fixed: 'left' as const },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '模型名称', dataIndex: 'modelName', width: 180 },
  { title: '就绪状态', dataIndex: 'readyStatus', width: 80 },
  { title: '运行时长', dataIndex: 'runTime', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const finetuneData = ref<any[]>([]);

// 推理服务表格配置
const inferenceColumns = [
  { title: '', dataIndex: 'checkbox', width: 40, fixed: 'left' as const },
  { title: '名称/ID', dataIndex: 'name', width: 200, fixed: 'left' as const },
  { title: '模型名称', dataIndex: 'modelName', width: 180 },
  { title: '推理框架', dataIndex: 'framework', width: 100 },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '就绪状态', dataIndex: 'readyStatus', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: 'GPU数量', dataIndex: 'gpuCount', width: 80 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: '当前副本数', dataIndex: 'replicas', width: 100 },
  { title: '实例数量', dataIndex: 'instances', width: 80 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const inferenceData = ref<any[]>([]);

// 开发机表格配置
const devboxColumns = [
  { title: '名称/ID', dataIndex: 'name', width: 250, fixed: 'left' as const },
  { title: '状态', dataIndex: 'status', width: 100 },
  { title: '类型', dataIndex: 'type', width: 100 },
  { title: '资源规格', dataIndex: 'resourceSpec', width: 200 },
  { title: 'GPU', dataIndex: 'gpu', width: 60 },
  { title: 'CPU', dataIndex: 'cpu', width: 60 },
  { title: '用户', dataIndex: 'user', width: 100 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '操作', dataIndex: 'action', width: 80, fixed: 'right' as const },
];

const devboxData = ref([
  { id: 1, name: '测试1', taskId: 'job-30261777db2f-20260428013313', status: '排队中', type: 'Jupyter', resourceSpec: '-', gpu: 0, cpu: 4, user: 'a01', tenant: 'test01', createTime: '2026-04-28 01:33:13' },
]);

const statusColor: Record<string, string> = {
  '运行中': 'processing',
  '停止': 'default',
  '排队中': 'warning',
  '成功': 'success',
  '失败': 'error',
};

const notify = (text: string) => message.success(text);

const getSearchPlaceholder = () => {
  switch (activeSubTab.value) {
    case 'finetune': return '支持模糊搜索模型微调名称/ID';
    case 'inference': return '支持模糊搜索推理服务名称/ID';
    default: return '支持模糊搜索任务名称/ID';
  }
};
</script>

<template>
  <Page auto-content-height>
    <div class="p-4">
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <List class="size-5 text-blue-500" />
          <span class="text-lg font-semibold">任务中心</span>
        </div>

        <!-- 主tabs: 最新任务、任务模板、任务回收站 -->
        <Tabs v-model:activeKey="activeMainTab" class="mb-4">
          <Tabs.TabPane key="latest">
            <template #tab>
              <div class="flex items-center gap-1">
                <ListOrdered class="size-4" />
                <span>最新任务</span>
              </div>
            </template>
          </Tabs.TabPane>
          <Tabs.TabPane key="template">
            <template #tab>
              <div class="flex items-center gap-1">
                <Inbox class="size-4" />
                <span>任务模板</span>
              </div>
            </template>
          </Tabs.TabPane>
          <Tabs.TabPane key="recycle">
            <template #tab>
              <div class="flex items-center gap-1">
                <span>任务回收站</span>
              </div>
            </template>
          </Tabs.TabPane>
        </Tabs>

        <!-- 子tabs: 训练任务、模型微调、推理服务、开发机 -->
        <Tabs v-model:activeKey="activeSubTab" class="mb-4">
          <Tabs.TabPane key="training">
            <template #tab>
              <div class="flex items-center gap-1">
                <Settings class="size-4" />
                <span>训练任务</span>
              </div>
            </template>
          </Tabs.TabPane>
          <Tabs.TabPane key="finetune">
            <template #tab>
              <div class="flex items-center gap-1">
                <Settings class="size-4" />
                <span>模型微调</span>
              </div>
            </template>
          </Tabs.TabPane>
          <Tabs.TabPane key="inference">
            <template #tab>
              <div class="flex items-center gap-1">
                <Square class="size-4" />
                <span>推理服务</span>
              </div>
            </template>
          </Tabs.TabPane>
          <Tabs.TabPane key="devbox">
            <template #tab>
              <div class="flex items-center gap-1">
                <List class="size-4" />
                <span>开发机</span>
              </div>
            </template>
          </Tabs.TabPane>
        </Tabs>

        <!-- 筛选栏 -->
        <div class="flex items-center justify-between mb-4">
          <Space>
            <Select
              v-model:value="selectedTenant"
              allow-clear
              style="width: 180px"
              placeholder="请选择租户"
              :options="[{ label: 'test01', value: 'test01' }, { label: 'test-0415', value: 'test-0415' }]"
            >
              <template #suffixIcon><Search class="size-4 text-gray-400" /></template>
            </Select>
            <Input v-model:value="searchText" :placeholder="getSearchPlaceholder()" style="width: 260px" allow-clear>
              <template #prefix><Search class="size-4 text-gray-400" /></template>
            </Input>
            <Button v-if="activeSubTab !== 'devbox'" disabled>
              <template #icon><X class="size-4" /></template>
              批量删除
            </Button>
            <Button>
              <template #icon><RotateCw class="size-4" /></template>
            </Button>
          </Space>
        </div>

        <!-- 训练任务表格 -->
        <Table
          v-if="activeSubTab === 'training'"
          row-key="id"
          :data-source="trainingData"
          :pagination="false"
          :columns="trainingColumns"
          :scroll="{ x: 1800 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'checkbox'">
              <Checkbox />
            </template>
            <template v-if="column.dataIndex === 'name'">
              <div>
                <a class="font-medium text-blue-600 hover:text-blue-700">{{ record.name }}</a>
                <div class="text-xs text-gray-400">{{ record.taskId }}</div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'taskType'">
              <Tag class="rounded-full">{{ record.taskType }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'runTime'">
              <div class="flex items-center gap-1">
                <Inbox class="size-3 text-gray-400" />
                <span>{{ record.runTime }}</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'tenant'">
              <div>
                <span>{{ record.tenant }}</span>
                <span class="text-gray-400 ml-1">-</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Popconfirm title="确认删除该任务？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除任务 ${record.name}`)">
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>

        <!-- 模型微调表格 -->
        <Table
          v-if="activeSubTab === 'finetune'"
          row-key="id"
          :data-source="finetuneData"
          :pagination="false"
          :columns="finetuneColumns"
          :scroll="{ x: 1600 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'checkbox'">
              <Checkbox />
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Popconfirm title="确认删除该任务？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除任务 ${record.name}`)">
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </template>
          </template>
          <template #emptyText>
            <div class="text-center py-8">
              <Settings class="size-12 mx-auto mb-4 text-gray-300" />
              <div class="text-gray-400 mb-2">暂无数据</div>
              <div class="text-gray-400 text-sm">当前没有记录，增加以后在此处查看数据。</div>
            </div>
          </template>
        </Table>

        <!-- 推理服务表格 -->
        <Table
          v-if="activeSubTab === 'inference'"
          row-key="id"
          :data-source="inferenceData"
          :pagination="false"
          :columns="inferenceColumns"
          :scroll="{ x: 1700 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'checkbox'">
              <Checkbox />
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Popconfirm title="确认删除该任务？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除任务 ${record.name}`)">
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </template>
          </template>
          <template #emptyText>
            <div class="text-center py-8">
              <Square class="size-12 mx-auto mb-4 text-gray-300" />
              <div class="text-gray-400 mb-2">暂无数据</div>
              <div class="text-gray-400 text-sm">当前没有记录，增加以后在此处查看数据。</div>
            </div>
          </template>
        </Table>

        <!-- 开发机表格 -->
        <Table
          v-if="activeSubTab === 'devbox'"
          row-key="id"
          :data-source="devboxData"
          :pagination="false"
          :columns="devboxColumns"
          :scroll="{ x: 1300 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div>
                <a class="font-medium text-blue-600 hover:text-blue-700">{{ record.name }}</a>
                <div class="text-xs text-gray-400">{{ record.taskId }}</div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag :color="statusColor[record.status]" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'type'">
              <Tag class="rounded-full">{{ record.type }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'tenant'">
              <div>
                <span>{{ record.tenant }}</span>
                <span class="text-gray-400 ml-1">-</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Popconfirm title="确认删除该开发机？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除开发机 ${record.name}`)">
                <Button type="link" size="small" danger>
                  删除
                </Button>
              </Popconfirm>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="activeSubTab === 'training' ? 5 : activeSubTab === 'devbox' ? 1 : 0"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>
    </div>
  </Page>
</template>