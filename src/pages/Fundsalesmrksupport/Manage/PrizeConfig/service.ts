import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id?: string | number;
  infoId?: string | number;
  divisionId?: string | number;
  seasonId?: string;
  receiveWay?: string;
  startTime?: string | any;
  endTime?: string | any;
  receiveMembers?: string | number;
  prizeLevel?: string | number;
  prizeName?: string;
  imageUrl?: string;
  gmtCreate?: string | any;
  gmtModified?: string | any;
}

// 查询
export async function queryPrizeConfig(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryPrizeConfig, params);
  return data || [];
}
// 新增
export async function addPrizeConfig(params = {}) {
  return await dispatchPass(API.marketingApi.addPrizeConfig, params);
}
// 修改
export async function updatePrizeConfig(params = {}) {
  return await dispatchPass(API.marketingApi.updatePrizeConfig, params);
}
// 删除
export async function deletePrizeConfig(params = {}) {
  return await dispatchPass(API.marketingApi.deletePrizeConfig, params);
}
// 查询
export async function querySeasons(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySeason, params);
  return data || [];
}
// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}

// 根据赛区id查询赛季
export async function querySeasonByDivisionId(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySeasonByDivisionId, params);
  return data || [];
}
