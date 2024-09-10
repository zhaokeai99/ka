import { request } from 'umi';
import { API } from './api';
import { mockApis } from './api.mock';

// 登录
export async function login(params: any) {
  return await request(API.login, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 登出
export async function logout() {
  return await request(API.logout, {
    method: 'GET',
  });
}

// 网关转发
export async function dispatchPass(operationType = '', params = {}) {
  if (REACT_APP_ENV === 'mock' && (mockApis === '*' || mockApis.includes(operationType))) {
    return await request(`/mock/${operationType.split('.').join('/')}`, {
      method: 'POST',
      data: { ...params },
    });
  }

  return await request(API.dispatchPass, {
    method: 'POST',
    data: {
      operationType,
      params,
    },
  });
}

// 获取用户信息
export async function getUserInfo() {
  return await dispatchPass(API.getUserInfo);
}

// 运行时环境选择
export function getBaseApi() {
  const { host } = window.location;

  switch (host) {
    case 'fundportal-test.tianhongjijin.com.cn':
      return 'http://10.111.169.186';
    case 'fundportal-pre.tianhongjijin.com.cn':
    case 'fundportal-pre.thfund.com.cn':
      return 'http://10.111.96.136';
    case 'fundportal-prod.tianhongjijin.com.cn':
    case 'fundportal-prod.thfund.com.cn':
    case 'fundportal.thfund.com.cn':
      return 'http://10.111.74.67';
    default:
      return 'http://10.111.96.136';
  }
}
