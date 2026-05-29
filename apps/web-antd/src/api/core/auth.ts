import { useAccessStore } from '@vben/stores';

import { MOCK_CODES, MOCK_USERS } from '#/mock/auth';

export namespace AuthApi {
  export interface LoginParams {
    password?: string;
    selectAccount?: string;
    username?: string;
  }

  export interface LoginResult {
    accessToken: string;
  }
}

export async function loginApi(data: AuthApi.LoginParams) {
  const username = data.username || data.selectAccount || 'admin';
  const findUser = MOCK_USERS.find((item) => item.username === username);

  if (!findUser) {
    throw new Error('用户不存在');
  }

  const accessToken = `mock-access-token-${findUser.username}-${Date.now()}`;

  return { accessToken } as AuthApi.LoginResult;
}

export async function getAccessCodesApi() {
  const accessStore = useAccessStore();
  const token = accessStore.accessToken || '';
  const username = token.split('-')[3] || 'admin';
  const codes =
    MOCK_CODES.find((item) => item.username === username)?.codes ?? [];
  return codes;
}
