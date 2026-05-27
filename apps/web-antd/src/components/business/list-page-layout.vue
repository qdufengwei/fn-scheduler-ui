<script setup lang="ts">
import { Page } from '@vben/common-ui';

withDefaults(
  defineProps<{
    listTitle?: string;
  }>(),
  {
    listTitle: '',
  },
);
</script>

<template>
  <Page auto-content-height content-class="fn-list-page-content">
    <div class="fn-list-page flex flex-col gap-4">
      <!-- 列表前的插槽（如说明性文字、广告等） -->
      <div v-if="$slots.before" class="fn-list-before w-full">
        <slot name="before" />
      </div>

      <!-- 顶部筛选卡片 -->
      <div 
        v-if="$slots.filters || $slots.filterActions" 
        class="fn-list-filter-card flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 shadow-sm transition-all"
      >
        <div class="fn-list-filter-fields flex-1 min-w-0">
          <slot name="filters" />
        </div>
        <div class="fn-list-filter-actions flex items-center justify-end flex-shrink-0 gap-2.5">
          <slot name="filterActions" />
        </div>
      </div>

      <!-- 列表表面容器 -->
      <div class="fn-list-surface flex flex-col rounded-xl border border-solid border-neutral-100 dark:border-neutral-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <!-- 列表顶部工具栏 -->
        <div 
          v-if="$slots.toolbar || $slots.viewSwitch" 
          class="fn-list-toolbar flex items-center justify-between gap-4 border-b border-solid border-neutral-100 dark:border-neutral-800/80 px-4 py-3 bg-neutral-50/50 dark:bg-zinc-900/30"
        >
          <div class="fn-list-toolbar-main flex items-center flex-wrap gap-2.5 flex-1 min-w-0">
            <slot name="toolbar" />
          </div>
          <div class="fn-list-toolbar-view flex items-center gap-2.5 flex-shrink-0">
            <slot name="viewSwitch" />
          </div>
        </div>

        <!-- 列表展示内容区 -->
        <div class="fn-list-content min-w-0 flex-1 bg-transparent">
          <slot />
        </div>
      </div>
    </div>
  </Page>
</template>

<style scoped>
/* Page Layout Wrapper */
:global(.fn-list-page-content) {
  padding: 12px !important;
}

/* Table container styling */
:global(.fn-list-content > .ant-table-wrapper) {
  overflow: hidden;
  background: transparent;
}

/* Table Header Styles */
:global(.fn-list-content .ant-table-thead > tr > th) {
  font-weight: 600;
  color: #475569;
  background: #f8fafc !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

:global(.dark .fn-list-content .ant-table-thead > tr > th) {
  color: #a1a1aa;
  background: #18181b !important;
  border-bottom: 1px solid #27272a !important;
}

/* Table Body Styles */
:global(.fn-list-content .ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f1f5f9 !important;
}

:global(.dark .fn-list-content .ant-table-tbody > tr > td) {
  border-bottom: 1px solid #27272a !important;
}

/* Table Hover Row Styles */
:global(.fn-list-content .ant-table-tbody > tr:hover > td) {
  background: #f8fafc !important;
}

:global(.dark .fn-list-content .ant-table-tbody > tr:hover > td) {
  background: #27272a !important;
}

/* Border radius normalization for Ant Table corners */
:global(.fn-list-content > .ant-table-wrapper .ant-table-container table > thead > tr:first-child > *:first-child) {
  border-start-start-radius: 0;
}

:global(.fn-list-content > .ant-table-wrapper .ant-table-container table > thead > tr:first-child > *:last-child) {
  border-start-end-radius: 0;
}

/* Content wrapper padding (when not standard table) */
:global(.fn-list-content > :not(.ant-table-wrapper):not(.fn-list-pagination)) {
  padding: 16px;
}

/* Pagination container styling */
:global(.fn-list-pagination) {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 16px !important;
  background: #fff;
  border-top: 1px solid #f1f5f9 !important;
}

:global(.dark .fn-list-pagination) {
  background: #09090b;
  border-top: 1px solid #27272a !important;
}

/* Ant pagination component adjustments */
:global(.fn-list-pagination .ant-pagination) {
  display: flex;
  align-items: center;
}

:global(.fn-list-pagination .ant-pagination-item),
:global(.fn-list-pagination .ant-pagination-prev),
:global(.fn-list-pagination .ant-pagination-next),
:global(.fn-list-pagination .ant-select-selector),
:global(.fn-list-pagination .ant-pagination-options-quick-jumper input) {
  border-color: #e2e8f0 !important;
  box-shadow: none !important;
}

:global(.dark .fn-list-pagination .ant-pagination-item),
:global(.dark .fn-list-pagination .ant-pagination-prev),
:global(.dark .fn-list-pagination .ant-pagination-next),
:global(.dark .fn-list-pagination .ant-select-selector),
:global(.dark .fn-list-pagination .ant-pagination-options-quick-jumper input) {
  color: #d4d4d8 !important;
  background-color: #18181b !important;
  border-color: #27272a !important;
}

:global(.fn-list-content > .fn-list-pagination:first-child) {
  border-top: 0 !important;
}
</style>
