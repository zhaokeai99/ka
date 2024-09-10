import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  agencyNo: string;
  agencyName: string;
  agencyType: string;
  agencyTypeDesc: string;
  createTime: string;
  updateTime: string;
}

// 查询
export async function queryAgencyInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyInfo, params);
  return data || {};
}
// 新增
export async function addAgencyInfo(params = {}) {
  return await dispatchPass(API.marketingApi.addAgencyInfo, params);
}
// 修改
export async function updateAgencyInfo(params = {}) {
  return await dispatchPass(API.marketingApi.updateAgencyInfo, params);
}
