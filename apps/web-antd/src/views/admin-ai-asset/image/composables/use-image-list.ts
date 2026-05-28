import type { ImageRecord } from '../types';

import { ref } from 'vue';

export function useImageList(initialRows: ImageRecord[]) {
  const rows = ref<ImageRecord[]>(initialRows);
  const selectedRowKeys = ref<(number | string)[]>([]);

  // 生成唯一ID
  function generateId(): number {
    let maxId = 0;
    for (const item of rows.value) {
      if (item.id > maxId) {
        maxId = item.id;
      }
    }
    return maxId + 1;
  }

  // 删除单个
  function deleteImage(id: number): void {
    rows.value = rows.value.filter((item) => item.id !== id);
  }

  // 批量删除
  function batchDelete(selectedIds: (number | string)[]): number {
    const count = selectedIds.length;
    rows.value = rows.value.filter((item) => !selectedIds.includes(item.id));
    selectedRowKeys.value = [];
    return count;
  }

  // 添加镜像
  function addImage(image: Omit<ImageRecord, 'id'>): ImageRecord {
    const newImage: ImageRecord = {
      ...image,
      id: generateId(),
    };
    rows.value.unshift(newImage);
    return newImage;
  }

  return {
    rows,
    selectedRowKeys,
    generateId,
    deleteImage,
    batchDelete,
    addImage,
  };
}
