<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';
import { ArrowLeft, Info, Plus } from '@vben/icons';

import {
  Button,
  Card,
  Divider,
  Form,
  FormItem,
  Input,
  InputNumber,
  Select,
  Space,
  Switch,
} from 'ant-design-vue';

import { showInfo } from '#/utils/notify';

const router = useRouter();
const createForm = ref({ name: '', model: '' });

const goBack = () => {
  router.push('/user-task/latest/finetune');
};
</script>

<template>
  <Page>
    <Card>
      <!-- Title with back button -->
      <div class="flex items-center justify-between border-b pb-4 mb-4">
        <div class="flex items-center gap-2 cursor-pointer" @click="goBack">
          <ArrowLeft
            class="size-6 text-gray-600 hover:text-black transition-colors"
          />
          <span class="text-lg font-semibold text-gray-800"
            >创建模型微调任务 · 高级切换</span
          >
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
          <Input
            v-model:value="createForm.name"
            placeholder="仅支持中文、字母、数字及-、_、.、()符号"
          />
        </FormItem>
        <FormItem label="描述">
          <Input.TextArea
            :rows="4"
            placeholder="请输入任务描述"
            :maxlength="1024"
            show-count
          />
        </FormItem>
        <FormItem label="模型仓库" required>
          <Input placeholder="请选择模型仓库">
            <template #addonAfter>
              <Plus class="cursor-pointer size-4" />
            </template>
          </Input>
        </FormItem>

        <Divider />

        <!-- 训练配置 -->
        <h3 class="font-bold mb-4 text-base">训练配置</h3>
        <FormItem label="微调方式" required>
          <Button
            type="primary"
            ghost
            class="px-6 rounded border-blue-400 bg-blue-50"
          >
            LoRA
          </Button>
        </FormItem>
        <FormItem label="参数配置">
          <div class="border border-gray-200 rounded overflow-hidden">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="bg-gray-50 text-gray-500">
                  <th class="p-3 font-medium border-b border-gray-200 w-48">
                    超参数
                  </th>
                  <th class="p-3 font-medium border-b border-gray-200 w-48">
                    参数名
                  </th>
                  <th class="p-3 font-medium border-b border-gray-200 w-64">
                    参数值
                  </th>
                  <th class="p-3 font-medium border-b border-gray-200">
                    参数说明
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="p-3 border-b border-gray-200">截断长度</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    cutoff_len
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="1024" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    每个训练样本的最大长度, 以token数表示。该数值越大,
                    需要占用的显存越多。
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">学习率</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    learning_rate
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber
                      :value="0.0000001"
                      :step="0.0000001"
                      class="w-full"
                    />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    模型权重的更新速率。速率越高，每次训练迭代时权重的变动幅度越大。建议范围为
                    1e-3~1e-7，推荐范围为 1e-4~1e-5
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">日志间隔步数</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    logging_steps
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="5" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    两次输出日志之间间隔的训练步数。
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">最大样本数</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    max_samples
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="1000" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    从每个数据集使用的样本数量的最大值。
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">
                    NEFTune向量噪声参数
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    neftune_noise_alpha
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="0.0" :step="0.01" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    在对训练数据向量化时，NEFTune向其产生的embedding向量添加一定噪声，以缓解过拟合现象并提升微调训练效果。数值范围为
                    0-1，为 0 则该参数不生效。
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">训练轮数</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    num_train_epochs
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="1.0" :step="0.1" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    微调训练样本的轮次数。
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">批处理大小</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    per_device_train_batch_size
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="1" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    每台设备上同时运行的微调处理数量。数字越大，占用显存越多，微调速度越快（增长关系非线性）。
                  </td>
                </tr>
                <tr>
                  <td class="p-3 border-b border-gray-200">学习率预热比率</td>
                  <td
                    class="p-3 border-b border-gray-200 font-mono text-xs text-gray-500"
                  >
                    warmup_ratio
                  </td>
                  <td class="p-3 border-b border-gray-200">
                    <InputNumber :value="0.0" :step="0.01" class="w-full" />
                  </td>
                  <td
                    class="p-3 border-b border-gray-200 text-gray-400 text-xs"
                  >
                    在微调的一定比例初始范围内，调整学习率为线性增长，以减少模型权重可能的发散或剧烈波动。数值范围为
                    0-1，为 0 则该参数不生效。例：设置为 0.03，则将在前 3%
                    训练时使用该策略。
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </FormItem>

        <Divider />

        <!-- 资源配置 -->
        <h3 class="font-bold mb-4 text-base">资源配置</h3>
        <FormItem label="实例配置" required>
          <div class="flex items-center gap-6 mb-2">
            <Space><Switch size="small" /> 启用MIG模式</Space>
            <Space><Switch size="small" /> 整机调度</Space>
            <Space><Switch size="small" /> vGPU</Space>
          </div>
          <div class="mb-4 text-gray-500 text-sm flex items-center">
            <Info class="mr-1 size-4" /> 当前所选类型暂无资源，可点击
            <a class="text-blue-500 ml-1">【购买】</a> 获取资源
          </div>

          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-sm mb-1 text-gray-500">资源规格</div>
              <Select placeholder="资源规格" class="w-full" />
            </div>
            <div class="w-24">
              <div class="text-sm mb-1 text-gray-500">GPU数量</div>
              <InputNumber :value="1" class="w-full" />
            </div>
            <div class="w-24">
              <div class="text-sm mb-1 text-gray-500">CPU(核)</div>
              <Input class="w-full" />
            </div>
            <div class="w-32">
              <div class="text-sm mb-1 text-gray-500">内存(GiB)</div>
              <Input class="w-full" />
            </div>
          </div>
        </FormItem>

        <FormItem label="环境变量">
          <a class="text-blue-500">+ 新增环境变量</a>
        </FormItem>

        <Divider />

        <!-- 数据集配置 -->
        <h3 class="font-bold mb-4 text-base">数据集配置</h3>
        <FormItem label="训练集" required>
          <Input placeholder="请选择数据集">
            <template #addonAfter>
              <Plus class="cursor-pointer size-4" />
            </template>
          </Input>
        </FormItem>

        <FormItem label="验证集" required>
          <Input placeholder="请选择验证集">
            <template #addonAfter>
              <Plus class="cursor-pointer size-4" />
            </template>
          </Input>
        </FormItem>
      </Form>

      <div class="flex items-center justify-between mt-8 border-t pt-4">
        <Space>
          <Button type="primary" @click="showInfo('已提交微调任务')">
            确认
          </Button>
          <Button>存为模版</Button>
          <Button @click="goBack">取消</Button>
        </Space>
      </div>
    </Card>
  </Page>
</template>
