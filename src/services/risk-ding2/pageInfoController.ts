// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** createPage POST /ui/pageinfo/create */
export async function createPageUsingPOST(
  body: API.CreatePageRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultPageModel_>('/ui/pageinfo/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** modifyUiComponent POST /ui/pageinfo/modify */
export async function modifyUiComponentUsingPOST(
  body: API.UpdatePageRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultPageModel_>('/ui/pageinfo/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryUiComponent POST /ui/pageinfo/query */
export async function queryUiComponentUsingPOST(
  body: API.QueryComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultPageResponseListPageModel_>('/ui/pageinfo/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** querySingleUiComponent POST /ui/pageinfo/query/single */
export async function querySingleUiComponentUsingPOST(
  body: API.QueryByIdRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultPageModel_>('/ui/pageinfo/query/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
