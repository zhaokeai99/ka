import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  dptId: string;
  agencyNo: string;
  dptName: string;
  parentId: string;
  parentName: string;
  createTime: string;
  updateTime: string;
}

// 查询
export async function queryAgencyDeptInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyDeptInfo, params);
  return data || {};
}
// 新增
export async function addAgencyDeptInfo(params = {}) {
  return await dispatchPass(API.marketingApi.addAgencyDeptInfo, params);
}
// 修改
export async function updateAgencyDeptInfo(params = {}) {
  return await dispatchPass(API.marketingApi.updateAgencyDeptInfo, params);
}
// 删除
export async function deleteAgencyDeptInfo(params = {}) {
  return await dispatchPass(API.marketingApi.deleteAgencyDeptInfo, params);
}
// 查询机构信息列表
export async function queryAgencyInfo() {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyInfo, {
    currentPage: 1,
    pageSize: 500,
  });
  return transOptions(data.data, 'agencyName', 'agencyNo', false);
}
// 根据机构id查询部门信息
export async function queryDeptInfoByAgencyNo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDeptInfoByAgencyNo, params);
  return transOptions(data, 'dptName', 'dptId', false);
}
