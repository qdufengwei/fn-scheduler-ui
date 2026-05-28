<script setup lang="ts">
import type { CreateForm, ImageDetailRecord, ImageRecord } from './types';

import { ref } from 'vue';

import {
  Button,
  Input,
  Radio,
  Select,
  Space,
} from 'ant-design-vue';

import ImageDetail from './components/image-detail.vue';
import ImageDrawer from './components/image-drawer.vue';
import ImageList from './components/image-list.vue';
import { useImageFilter } from './composables/use-image-filter';
import { useImageList } from './composables/use-image-list';
import { usePagination } from './composables/use-pagination';
import { PROJECT_OPTIONS } from './constants';
import { mockDetailRows, mockImageRows } from './mock-data';
import { formatDateTime, safeCopyText, showNotify } from './utils';

// ============ 列表逻辑 ============
const { rows, selectedRowKeys, deleteImage, batchDelete, addImage } =
  useImageList(mockImageRows);

const {
  imageScope,
  project,
  keyword,
  filteredRows,
  resetFilters,
} = useImageFilter(rows);

const {
  currentPage,
  pageSize,
  pageSizeOptions,
  paginatedData,
  total,
} = usePagination(filteredRows);

// ============ 详情逻辑 ============
const showDetail = ref(false);
const selectedImage = ref<ImageRecord | null>(null);
const detailRows = ref<ImageDetailRecord[]>(mockDetailRows);
const detailPage = ref(1);
const detailPageSize = ref(10);

// ============ 抽屉引用 ============
const drawerRef = ref<InstanceType<typeof ImageDrawer> | null>(null);

// ============ 事件处理 ============
function handleViewDetail(record: ImageRecord) {
  selectedImage.value = record;
  showDetail.value = true;
}

function handleBack() {
  showDetail.value = false;
  selectedImage.value = null;
}

function handleDelete(record: ImageRecord) {
  deleteImage(record.id);
  showNotify(`删除镜像 ${record.name} 成功`);
}

function handleBatchDelete() {
  const count = batchDelete(selectedRowKeys.value);
  showNotify(`批量删除 ${count} 个镜像成功`);
}

function handleDeleteImageRepo() {
  if (selectedImage.value) {
    deleteImage(selectedImage.value.id);
    showNotify(`删除镜像仓库 ${selectedImage.value.name} 成功`);
    showDetail.value = false;
  }
}

function handleDeleteDetailRow(record: ImageDetailRecord) {
  detailRows.value = detailRows.value.filter((item) => item.id !== record.id);
  showNotify(`删除版本 ${record.name} 成功`);
}

function handleCreateImage() {
  drawerRef.value?.open();
}

function handleSaveCreate(form: CreateForm) {
  const newName = `${form.directory}/${form.name}`;
  const now = formatDateTime();
  addImage({
    name: newName,
    count: 1,
    pulls: 0,
    created: now,
    updated: now,
    isPublic: imageScope.value === 'public',
  });
  showNotify(
    `成功提交构建镜像任务 [${newName}:${form.isLatest ? 'latest' : form.version}]`,
  );
}

function handleSaveImport(form: { targetName: string; targetProject: string; targetVersion: string }) {
  const newName = `${form.targetProject}/${form.targetName}`;
  const now = formatDateTime();
  addImage({
    name: newName,
    count: 1,
    pulls: 0,
    created: now,
    updated: now,
    isPublic: imageScope.value === 'public',
  });
  showNotify(`成功导入镜像 [${newName}:${form.targetVersion}]`);
}

function handleCopyText(text: string) {
  safeCopyText(text);
}

function handleResetFilters() {
  resetFilters();
}
</script>

<template>
  <div>
    <Transition name="fade-slide" mode="out-in">
      <!-- 镜像列表视图 -->
      <div v-if="!showDetail" key="list">
        <ImageList
          :data="paginatedData"
          :selected-row-keys="selectedRowKeys"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-size-options="pageSizeOptions"
          @view-detail="handleViewDetail"
          @delete="handleDelete"
          @batch-delete="handleBatchDelete"
          @selection-change="selectedRowKeys = $event"
          @create="handleCreateImage"
          @update:current-page="currentPage = $event"
          @update:page-size="pageSize = $event"
        >
          <template #filters>
            <div class="flex flex-wrap items-center gap-4">
              <Radio.Group v-model:value="imageScope" button-style="solid">
                <Radio.Button value="public">公共镜像</Radio.Button>
                <Radio.Button value="private">私有镜像</Radio.Button>
              </Radio.Group>
              <Select
                v-model:value="project"
                style="width: 180px"
                :options="PROJECT_OPTIONS"
              />
              <Input
                v-model:value="keyword"
                placeholder="请输入镜像名称"
                style="width: 220px"
              />
            </div>
          </template>

          <template #filterActions>
            <Space>
              <Button type="primary">筛选</Button>
              <Button @click="handleResetFilters">重置</Button>
            </Space>
          </template>
        </ImageList>
      </div>

      <!-- 镜像详情视图 -->
      <ImageDetail
        v-else
        key="detail"
        :image="selectedImage"
        :detail-data="detailRows"
        :detail-page="detailPage"
        :detail-page-size="detailPageSize"
        @back="handleBack"
        @delete-repo="handleDeleteImageRepo"
        @delete-detail="handleDeleteDetailRow"
        @copy="handleCopyText"
        @update:detail-page="detailPage = $event"
        @update:detail-page-size="detailPageSize = $event"
      />
    </Transition>

    <!-- 创建镜像抽屉 -->
    <ImageDrawer
      ref="drawerRef"
      @save-create="handleSaveCreate"
      @save-import="handleSaveImport"
    />
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease-in-out;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
