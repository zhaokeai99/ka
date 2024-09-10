// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** POST  */
export async function applicationCreatePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwApplication/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function applicationDeletePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwApplication/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function applicationModifyPOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwApplication/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function applicationQueryPOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwApplication/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function methodInfoCreatePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwMethodInfo/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function methodInfoDeletePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwMethodInfo/del', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function methodInfoModifyPOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwMethodInfo/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** POST  */
export async function methodInfoQueryPOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/mobileGwMethodInfo/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
