<script setup lang="ts">
import type {
  ImageDetailRecord,
  ImageRecord,
} from '#/views/admin-ai-asset/image/types';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, Radio, Select, Space } from 'ant-design-vue';

import { mockUserDetailRows, mockUserImageRows } from '#/mock/user-image';

import ImageDetail from '#/views/admin-ai-asset/image/components/image-detail.vue';
import ImageDrawer from '#/views/admin-ai-asset/image/components/image-drawer.vue';
import ImageList from '#/views/admin-ai-asset/image/components/image-list.vue';
import { useImageFilter } from '#/views/admin-ai-asset/image/composables/use-image-filter';
import { useImageList } from '#/views/admin-ai-asset/image/composables/use-image-list';
import { usePagination } from '#/views/admin-ai-asset/image/composables/use-pagination';
import { PROJECT_OPTIONS } from '#/views/admin-ai-asset/image/constants';
import { formatDateTime } from '#/utils/date';
import { safeCopyText } from '#/utils/clipboard';
import { showNotify } from '#/utils/notify';

const { rows, selectedRowKeys, deleteImage, batchDelete, addImage } =
  useImageList(mockUserImageRows);

const { imageScope, project, keyword, filteredRows, resetFilters } =
  useImageFilter(rows);

const { currentPage, pageSize, pageSizeOptions, paginatedData, total } =
  usePagination(filteredRows);

const showDetail = ref(false);
const selectedImage = ref<ImageRecord | null>(null);
const detailRows = ref<ImageDetailRecord[]>(mockUserDetailRows);
const detailPage = ref(1);
const detailPageSize = ref(10);

const drawerRef = ref<InstanceType<typeof ImageDrawer> | null>(null);

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

function handleSaveCreate(form: {
  directory: string;
  name: string;
  isLatest: boolean;
  version: string;
}) {
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

function handleSaveImport(form: {
  targetName: string;
  targetProject: string;
  targetVersion: string;
}) {
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
  <Page auto-content-height>
    <div>
      <Transition name="fade-slide" mode="out-in">
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
                  class="w-[180px]"
                  :options="PROJECT_OPTIONS"
                />
                <Input
                  v-model:value="keyword"
                  placeholder="请输入镜像名称"
                  class="w-[220px]"
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

      <ImageDrawer
        ref="drawerRef"
        @save-create="handleSaveCreate"
        @save-import="handleSaveImport"
      />
    </div>
  </Page>
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
