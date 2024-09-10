// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** createBizComponent POST /ui/bizcomponent/create */
export async function createBizComponentUsingPOST(
  body: API.CreateBizComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultBizComponentModel_>('/ui/bizcomponent/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** modifyComponent POST /ui/bizcomponent/modify */
export async function modifyComponentUsingPOST(
  body: API.UpdateBizComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultBizComponentModel_>('/ui/bizcomponent/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryBizComponent POST /ui/bizcomponent/query */
export async function queryBizComponentUsingPOST(
  body: API.QueryComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultPageResponseListBizComponentModel_>('/ui/bizcomponent/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** querySingleBizComponent POST /ui/bizcomponent/query/single */
export async function querySingleBizComponentUsingPOST(
  body: API.QueryByIdRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultBizComponentModel_>('/ui/bizcomponent/query/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryBizComponentByIds POST /ui/bizcomponent/queryByIds */
export async function queryBizComponentByIdsUsingPOST(
  body: API.QueryComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultListBizComponentModel_>('/ui/bizcomponent/queryByIds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
