import { describe, expect, it } from 'vitest';

import { usePagination } from '../use-pagination';

interface MockItem {
  id: number;
  name: string;
}

describe('usePagination', () => {
  const mockData: MockItem[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `item-${i + 1}`,
  }));

  describe('初始化', () => {
    it('应该使用默认分页参数', () => {
      const dataSource = { value: [...mockData] };
      const { currentPage, pageSize, pageSizeOptions } =
        usePagination(dataSource);
      expect(currentPage.value).toBe(1);
      expect(pageSize.value).toBe(10);
      expect(pageSizeOptions).toEqual([10, 20, 50, 100]);
    });

    it('应该接受自定义分页参数', () => {
      const dataSource = { value: [...mockData] };
      const { pageSize } = usePagination(dataSource, { defaultPageSize: 5 });
      expect(pageSize.value).toBe(5);
    });
  });

  describe('paginatedData', () => {
    it('第一页应该返回前10条', () => {
      const dataSource = { value: [...mockData] };
      const { paginatedData } = usePagination(dataSource);
      expect(paginatedData.value).toHaveLength(10);
      expect(paginatedData.value[0]?.id).toBe(1);
      expect(paginatedData.value[9]?.id).toBe(10);
    });

    it('第二页应该返回11-20条', () => {
      const dataSource = { value: [...mockData] };
      const { currentPage, paginatedData } = usePagination(dataSource);
      currentPage.value = 2;
      expect(paginatedData.value).toHaveLength(10);
      expect(paginatedData.value[0]?.id).toBe(11);
      expect(paginatedData.value[9]?.id).toBe(20);
    });

    it('最后一页应该返回剩余数据', () => {
      const dataSource = { value: [...mockData] };
      const { currentPage, paginatedData } = usePagination(dataSource);
      currentPage.value = 3;
      expect(paginatedData.value).toHaveLength(5);
      expect(paginatedData.value[0]?.id).toBe(21);
    });

    it('空数据应该返回空数组', () => {
      const dataSource = { value: [] as MockItem[] };
      const { paginatedData } = usePagination(dataSource);
      expect(paginatedData.value).toEqual([]);
    });
  });

  describe('total', () => {
    it('应该返回数据总数', () => {
      const dataSource = { value: [...mockData] };
      const { total } = usePagination(dataSource);
      expect(total.value).toBe(25);
    });

    it('空数据应该返回0', () => {
      const dataSource = { value: [] as MockItem[] };
      const { total } = usePagination(dataSource);
      expect(total.value).toBe(0);
    });
  });

  describe('resetPage', () => {
    it('应该重置到第一页', () => {
      const dataSource = { value: [...mockData] };
      const { currentPage, resetPage } = usePagination(dataSource);
      currentPage.value = 3;
      resetPage();
      expect(currentPage.value).toBe(1);
    });
  });

  describe('响应式更新', () => {
    it('数据源变化时应该重新计算', () => {
      const dataSource = { value: [...mockData] };
      const { total, paginatedData } = usePagination(dataSource);
      dataSource.value = [...mockData, ...mockData];
      expect(total.value).toBe(50);
      expect(paginatedData.value).toHaveLength(10);
    });
  });
});
