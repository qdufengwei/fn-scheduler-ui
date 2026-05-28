import { describe, expect, it } from 'vitest';

import type { ImageRecord } from '../types';

import { useImageList } from '../use-image-list';

describe('useImageList', () => {
  const mockImages: ImageRecord[] = [
    {
      id: 1,
      name: 'kubesphereio/nginx',
      count: 1,
      pulls: 5,
      created: '2026-01-01',
      updated: '2026-01-02',
      isPublic: true,
    },
    {
      id: 2,
      name: 'kubesphereio/redis',
      count: 1,
      pulls: 3,
      created: '2026-01-02',
      updated: '2026-01-03',
      isPublic: true,
    },
    {
      id: 3,
      name: 'private/custom',
      count: 1,
      pulls: 0,
      created: '2026-01-03',
      updated: '2026-01-04',
      isPublic: false,
    },
  ];

  describe('初始化', () => {
    it('应该正确初始化 rows 和 selectedRowKeys', () => {
      const { rows, selectedRowKeys } = useImageList(mockImages);
      expect(rows.value).toEqual(mockImages);
      expect(selectedRowKeys.value).toEqual([]);
    });

    it('空数组初始化时应该正常工作', () => {
      const { rows, selectedRowKeys } = useImageList([]);
      expect(rows.value).toEqual([]);
      expect(selectedRowKeys.value).toEqual([]);
    });
  });

  describe('generateId', () => {
    it('应该在现有最大ID基础上加1', () => {
      const { generateId } = useImageList(mockImages);
      expect(generateId()).toBe(4);
    });

    it('空数组时应该返回1', () => {
      const { generateId } = useImageList([]);
      expect(generateId()).toBe(1);
    });

    it('非连续ID时应该返回最大值+1', () => {
      const sparseData: ImageRecord[] = [
        {
          id: 1,
          name: 'a',
          count: 1,
          pulls: 0,
          created: '',
          updated: '',
          isPublic: true,
        },
        {
          id: 10,
          name: 'b',
          count: 1,
          pulls: 0,
          created: '',
          updated: '',
          isPublic: true,
        },
      ];
      const { generateId } = useImageList(sparseData);
      expect(generateId()).toBe(11);
    });
  });

  describe('deleteImage', () => {
    it('应该删除指定ID的镜像', () => {
      const { rows, deleteImage } = useImageList([...mockImages]);
      deleteImage(2);
      expect(rows.value).toHaveLength(2);
      expect(rows.value.map((r) => r.id)).toEqual([1, 3]);
    });

    it('删除不存在的ID不应报错', () => {
      const { rows, deleteImage } = useImageList([...mockImages]);
      deleteImage(999);
      expect(rows.value).toHaveLength(3);
    });
  });

  describe('batchDelete', () => {
    it('应该批量删除选中的镜像', () => {
      const { rows, batchDelete, selectedRowKeys } = useImageList([
        ...mockImages,
      ]);
      selectedRowKeys.value = [1, 2];
      const count = batchDelete(selectedRowKeys.value);
      expect(count).toBe(2);
      expect(rows.value).toHaveLength(1);
      expect(rows.value[0]?.id).toBe(3);
    });

    it('删除后应该清空 selectedRowKeys', () => {
      const { batchDelete, selectedRowKeys } = useImageList([...mockImages]);
      selectedRowKeys.value = [1, 3];
      batchDelete(selectedRowKeys.value);
      expect(selectedRowKeys.value).toEqual([]);
    });

    it('空数组删除应该返回0', () => {
      const { batchDelete, selectedRowKeys } = useImageList([...mockImages]);
      const count = batchDelete([]);
      expect(count).toBe(0);
      expect(selectedRowKeys.value).toEqual([]);
    });
  });

  describe('addImage', () => {
    it('应该添加新镜像到列表头部', () => {
      const { rows, addImage } = useImageList([...mockImages]);
      const newImage = {
        name: 'new/image',
        count: 1,
        pulls: 0,
        created: '2026-01-05',
        updated: '2026-01-05',
        isPublic: true,
      };
      const result = addImage(newImage);
      expect(rows.value).toHaveLength(4);
      expect(rows.value[0]?.name).toBe('new/image');
      expect(result.id).toBe(4);
    });

    it('添加的镜像应该包含正确的ID', () => {
      const { addImage } = useImageList([...mockImages]);
      const result = addImage({
        name: 'test',
        count: 1,
        pulls: 0,
        created: '',
        updated: '',
        isPublic: true,
      });
      expect(result.id).toBe(4);
    });

    it('应该返回添加的镜像对象', () => {
      const { addImage } = useImageList([...mockImages]);
      const result = addImage({
        name: 'test',
        count: 1,
        pulls: 0,
        created: '',
        updated: '',
        isPublic: true,
      });
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', 'test');
    });
  });

  describe('响应式', () => {
    it('rows 应该是响应式的', () => {
      const { rows, deleteImage } = useImageList([...mockImages]);
      deleteImage(1);
      expect(rows.value).toHaveLength(2);
    });
  });
});
