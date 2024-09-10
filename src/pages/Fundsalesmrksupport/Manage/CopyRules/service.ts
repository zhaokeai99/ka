import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
export interface TableListItem {
  id?: string;
  seasonId: string;
  divisionId?: string;
  type?: string;
  sort?: string;
  title: string;
  content: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryCopyRules(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryCopyRules, params);
  return data || [];
}
// 新增
export async function addCopyRules(params = {}) {
  return await dispatchPass(API.marketingApi.addCopyRules, params);
}
// 修改
export async function updateCopyRules(params = {}) {
  return await dispatchPass(API.marketingApi.updateCopyRules, params);
}
// 删除
export async function deleteCopyRules(params = {}) {
  return await dispatchPass(API.marketingApi.deleteCopyRules, params);
}

// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}
// 查询
export async function querySeasons(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySeason, params);
  return data || [];
}
// 根据赛区id查询赛季
export async function querySeasonByDivisionId(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySeasonByDivisionId, params);
  return data || [];
}
