import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  fundManagerId: number;
  fundManagerName: string;
  photoUrl: string;
  defaultIntroduction: string;
  introduction: string;
  createTime: string;
  updateTime: string;
}

// 查询
export async function queryFundManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryFundManagerInfo, params);
  return data || {};
}
// 新增
export async function addFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.addFundManagerInfo, params);
}
// 修改
export async function updateFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.updateFundManagerInfo, params);
}
// 删除
export async function deleteFundManager(params = {}) {
  return await dispatchPass(API.marketingApi.deleteFundManagerInfo, params);
}
