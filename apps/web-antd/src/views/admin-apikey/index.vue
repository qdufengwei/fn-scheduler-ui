<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { ref } from 'vue';
import { Page } from '@vben/common-ui';
import { Button, Card, Col, Dropdown, Input, Menu, MenuItem, Pagination, Popconfirm, Row, Select, Space, Table, Tag, Form, FormItem, message } from 'ant-design-vue';
import { Inbox, Copy, LockKeyhole, Plus, Check } from '@vben/icons';

const selectedTenant = ref<string>();
const pageSize = ref(10);
const currentPage = ref(1);

const stats = ref({
  total: 4,
  active: 4,
  calls30d: 0,
  avgLatency: 0,
});

const columns = [
  { title: '名称/ID', dataIndex: 'name', width: 200 },
  { title: '权限', dataIndex: 'permissions', width: 200 },
  { title: '状态', dataIndex: 'status', width: 80 },
  { title: '租户/别名', dataIndex: 'tenant', width: 120 },
  { title: '所属用户', dataIndex: 'owner', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', width: 180 },
  { title: '最近使用时间', dataIndex: 'lastUsedTime', width: 180 },
  { title: '绑定推理任务数量', dataIndex: 'boundTasks', width: 150 },
  { title: '操作', dataIndex: 'action', width: 180, fixed: 'right' as const },
];

const dataSource = ref([
  { id: 1, name: 'test', keyId: 'MhcrstnXjSo', permissions: ['推理服务：读取', '推理服务：写入/执行'], status: '运行', tenant: '-', owner: 'admin', createTime: '2026-04-22 02:27:14', lastUsedTime: '-', boundTasks: 0 },
  { id: 2, name: 'dsfsd', keyId: 'n3qj-UlBEMk', permissions: ['推理服务：读取', '推理服务：写入/执行'], status: '运行', tenant: '-', owner: 'admin', createTime: '2026-04-21 15:34:40', lastUsedTime: '-', boundTasks: 0 },
  { id: 3, name: 'test', keyId: 'W4l_8zz1FRE', permissions: ['推理服务：写入/执行'], status: '运行', tenant: 'test01', owner: 'test02', createTime: '2026-04-07 01:36:52', lastUsedTime: '-', boundTasks: 0 },
  { id: 4, name: 'test-key', keyId: 'Z1yrMsztuTo', permissions: ['推理服务：读取', '推理服务：写入/执行'], status: '运行', tenant: 'test01', owner: 'test01', createTime: '2026-03-03 11:21:53', lastUsedTime: '2026-03-03 19:26:51', boundTasks: 0 },
]);

const form = ref({ name: '', tenant: '', permissions: [] as string[] });

const notify = (text: string) => message.success(text);

function handleCreateKey() {
  createDrawerApi.open();
}

function handleSave() {
  notify('创建API KEY成功（原型）');
  createDrawerApi.close();
}

function copyKey(key: string) {
  navigator.clipboard.writeText(key);
  notify('已复制到剪贴板');
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '创建 API KEY',
});
</script>

