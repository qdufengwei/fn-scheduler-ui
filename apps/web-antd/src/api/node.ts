import { MOCK_NODES } from '#/mock/node';

export async function getNodeList() {
  return {
    data: {
      list: MOCK_NODES,
      total: MOCK_NODES.length,
      page: 1,
      pageSize: 10,
    },
  };
}

export async function getNodeDetail() {
  return { data: MOCK_NODES[0] };
}
