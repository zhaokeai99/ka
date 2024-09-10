// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** createUiComponent POST /ui/uicomponent/create */
export async function createUiComponentUsingPOST(
  body: API.CreateUiComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultUiComponentModel_>('/ui/uicomponent/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** modifyUiComponent POST /ui/uicomponent/modify */
export async function modifyUiComponentUsingPOST1(
  body: API.UpdateUiComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultUiComponentModel_>('/ui/uicomponent/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** queryUiComponent POST /ui/uicomponent/query */
export async function queryUiComponentUsingPOST1(
  body: API.QueryComponentRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultPageResponseListUiComponentModel_>('/ui/uicomponent/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** querySingleUiComponent POST /ui/uicomponent/query/single */
export async function querySingleUiComponentUsingPOST1(
  body: API.QueryByIdRequest,
  options?: { [key: string]: any },
) {
  return request<API.WebResultUiComponentModel_>('/ui/uicomponent/query/single', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
