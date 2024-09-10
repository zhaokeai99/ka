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
  parentId: string;
  parentName: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function querySubBranch(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySubBranch, params);
  return data || [];
}
// 新增
export async function addSubBranch(params = {}) {
  return await dispatchPass(API.marketingApi.addSubBranch, params);
}
// 修改
export async function updateSubBranch(params = {}) {
  return await dispatchPass(API.marketingApi.updateSubBranch, params);
}
// 删除
export async function deleteSubBranch(params = {}) {
  return await dispatchPass(API.marketingApi.deleteSubBranch, params);
}

// 查询
export async function queryDpt(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDpt, params);
  return data || [];
}

// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}

// 查询
export async function queryAgency(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgency, params);
  return data || [];
}

// 根据赛区ID 查询下面所有机构信息
export async function queryAgencyByDivisionId(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyByDivisionId, params);
  return data || [];
}
