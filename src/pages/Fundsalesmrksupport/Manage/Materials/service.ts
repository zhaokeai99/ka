import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  state?: string;
  staticOrder?: string;
  id?: string;
  seasonId?: string;
  divisionId?: string;
  title?: string;
  titleColour?: string;
  mainContent?: string;
  mainContentColour?: string;
  content?: string;
  contentColour?: string;
  backgroundPicture?: string;
  skipUrl?: string;
  gmtCreate?: string | any;
  gmtModified?: string | any;
}

// 查询
export async function queryMaterials(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMaterials, params);
  return data || [];
}
// 新增
export async function addMaterials(params = {}) {
  return await dispatchPass(API.marketingApi.addMaterials, params);
}
// 修改
export async function updateMaterials(params = {}) {
  return await dispatchPass(API.marketingApi.updateMaterials, params);
}
// 删除
export async function deleteMaterials(params = {}) {
  return await dispatchPass(API.marketingApi.deleteMaterials, params);
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
