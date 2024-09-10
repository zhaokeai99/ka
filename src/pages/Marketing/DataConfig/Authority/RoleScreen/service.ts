import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  id: string;
  roleId: string;
  roleName: string;
  screenType: string;
  screenTypeName: string;
  display: string;
  conditionType: string;
  conditionTypeName: string;
  displayCondition: string[];
  displayConditionName: string;
  control: string;
  screenValue: string[];
  screenValueName: string;
  sorted: string;
}

export const booleEnum = {
  0: '否',
  1: '是',
};

// 查询
export async function queryRoleScreen(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryRoleScreen, params);
  return data || {};
}
// 新增
export async function addRoleScreen(params = {}) {
  return await dispatchPass(API.marketingApi.addRoleScreen, params);
}
// 修改
export async function updateRoleScreen(params = {}) {
  return await dispatchPass(API.marketingApi.updateRoleScreen, params);
}
// 删除
export async function deleteRoleScreen(params = {}) {
  return await dispatchPass(API.marketingApi.deleteRoleScreen, params);
}
// 筛选项值下拉列表
export async function queryScreenValueByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryScreenValueByType, params);
  return data || [];
}
// 角色信息下拉列表
export async function queryRoles(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryRoles, params);
  return transOptions(data, 'roleName', 'roleId', false);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
