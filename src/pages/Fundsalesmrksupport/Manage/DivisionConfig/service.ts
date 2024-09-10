import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  divisionId: string;
  divisionName: string;
  state: number;
  defaultIntroduction: string;
  divisionAnotherName: string;
  pushActivityName: string;
  backgroundImage: string;
  rankNum: number;
  rankDefault: number;
  rankAbstract: string;
  managerImage: string;
  managerName: string;
  pushEmail: string;
  redirectUrl: string;
  configState: number;
  gmtCreate: string;
  gmtModified: string;
  ranking: any;
  rankName: any;
  divisionURL: string;
  divisionQRCode: any;
}

// 查询
export async function queryDivisionConfigManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivisionConfig, params);
  return data || [];
}
// 新增
export async function addFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.addDivisionConfig, params);
}
// 修改
export async function updateFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.updateDivisionConfig, params);
}
// 删除
export async function deleteFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.deleteDivisionConfig, params);
}

// 查询
export async function queryDivisionManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDivision, params);
  return data || [];
}
