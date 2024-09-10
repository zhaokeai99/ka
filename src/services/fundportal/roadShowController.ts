// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** cancel POST /roadshow/cancel */
export async function cancelRoadShowMeetingUsingPOST(body: any, options?: { [key: string]: any }) {
  return request<API.WebResultList_>('/roadshow/cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** create POST /roadshow/create */
export async function createRoadShowMeetingUsingPOST(body: any, options?: { [key: string]: any }) {
  return request<API.WebResultRoadShowMeetingDomain_>('/roadshow/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** detail POST /roadshow/detail */
export async function detailUsingPOST(body: any, options?: { [key: string]: any }) {
  return request<API.WebResultListRoadShowMeetingDomain_>('/roadshow/detail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** modify POST /roadshow/modify */
export async function modifyRoadShowMeetingUsingPOST(body: any, options?: { [key: string]: any }) {
  return request<API.WebResultRoadShowMeetingDomain_>('/roadshow/modify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** query POST /roadshow/query */
export async function queryUsingPOST(body: any, options?: { [key: string]: any }) {
  return request<API.WebResultListRoadShowMeetingDomain_>('/roadshow/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** query POST /ehr/query */
export async function searchEHRPOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/ehr/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** query POST /ehr/querybygroup */
export async function searchGroupPeoplePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('/ehr/querybygroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
