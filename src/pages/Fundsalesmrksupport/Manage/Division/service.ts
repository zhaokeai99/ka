import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  divisionId: string;
  divisionName: string;
  state?: number;
  defaultIntroduction: string;
  divisionAnotherName: string;
  backgroundImage: string;
  configState: number;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}
// 新增
export async function addFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.addDivision, params);
}
// 修改
export async function updateFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.updateDivision, params);
}
// 删除
export async function deleteFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.deleteDivision, params);
}
