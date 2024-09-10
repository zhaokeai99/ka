import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  dptId: string;
  dptName: string;
  divisionId: string;
  divisionName: string;
  dptType: string;
  agencyId: string;
  agencyName: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryDpt(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDpt, params);
  return data || [];
}
// 新增
export async function addFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.addDpt, params);
}
// 修改
export async function updateFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.updateDpt, params);
}
// 删除
export async function deleteAgency(params = {}) {
  return await dispatchPass(API.marketingApi.deleteDpt, params);
}

// 查询
export async function queryAgency(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgency, params);
  return data || [];
}

// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}

// 根据赛区ID 查询下面所有机构信息
export async function queryAgencyByDivisionId(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyByDivisionId, params);
  return data || [];
}
