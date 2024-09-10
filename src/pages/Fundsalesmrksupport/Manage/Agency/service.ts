import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  agencyId: string;
  agencyName: string;
  agencyType: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryAgency(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgency, params);
  return data || [];
}
// 新增
export async function addFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.addAgency, params);
}
// 修改
export async function updateFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.updateAgency, params);
}
// 删除
export async function deleteAgency(params = {}) {
  return await dispatchPass(API.marketingApi.deleteAgency, params);
}
