<script setup lang="ts">
import { Page } from '@vben/common-ui';
import { Button, Card, Form, FormItem, Input, Space, Switch, Divider, Select, InputNumber, RadioGroup, RadioButton } from 'ant-design-vue';
import { Info, Plus, ArrowLeft } from '@vben/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const createForm = ref({ name: '', type: '分布式训练' });
const notify = (text: string) => message.info(text);
import { message } from 'ant-design-vue';

const goBack = () => {
  router.push('/user-task/training');
};
</script>

<template>
  <Page>
    <Card>
      <!-- Title with back button -->
      <div class="flex items-center justify-between border-b pb-4 mb-4">
        <div class="flex items-center gap-2 cursor-pointer" @click="goBack">
          <ArrowLeft class="size-6 text-gray-600 hover:text-black transition-colors" />
          <span class="text-lg font-semibold text-gray-800">创建任务 - 高级切换</span>
        </div>
        <Space>
          <span class="text-sm font-medium">YAML</span>
          <Switch size="small" />
        </Space>
      </div>

      <Form layout="vertical" class="px-2" :model="createForm">
        <!-- 基础信息 -->
        <h3 class="font-bold mb-4 text-base">基础信息</h3>
        <FormItem label="任务名称" required>
          <Input v-model:value="createForm.name" placeholder="仅支持中文、字母、数字及-、_、.、()符号" />
        </FormItem>
        <FormItem label="描述">
          <Input.TextArea :rows="4" placeholder="请输入任务描述" :maxlength="1024" show-count />
        </FormItem>
        <FormItem label="容忍度">
          <a class="text-blue-500">+ 设置容忍度</a>
        </FormItem>

        <Divider />

        <!-- 资源配置 -->
        <h3 class="font-bold mb-4 text-base">资源配置</h3>
        <FormItem label="实例配置" required>
          <Segmented :options="['MPI', 'PyTorch', 'Simple', 'CPU', 'Deployment']" />
          <div class="mt-4 flex items-center gap-6">
            <Space><Switch size="small" /> 启用MIG模式</Space>
            <Space><Switch size="small" /> 整机调度</Space>
            <Space><Switch size="small" /> vGPU</Space>
          </div>
          <div class="mt-2 text-gray-500 text-sm flex items-center">
            <Info class="mr-1 size-4" /> 当前所选类型暂无资源，可点击 <a class="text-blue-500 ml-1">【购买】</a> 获取资源
          </div>
          
          <div class="mt-4 border border-gray-200 rounded overflow-hidden">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 text-sm">
                  <th class="p-3 font-medium border-b border-gray-200">Roles</th>
                  <th class="p-3 font-medium border-b border-gray-200 w-28">实例数量</th>
                  <th class="p-3 font-medium border-b border-gray-200 w-56">资源规格</th>
                  <th class="p-3 font-medium border-b border-gray-200 w-28">GPU数量</th>
                  <th class="p-3 font-medium border-b border-gray-200 w-28">CPU(核)</th>
                  <th class="p-3 font-medium border-b border-gray-200 w-32">内存(GiB)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-3 border-b border-gray-200 text-gray-500">master</td>
                  <td class="p-3 border-b border-gray-200"><InputNumber :value="1" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><Select placeholder="请输入资源规格" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><InputNumber :value="1" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><Input placeholder="CPU" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><InputNumber :value="1500" class="w-full" /></td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200 text-gray-500">worker</td>
                  <td class="p-3 border-b border-gray-200"><InputNumber :value="1" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><Select placeholder="请输入资源规格" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><InputNumber :value="1" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><Input placeholder="CPU" class="w-full" /></td>
                  <td class="p-3 border-b border-gray-200"><InputNumber :value="1500" class="w-full" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-3"><a class="text-blue-500">+ 添加角色 (0/6)</a></div>
        </FormItem>

        <FormItem label="优先级" required>
          <RadioGroup :value="'6'">
            <RadioButton value="6">6</RadioButton>
            <RadioButton value="5">5</RadioButton>
            <RadioButton value="4">4</RadioButton>
            <RadioButton value="3">3</RadioButton>
            <RadioButton value="2">2</RadioButton>
            <RadioButton value="1">1</RadioButton>
          </RadioGroup>
          <div class="text-xs text-gray-400 mt-2">数值越大，优先级越高</div>
        </FormItem>

        <FormItem label="回收策略">
          <Space><Switch size="small" /> 不可回收</Space>
        </FormItem>

        <FormItem label="自动重试">
          <Switch size="small" />
        </FormItem>

        <FormItem label="存储" required>
          <Space class="mb-3">
            <Button size="small" class="text-blue-500 border-blue-500">+ 存储卷</Button>
            <Button size="small" class="text-blue-500 border-blue-500">+ 临时卷</Button>
            <Button size="small" class="text-blue-500 border-blue-500">+ S3</Button>
          </Space>
          <div class="text-xs text-gray-400 leading-relaxed space-y-1">
            <div class="flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> 存储卷，临时卷，S3：每个挂载目录不可重复。</div>
            <div class="flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> 存储卷：可通过 "库 -> 存储" 页面管理的持久卷。</div>
            <div class="flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> 容器路径：持久卷在容器内部挂载的路径。</div>
            <div class="flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> 临时卷：由 EmptyDir 提供支持的临时卷，其生命周期与 Pod 绑定。</div>
            <div class="flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> 主机路径：由 Host Path 提供支持的卷，用于将宿主机节点文件系统中的目录或文件挂载到 Pod 内。</div>
          </div>
        </FormItem>

        <Divider />

        <!-- 环境配置 -->
        <h3 class="font-bold mb-4 text-base">环境配置</h3>
        <FormItem label="镜像" required>
          <Segmented :options="['预置镜像', '自定义镜像']" class="mb-3" />
          <Input placeholder="请选择镜像地址">
            <template #addonAfter>
              <Plus class="cursor-pointer size-4" />
            </template>
          </Input>
        </FormItem>

        <FormItem label="工作目录" required>
          <Input placeholder="请输入命令行执行目录" />
        </FormItem>

        <Divider class="text-gray-400 text-xs">master</Divider>
        
        <FormItem label="命令模式" required>
          <Segmented :options="['自定义模式', 'shell模式']" />
        </FormItem>

        <FormItem label="入口命令" required>
          <div class="bg-[#282c34] text-[#abb2bf] p-4 rounded font-mono text-sm leading-relaxed overflow-x-auto">
            <div class="flex"><span class="text-gray-500 w-6 text-right mr-4 select-none">1</span><span class="text-[#e06c75]">/bin/bash</span></div>
            <div class="flex"><span class="text-gray-500 w-6 text-right mr-4 select-none">2</span><span class="text-[#56b6c2]">-c</span></div>
            <div class="flex"><span class="text-gray-500 w-6 text-right mr-4 select-none">3</span><span class="text-[#98c379]">sleep</span> <span class="text-[#d19a66]">inf</span></div>
          </div>
          <div class="text-xs text-gray-400 mt-2 flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> Custom Mode 可输入 Linux 命令 (参数以空格分隔，换行车换行) ; Shell Mode 支持直接粘贴粘帖完整的 Shell 脚本。</div>
        </FormItem>

        <Divider class="text-gray-400 text-xs">worker</Divider>

        <FormItem label="命令模式" required>
          <Segmented :options="['自定义模式', 'shell模式']" />
        </FormItem>

        <FormItem label="入口命令" required>
          <div class="bg-[#282c34] text-[#abb2bf] p-4 rounded font-mono text-sm leading-relaxed overflow-x-auto">
            <div class="flex"><span class="text-gray-500 w-6 text-right mr-4 select-none">1</span><span class="text-[#e06c75]">/bin/bash</span></div>
            <div class="flex"><span class="text-gray-500 w-6 text-right mr-4 select-none">2</span><span class="text-[#56b6c2]">-c</span></div>
            <div class="flex"><span class="text-gray-500 w-6 text-right mr-4 select-none">3</span><span class="text-[#98c379]">sleep</span> <span class="text-[#d19a66]">inf</span></div>
          </div>
          <div class="text-xs text-gray-400 mt-2 flex items-start"><Info class="mr-1 size-3 mt-0.5 shrink-0" /> Custom Mode 可输入 Linux 命令 (参数以空格分隔，换行车换行) ; Shell Mode 支持直接粘贴粘帖完整的 Shell 脚本。</div>
        </FormItem>

        <FormItem label="环境变量">
          <a class="text-blue-500">+ 新增环境变量</a>
        </FormItem>
      </Form>

      <div class="flex items-center justify-between mt-8 border-t pt-4">
        <Space>
          <Button type="primary" @click="notify('已提交创建任务')">确认</Button>
          <Button @click="goBack">取消</Button>
        </Space>
        <div class="text-gray-500 text-sm">
          资源使用：GPU 2 | CPU 0 核 | 内存 3000 GiB
        </div>
      </div>
    </Card>
  </Page>
</template>
