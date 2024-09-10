// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** cancel POST  */
// 疲劳度控制查询
export async function queryFatiguePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('http://fatigue.thfund.com.cn/api/controller/fatigueControl/queryFatigue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** create POST  */
// 疲劳度行为上报
export async function putFatiguePOST(body: any, options?: { [key: string]: any }) {
  return request<any>('http://fatigue.thfund.com.cn/api/controller/fatigueControl/putFatigue', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
