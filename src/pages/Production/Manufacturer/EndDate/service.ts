import type { DailyReportListParams } from './data';
import { request } from 'umi';
import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查找列表
export async function dailyReportList(data?: DailyReportListParams) {
  const { data: result } = await dispatchPass(API.productionApi.queryDailyReportList, {
    ...data,
    pageNo: data?.current,
  });

  return { ...result, data: result.dataList || [] };
}

// 通知
export async function reminderNotification(id: any, type: string) {
  const { data } = await dispatchPass(API.productionApi.reminderNotification, {
    id,
    notificationEnum: type,
  });

  return data;
}

// 周报通知
export async function reminderWeeklyNotification(id: any) {
  const { success } = await request(API.productionApi.reminderWeeklyNotification, {
    method: 'POST',
    params: {
      id,
    },
  });

  if (success) {
    return true;
  }

  return false;
}

// 修改
export async function expirationDate(params: any) {
  const { data } = await dispatchPass(API.productionApi.expirationDate, params);

  return !!data;
}