<template>
  <Page auto-content-height>
    <div class="p-4 space-y-4">
      <!-- 统计卡片 -->
      <Card :bordered="false" class="shadow-sm">
        <Row :gutter="24">
          <Col :span="6">
            <div class="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
              <LockKeyhole class="size-8 mx-auto mb-3 text-blue-500" />
              <div class="text-xs text-gray-500 mb-2">API KEY总数</div>
              <div class="text-3xl font-bold text-blue-600">{{ stats.total }}</div>
            </div>
          </Col>
          <Col :span="6">
            <div class="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg border border-green-100 hover:shadow-md transition-shadow cursor-pointer">
              <Check class="size-8 mx-auto mb-3 text-green-500" />
              <div class="text-xs text-gray-500 mb-2">活跃API KEY</div>
              <div class="text-3xl font-bold text-green-600">{{ stats.active }}</div>
            </div>
          </Col>
          <Col :span="6">
            <div class="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow cursor-pointer">
              <Inbox class="size-8 mx-auto mb-3 text-purple-500" />
              <div class="text-xs text-gray-500 mb-2">最近 30 天调用</div>
              <div class="text-3xl font-bold text-purple-600">{{ stats.calls30d }}</div>
            </div>
          </Col>
          <Col :span="6">
            <div class="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg border border-orange-100 hover:shadow-md transition-shadow cursor-pointer">
              <Inbox class="size-8 mx-auto mb-3 text-orange-500" />
              <div class="text-xs text-gray-500 mb-2">平均延迟</div>
              <div class="text-3xl font-bold text-orange-600">{{ stats.avgLatency }} <span class="text-sm">毫秒</span></div>
            </div>
          </Col>
        </Row>
      </Card>

      <!-- API KEY列表 -->
      <Card :bordered="false" class="shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <Space>
            <Select
              v-model:value="selectedTenant"
              allow-clear
              style="width: 180px"
              placeholder="请选择租户"
              :options="[{ label: 'test01', value: 'test01' }, { label: 'test-0415', value: 'test-0415' }]"
            />
          </Space>
          <Space>
            <Button type="primary" @click="handleCreateKey">
              <template #icon><Plus class="size-4" /></template>
              创建API KEY
            </Button>
            <Button>示例</Button>
          </Space>
        </div>

        <Table
          row-key="id"
          :data-source="dataSource"
          :pagination="false"
          :columns="columns"
          :scroll="{ x: 1400 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'name'">
              <div>
                <span class="font-medium text-gray-800">{{ record.name }}</span>
                <div class="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <span>{{ record.keyId }}</span>
                  <Button type="link" size="small" class="p-0 h-auto" @click="copyKey(record.keyId)">
                    <Copy class="size-3" />
                  </Button>
                </div>
              </div>
            </template>
            <template v-if="column.dataIndex === 'permissions'">
              <div class="space-y-1">
                <Tag v-for="perm in record.permissions" :key="perm" class="rounded-full text-xs">{{ perm }}</Tag>
              </div>
            </template>
            <template v-if="column.dataIndex === 'status'">
              <Tag color="success" class="rounded-full">{{ record.status }}</Tag>
            </template>
            <template v-if="column.dataIndex === 'tenant'">
              <div>
                <span>{{ record.tenant }}</span>
                <span class="text-gray-400 ml-1">-</span>
              </div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <Space>
                <Button type="link" size="small" @click="notify(`禁用 ${record.name}`)">
                  禁用
                </Button>
                <Button type="link" size="small" @click="notify(`编辑 ${record.name}`)">编辑</Button>
                <Dropdown>
                  <Button type="link" size="small" class="p-0">
                    更多
                  </Button>
                  <template #overlay>
                    <Menu>
                      <MenuItem>
                        <Popconfirm title="确认删除该API KEY？" ok-text="确认" cancel-text="取消" @confirm="notify(`删除 ${record.name}`)">
                          <a class="text-red-500">删除</a>
                        </Popconfirm>
                      </MenuItem>
                    </Menu>
                  </template>
                </Dropdown>
              </Space>
            </template>
          </template>
        </Table>

        <div class="flex items-center justify-end mt-4 pt-4 border-t">
          <Pagination
            v-model:current="currentPage"
            v-model:pageSize="pageSize"
            :total="4"
            :show-size-changer="true"
            :show-quick-jumper="true"
            :page-size-options="['10', '20', '50', '100']"
          />
        </div>
      </Card>

      <!-- 创建API KEY抽屉 -->
      <CreateDrawer>
        <Form layout="vertical" :model="form">
          <FormItem label="名称" required>
            <Input v-model:value="form.name" placeholder="请输入名称" />
          </FormItem>
          <FormItem label="租户">
            <Select placeholder="请选择租户" :options="[{ label: 'test01', value: 'test01' }]" />
          </FormItem>
          <FormItem label="权限">
            <Select mode="multiple" placeholder="请选择权限" :options="[{ label: '推理服务：读取', value: 'read' }, { label: '推理服务：写入/执行', value: 'write' }]" />
          </FormItem>
        </Form>
        <template #footer>
          <Space>
            <Button @click="createDrawerApi.close()">取消</Button>
            <Button type="primary" @click="handleSave">创建</Button>
          </Space>
        </template>
      </CreateDrawer>
    </div>
  </Page>
</template>