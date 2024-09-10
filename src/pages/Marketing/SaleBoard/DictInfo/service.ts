import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  id: string;
  dictTypeId: string;
  dictTypeName: string;
  dictKey: string;
  dictValue: string;
  parentKey: string;
  display: string;
  sorted: string;
  memo: string;
}

export const displayEnum = {
  0: '否',
  1: '是',
};

// 查询
export async function queryDict(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDict, params);
  return data || {};
}
// 字典类型下拉列表展示
export async function getDictType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDictType, params);
  return transOptions(data, 'dictTypeName', 'dictTypeId', false);
}
// 字典类型树
export async function getDictTypeTree(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictTypeTree, params);
  return transOptions(data, 'value', 'key', false);
}
// 新增
export async function addDict(params = {}) {
  return await dispatchPass(API.marketingApi.addDict, params);
}
// 修改
export async function updateDict(params = {}) {
  return await dispatchPass(API.marketingApi.updateDict, params);
}
// 删除
export async function deleteDict(params = {}) {
  return await dispatchPass(API.marketingApi.deleteDict, params);
}
