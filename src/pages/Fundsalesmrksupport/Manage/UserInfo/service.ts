import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  userId: string;
  userName: string;
  mobile: string;
  divisionId: string;
  agencyId: string;
  dptId: string;
  subBranchId: string;
  subBranchName: string;
  netId: string;
  netName: string;
  gmtCreate: string;
}

// 查询用户信息
export async function querySalesUserInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySalesUserInfo, params);
  return data || [];
}

// 删除用户信息
export async function deleteSalesUserInfo(params = {}) {
  return await dispatchPass(API.marketingApi.deleteSalesUserInfo, params);
}

// 修改用户信息
export async function updateSalesUserInfo(params = {}) {
  return await dispatchPass(API.marketingApi.updateSalesUserInfo, params);
}

// 查询部门信息
export async function queryDpt(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDpt, params);
  return data || [];
}

// 查询赛区信息
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}

// 查询机构信息
export async function queryAgency(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgency, params);
  return data || [];
}

// 根据部门ID查询支行信息
export async function querySubBranch(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySubBranch, params);
  return data || [];
}

// 根据父ID 查询下级部门
export async function queryInfoByParentId(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryInfoByParentId, params);
  return data || [];
}

// 查询网点信息
export async function queryNetBranch(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryNetBranch, params);
  return data || [];
}
