<script setup lang="ts">
import { useVbenDrawer } from '@vben/common-ui';
import { ref, computed } from 'vue';
import { Page } from '@vben/common-ui';
import {
  Button,
  Card,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Form,
  FormItem,
} from 'ant-design-vue';
import { Plus, Search, Settings } from '@vben/icons';

import { showNotify } from '#/utils/notify';

const searchText = ref('');
const pageSize = ref(10);
const currentPage = ref(1);

const columns = [
  { title: '租户/别名', dataIndex: 'tenant', width: 250 },
  { title: '折扣', dataIndex: 'discount', width: 150 },
  { title: '操作', dataIndex: 'action', width: 180 },
];

const dataSource = ref([
  { id: 1, tenant: 'sx-telecom', alias: '陕西电信', discount: '10%' },
  { id: 2, tenant: 'test-0415', alias: '测试租户A', discount: '-' },
  {
    id: 3,
    tenant: 'shiyusuanli-testxq',
    alias: '实验算力测试',
    discount: '5%',
  },
  {
    id: 4,
    tenant: 'shiyusuanli-demandertest',
    alias: '需求测试租户',
    discount: '-',
  },
  { id: 5, tenant: 'moon', alias: 'Moon AI', discount: '15%' },
  { id: 6, tenant: 'test01', alias: '研发部门', discount: '-' },
  {
    id: 7,
    tenant: 'platform-operator',
    alias: '平台运营',
    discount: '-',
  },
  { id: 8, tenant: 'ai-research', alias: 'AI研究院', discount: '20%' },
  { id: 9, tenant: 'cloud-dev', alias: '云开发团队', discount: '8%' },
  { id: 10, tenant: 'bigdata-center', alias: '大数据中心', discount: '12%' },
  { id: 11, tenant: 'ml-team', alias: '机器学习组', discount: '-' },
  { id: 12, tenant: 'gpu-lab', alias: 'GPU实验室', discount: '5%' },
  { id: 13, tenant: 'inference-svc', alias: '推理服务', discount: '10%' },
  { id: 14, tenant: 'training-pipeline', alias: '训练流水线', discount: '-' },
  { id: 15, tenant: 'model-hub', alias: '模型中心', discount: '7%' },
]);

const filteredData = computed(() => {
  return dataSource.value.filter(
    (r) =>
      !searchText.value ||
      r.tenant.includes(searchText.value) ||
      r.alias?.includes(searchText.value),
  );
});

const form = ref({ name: '', alias: '', discount: '' });

function handleAddTenant() {
  createDrawerApi.open();
}

function handleSave() {
  showNotify('添加租户成功（原型）');
  createDrawerApi.close();
}

const [CreateDrawer, createDrawerApi] = useVbenDrawer({
  contentClass: 'p-6',
  footerClass: 'px-6 py-4',
  class: 'w-[480px]!',
  title: '添加租户/租户管理员',
});
</script>

<template>
  <Page auto-content-height>
    <Card :bordered="false" class="shadow-sm">
      <div class="flex items-center gap-2 mb-4">
        <Settings class="size-5 text-blue-500" />
        <span class="text-lg font-semibold">租户管理</span>
      </div>

      <div class="flex items-center justify-between mb-4">
        <Input
          v-model:value="searchText"
          placeholder="支持模糊搜索租户名称"
          style="width: 260px"
          allow-clear
        >
          <template #prefix><Search class="size-4 text-gray-400" /></template>
        </Input>
        <Button type="primary" @click="handleAddTenant">
          <template #icon><Plus class="size-4" /></template>
          添加租户/租户管理员
        </Button>
      </div>

      <Table
        row-key="id"
        :data-source="filteredData"
        :pagination="false"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'tenant'">
            <div>
              <span class="font-medium">{{ record.tenant }}</span>
              <span class="text-gray-400 ml-1">{{ record.alias }}</span>
            </div>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <Space>
              <Button
                type="link"
                size="small"
                @click="showNotify(`编辑租户 ${record.tenant}`)"
              >
                编辑
              </Button>
              <Popconfirm
                title="确认删除该租户？"
                ok-text="确认"
                cancel-text="取消"
                @confirm="showNotify(`删除租户 ${record.tenant}`)"
              >
                <Button type="link" size="small" danger> 删除 </Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>

      <div class="flex items-center justify-end mt-4 pt-4 border-t">
        <Pagination
          v-model:current="currentPage"
          v-model:pageSize="pageSize"
          :total="filteredData.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          :page-size-options="['10', '20', '50', '100']"
          :show-total="(total: number) => `共 ${total} 条`"
        />
      </div>
    </Card>

    <!-- 添加租户抽屉 -->
    <CreateDrawer>
      <Form layout="vertical" :model="form">
        <div class="mb-4">
          <div class="text-base font-medium mb-3">基础信息</div>
          <FormItem label="角色" required>
            <span class="text-gray-600">租户管理员</span>
          </FormItem>
          <FormItem label="用户名" required>
            <Input v-model:value="form.name" placeholder="请输入用户名" />
          </FormItem>
          <FormItem label="别名" required>
            <Input v-model:value="form.alias" placeholder="请输入别名" />
          </FormItem>
          <FormItem label="邮箱" required>
            <Input placeholder="请输入邮箱" />
          </FormItem>
          <FormItem label="手机号">
            <Input placeholder="请输入手机号" />
          </FormItem>
          <FormItem label="时区">
            <Input placeholder="(UTC+00:00) 协调世界时 (UTC)" />
          </FormItem>
          <FormItem label="备注">
            <Input placeholder="请输入备注" />
          </FormItem>
        </div>
        <div class="border-t pt-4">
          <div class="text-base font-medium mb-3">账号配置</div>
          <FormItem label="新密码" required>
            <Input.Password placeholder="请输入新密码" />
          </FormItem>
          <FormItem label="确认密码" required>
            <Input.Password placeholder="请输入确认密码" />
          </FormItem>
        </div>
      </Form>
      <template #footer>
        <Space>
          <Button @click="createDrawerApi.close()">取消</Button>
          <Button type="primary" @click="handleSave">确认</Button>
        </Space>
      </template>
    </CreateDrawer>
  </Page>
</template>
