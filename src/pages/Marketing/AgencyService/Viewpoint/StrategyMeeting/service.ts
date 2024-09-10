import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  meetingId: string;
  meetingTypeDesc: string;
  title: string;
  summary: string;
  meetingInfoUrl: string;
  meetingDate: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryAllStrategyMeeting(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAllStrategyMeeting, params);
  return data || {};
}
// 新增
export async function addStrategyMeeting(params = {}) {
  return await dispatchPass(API.marketingApi.addStrategyMeeting, params);
}
// 修改
export async function updateStrategyMeeting(params = {}) {
  return await dispatchPass(API.marketingApi.updateStrategyMeeting, params);
}
// 删除
export async function deleteStrategyMeeting(params = {}) {
  return await dispatchPass(API.marketingApi.deleteStrategyMeeting, params);
}
// 类型接口
export async function getTypeList() {
  const { data } = await dispatchPass(API.marketingApi.getMeetingTypeList);
  return transOptions(data, 'typeDesc', 'type', false);
}
