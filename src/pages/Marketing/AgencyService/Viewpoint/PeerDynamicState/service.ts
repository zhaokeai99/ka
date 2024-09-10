import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id: string;
  dynamicDate: string;
  fundFlowIntoRatio: string;
  fundFlowIntoProductName: string;
  extInfo: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryPeerDynamicState(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryPeerDynamicState, params);
  return data || [];
}
// 新增
export async function addPeerDynamicState(params = {}) {
  return await dispatchPass(API.marketingApi.addPeerDynamicState, params);
}
// 修改
export async function updatePeerDynamicState(params = {}) {
  return await dispatchPass(API.marketingApi.updatePeerDynamicState, params);
}
// 删除
export async function deletePeerDynamicState(params = {}) {
  return await dispatchPass(API.marketingApi.deletePeerDynamicState, params);
}
