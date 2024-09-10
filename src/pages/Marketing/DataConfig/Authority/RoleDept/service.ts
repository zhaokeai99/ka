import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface OrgDeptInfo {
  deptId: string;
  deptName: string;
}
export interface TableListItem {
  roleId: string;
  roleName: string;
  authDepts: OrgDeptInfo[];
}

// 查询
export async function queryRoles(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryRoles, params);
  return data || {};
}
// 新增
export async function addRole(params = {}) {
  return await dispatchPass(API.marketingApi.addRole, params);
}
// 修改
export async function updateRole(params = {}) {
  return await dispatchPass(API.marketingApi.updateRole, params);
}
// 删除
export async function deleteRole(params = {}) {
  return await dispatchPass(API.marketingApi.deleteRole, params);
}
// bd系统部门组织架构信息
export async function queryOrgUserInfoTree(params = {}) {
  return await dispatchPass(API.marketingApi.queryOrgUserInfoTree, params);
}
