import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  id: string;
  vogType: string;
  vogTypeValue: string;
  vogYear: string;
  vogTarget: string;
  sys: string;
  sysValue: string;
  dept: string;
  deptValue: string;
  fundType: string;
  fundTypeValue: string;
  salesType: string;
  salesTypeValue: string;
}

// 查询
export async function queryVogTargetInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryVogTargetInfo, params);
  return data || {};
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
// bd系统部门查询
export async function querySysDeptInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.querySysDeptInfo, params);
  return transOptions(data, 'deptName', 'deptId', false);
}
// 新增
export async function addVogTargetInfo(params = {}) {
  return await dispatchPass(API.marketingApi.addVogTargetInfo, params);
}
// 修改
export async function updateVogTargetInfo(params = {}) {
  return await dispatchPass(API.marketingApi.updateVogTargetInfo, params);
}
// 删除
export async function deleteVogTargetInfo(params = {}) {
  return await dispatchPass(API.marketingApi.deleteVogTargetInfo, params);
}
