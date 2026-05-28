import { describe, expect, it } from 'vitest';

import type { ImageRecord } from '../types';

import { useImageFilter } from '../use-image-filter';

function createMockRef<T>(value: T): { value: T } {
  return { value };
}

describe('useImageFilter', () => {
  const mockImages: ImageRecord[] = [
    {
      id: 1,
      name: 'kubesphereio/nginx',
      count: 1,
      pulls: 5,
      created: '',
      updated: '',
      isPublic: true,
    },
    {
      id: 2,
      name: 'kubesphereio/redis',
      count: 1,
      pulls: 3,
      created: '',
      updated: '',
      isPublic: true,
    },
    {
      id: 3,
      name: 'private/custom',
      count: 1,
      pulls: 0,
      created: '',
      updated: '',
      isPublic: false,
    },
    {
      id: 4,
      name: 'kubesphereio/postgres',
      count: 1,
      pulls: 1,
      created: '',
      updated: '',
      isPublic: true,
    },
  ];

  describe('初始化', () => {
    it('默认应该显示公共镜像', () => {
      const imageList = createMockRef([...mockImages]);
      const { imageScope, project, keyword, filteredRows } =
        useImageFilter(imageList);
      expect(imageScope.value).toBe('public');
      expect(project.value).toBe('kubesphereio');
      expect(keyword.value).toBe('');
      expect(filteredRows.value.every((r) => r.isPublic)).toBe(true);
    });
  });

  describe('按镜像范围过滤', () => {
    it('public 范围应该只返回公共镜像', () => {
      const imageList = createMockRef([...mockImages]);
      const { imageScope, filteredRows } = useImageFilter(imageList);
      imageScope.value = 'public';
      expect(filteredRows.value.every((r) => r.isPublic)).toBe(true);
      expect(filteredRows.value).toHaveLength(3);
    });

    it('private 范围应该只返回私有镜像', () => {
      const imageList = createMockRef([...mockImages]);
      const { imageScope, project, filteredRows } = useImageFilter(imageList);
      imageScope.value = 'private';
      project.value = ''; // 清空项目过滤以测试纯范围过滤
      expect(filteredRows.value.every((r) => !r.isPublic)).toBe(true);
      expect(filteredRows.value).toHaveLength(1);
    });
  });

  describe('按项目过滤', () => {
    it('应该过滤出指定项目前缀的镜像', () => {
      const imageList = createMockRef([...mockImages]);
      const { project, filteredRows } = useImageFilter(imageList);
      project.value = 'kubesphereio';
      expect(
        filteredRows.value.every((r) => r.name.startsWith('kubesphereio/')),
      ).toBe(true);
    });

    it('空项目值应该不过滤', () => {
      const imageList = createMockRef([...mockImages]);
      const { project, imageScope, filteredRows } = useImageFilter(imageList);
      imageScope.value = 'public'; // 确保范围过滤不影响
      project.value = '';
      expect(filteredRows.value).toHaveLength(3); // 3个公共镜像
    });
  });

  describe('按关键词过滤', () => {
    it('应该支持大小写不敏感搜索', () => {
      const imageList = createMockRef([...mockImages]);
      const { keyword, filteredRows } = useImageFilter(imageList);
      keyword.value = 'NGINX';
      expect(filteredRows.value).toHaveLength(1);
      expect(filteredRows.value[0]?.name).toBe('kubesphereio/nginx');
    });

    it('部分匹配应该返回正确结果', () => {
      const imageList = createMockRef([...mockImages]);
      const { keyword, filteredRows } = useImageFilter(imageList);
      keyword.value = 'redis';
      expect(filteredRows.value).toHaveLength(1);
      expect(filteredRows.value[0]?.name).toBe('kubesphereio/redis');
    });

    it('空关键词应该不过滤', () => {
      const imageList = createMockRef([...mockImages]);
      const { keyword, imageScope, filteredRows } = useImageFilter(imageList);
      imageScope.value = 'public'; // 确保范围过滤不影响
      keyword.value = '';
      expect(filteredRows.value).toHaveLength(3); // 3个公共镜像
    });

    it('无匹配关键词应该返回空数组', () => {
      const imageList = createMockRef([...mockImages]);
      const { keyword, filteredRows } = useImageFilter(imageList);
      keyword.value = 'nonexistent';
      expect(filteredRows.value).toHaveLength(0);
    });
  });

  describe('组合过滤', () => {
    it('应该同时应用多个过滤条件', () => {
      const imageList = createMockRef([...mockImages]);
      const { imageScope, project, keyword, filteredRows } =
        useImageFilter(imageList);
      imageScope.value = 'public';
      project.value = 'kubesphereio';
      keyword.value = 'nginx';
      expect(filteredRows.value).toHaveLength(1);
      expect(filteredRows.value[0]?.name).toBe('kubesphereio/nginx');
    });
  });

  describe('resetFilters', () => {
    it('应该重置所有过滤条件到默认值', () => {
      const imageList = createMockRef([...mockImages]);
      const { imageScope, project, keyword, resetFilters } =
        useImageFilter(imageList);
      imageScope.value = 'private';
      project.value = 'other';
      keyword.value = 'test';
      resetFilters();
      expect(imageScope.value).toBe('public');
      expect(project.value).toBe('kubesphereio');
      expect(keyword.value).toBe('');
    });
  });
});
