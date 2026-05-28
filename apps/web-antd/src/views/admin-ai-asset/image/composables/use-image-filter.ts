import type { ImageRecord } from '../types';

import { computed, ref } from 'vue';

export function useImageFilter(imageList: { value: ImageRecord[] }) {
  const imageScope = ref<'private' | 'public'>('public');
  const project = ref('kubesphereio');
  const keyword = ref('');

  const filteredRows = computed(() => {
    let data = imageList.value.filter((r) =>
      imageScope.value === 'public' ? r.isPublic : !r.isPublic,
    );
    if (project.value) {
      data = data.filter((r) => r.name.startsWith(project.value + '/'));
    }
    if (keyword.value) {
      const lowerKeyword = keyword.value.toLowerCase();
      data = data.filter((r) => r.name.toLowerCase().includes(lowerKeyword));
    }
    return data;
  });

  function resetFilters(): void {
    imageScope.value = 'public';
    project.value = 'kubesphereio';
    keyword.value = '';
  }

  return {
    imageScope,
    project,
    keyword,
    filteredRows,
    resetFilters,
  };
}
