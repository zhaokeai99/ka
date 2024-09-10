import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface RoleInfo {
  roleId: string;
  roleName: string;
}
export interface TableListItem {
  userId: string;
  userName: string;
  nickName: string;
  mobile: string;
  email: string;
  roles: RoleInfo[];
}

// 钉钉部门组织架构
export async function queryDingUserInfoTree(params = {}) {
  return await dispatchPass(API.marketingApi.queryDingUserInfoTree, params);
}
// 钉钉人员信息列表展示
export async function queryDingUser(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDingUser, params);
  return data || {};
}
// 机构客户信息配置
export async function setUserRole(params = {}) {
  return await dispatchPass(API.marketingApi.setUserRole, params);
}
// 角色信息下拉列表
export async function queryRoles(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryRoles, params);
  return transOptions(data, 'roleName', 'roleId', false);
}
