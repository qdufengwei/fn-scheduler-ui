<script setup lang="ts">
import type { ImageDetailRecord, ImageRecord } from '../types';

import { ArrowLeft, Copy } from '@vben/icons';

import {
  Button,
  Col,
  Pagination,
  Popconfirm,
  Row,
  Table,
  Tag,
} from 'ant-design-vue';

// ============ 类型定义 ============
interface Props {
  detailData: ImageDetailRecord[];
  detailPage?: number;
  detailPageSize?: number;
  image: ImageRecord | null;
}

// ============ Props & Emits ============
const _props = withDefaults(defineProps<Props>(), {
  detailPage: 1,
  detailPageSize: 10,
});

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'deleteRepo'): void;
  (e: 'deleteDetail', record: ImageDetailRecord): void;
  (e: 'copy', text: string): void;
  (e: 'update:detailPage', page: number): void;
  (e: 'update:detailPageSize', size: number): void;
}>();

const detailColumns = [
  { title: '', dataIndex: 'expand', width: 50 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 340 },
  { title: '标签', dataIndex: 'tags', key: 'tags', width: 240 },
  { title: '大小', dataIndex: 'size', key: 'size', width: 120 },
  { title: '镜像地址', dataIndex: 'address', key: 'address', width: 280 },
  { title: '创建时间', dataIndex: 'created', key: 'created', width: 160 },
  { title: '操作', key: 'action', width: 80 },
];
</script>

<template>
  <div v-if="image" class="space-y-4">
    <!-- 详情头部 -->
    <div
      class="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-6"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <Button
            type="text"
            class="flex items-center justify-center p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
            @click="emit('back')"
          >
            <ArrowLeft class="size-5 text-gray-600 dark:text-zinc-400" />
          </Button>
          <span
            class="text-lg font-bold text-gray-800 dark:text-zinc-200 select-all"
          >
            {{ image.name }}
          </span>
        </div>
        <Popconfirm
          title="确认删除该镜像仓库？"
          ok-text="确认"
          cancel-text="取消"
          @confirm="emit('deleteRepo')"
        >
          <Button danger>删除</Button>
        </Popconfirm>
      </div>

      <div
        class="border-t border-solid border-neutral-100 dark:border-neutral-800/50 my-4"
      ></div>

      <div
        class="bg-neutral-50/60 dark:bg-zinc-900/40 border border-solid border-neutral-100 dark:border-neutral-800/80 rounded-xl p-6"
      >
        <Row :gutter="[48, 16]">
          <Col :span="12">
            <div
              class="flex items-center justify-between py-1 pr-12 border-b border-dashed border-neutral-100 dark:border-neutral-800"
            >
              <span class="text-sm text-gray-400 dark:text-zinc-500 w-24"
                >镜像数量</span
              >
              <span
                class="text-sm font-semibold text-gray-800 dark:text-zinc-200"
                >{{ image.count }}</span
              >
            </div>
          </Col>
          <Col :span="12">
            <div
              class="flex items-center justify-between py-1 pr-12 border-b border-dashed border-neutral-100 dark:border-neutral-800"
            >
              <span class="text-sm text-gray-400 dark:text-zinc-500 w-24"
                >创建时间</span
              >
              <span
                class="text-sm font-semibold text-gray-800 dark:text-zinc-200"
                >{{ image.created }}</span
              >
            </div>
          </Col>
          <Col :span="12">
            <div class="flex items-center justify-between py-1 pr-12">
              <span class="text-sm text-gray-400 dark:text-zinc-500 w-24"
                >拉取次数</span
              >
              <span
                class="text-sm font-semibold text-gray-800 dark:text-zinc-200"
                >{{ image.pulls }}</span
              >
            </div>
          </Col>
          <Col :span="12">
            <div class="flex items-center justify-between py-1 pr-12">
              <span class="text-sm text-gray-400 dark:text-zinc-500 w-24"
                >仓库名称</span
              >
              <span
                class="text-sm font-semibold text-gray-800 dark:text-zinc-200"
                >{{ image.name.split('/')[0] }}</span
              >
            </div>
          </Col>
        </Row>
      </div>
    </div>

    <!-- 详情表格 -->
    <div
      class="bg-white dark:bg-zinc-950 p-6 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 shadow-sm space-y-4"
    >
      <h3 class="text-base font-bold text-gray-800 dark:text-zinc-200">
        镜像详情
      </h3>
      <Table
        row-key="id"
        :data-source="detailData"
        :columns="detailColumns"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <span
              class="text-sm text-gray-800 dark:text-zinc-300 font-mono select-all break-all"
              >{{ record.name }}</span
            >
          </template>
          <template v-if="column.key === 'tags'">
            <div class="flex flex-wrap gap-1.5">
              <Tag
                v-for="tag in record.tags"
                :key="tag"
                class="rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400 border-none px-2.5 py-0.5 text-xs"
              >
                {{ tag }}
              </Tag>
              <span
                v-if="!record.tags || record.tags.length === 0"
                class="text-gray-400"
                >-</span
              >
            </div>
          </template>
          <template v-if="column.key === 'address'">
            <div v-if="record.address" class="flex items-center gap-1.5">
              <span
                class="text-sm text-gray-600 dark:text-zinc-400 font-mono break-all"
                >{{ record.address }}</span
              >
              <Button
                type="link"
                size="small"
                class="p-0 h-auto"
                @click="emit('copy', record.address)"
              >
                <Copy class="size-3" />
              </Button>
            </div>
            <span v-else class="text-gray-400">-</span>
          </template>
          <template v-if="column.key === 'created'">
            <span class="text-sm text-gray-600 dark:text-zinc-400">{{
              record.created
            }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <Popconfirm
              title="确认删除该镜像？"
              ok-text="确认"
              cancel-text="取消"
              @confirm="emit('deleteDetail', record as ImageDetailRecord)"
            >
              <a class="text-red-500 text-sm">删除</a>
            </Popconfirm>
          </template>
        </template>
      </Table>

      <div
        class="flex items-center justify-end mt-4 pt-4 border-t border-solid border-neutral-100 dark:border-neutral-800"
      >
        <Pagination
          :current="detailPage"
          :page-size="detailPageSize"
          :total="detailData.length"
          :show-size-changer="true"
          :show-quick-jumper="true"
          @update:current="emit('update:detailPage', $event)"
          @update:page-size="emit('update:detailPageSize', $event)"
        />
      </div>
    </div>
  </div>
</template>
