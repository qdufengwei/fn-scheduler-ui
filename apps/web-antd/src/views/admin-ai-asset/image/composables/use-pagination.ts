import { computed, ref } from 'vue';

interface UsePaginationOptions {
  defaultPageSize?: number;
  pageSizeOptions?: number[];
}

export function usePagination<T>(
  dataSource: { value: T[] },
  options: UsePaginationOptions = {},
) {
  const { defaultPageSize = 10, pageSizeOptions = [10, 20, 50, 100] } = options;

  const currentPage = ref(1);
  const pageSize = ref(defaultPageSize);

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return dataSource.value.slice(start, end);
  });

  const total = computed(() => dataSource.value.length);

  function resetPage(): void {
    currentPage.value = 1;
  }

  return {
    currentPage,
    pageSize,
    pageSizeOptions,
    paginatedData,
    total,
    resetPage,
  };
}
