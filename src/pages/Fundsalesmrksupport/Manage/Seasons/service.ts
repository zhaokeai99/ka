import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  state?: string | number;
  seasonId?: string;
  seasonName?: string;
  divisionId?: string | number;
  startDate?: string | any;
  endDate?: string | any;
  experienceAmount?: string;
  channelId?: string;
  activityId?: string;
  gmtCreate?: string | any;
  gmtModified?: string | any;
}

// 查询
export async function querySeasons(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySeason, params);
  return data || [];
}
// 新增
export async function addSeasons(params = {}) {
  return await dispatchPass(API.marketingApi.addSeason, params);
}
// 修改
export async function updateSeasons(params = {}) {
  return await dispatchPass(API.marketingApi.updateSeason, params);
}
// 删除
export async function deleteSeasons(params = {}) {
  return await dispatchPass(API.marketingApi.deleteSeason, params);
}
// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}
