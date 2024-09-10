import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  dictTypeId: string;
  dictTypeName: string;
  memo: string;
}

// 查询
export async function queryDictType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDictType, params);
  return data || {};
}
// 新增
export async function addDictType(params = {}) {
  return await dispatchPass(API.marketingApi.addDictType, params);
}
// 删除
export async function deleteDictType(params = {}) {
  return await dispatchPass(API.marketingApi.deleteDictType, params);
}
