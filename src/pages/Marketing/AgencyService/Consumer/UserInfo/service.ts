import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  userId: string;
  userName: string;
  userType: string;
  mobile: string;
  agencyName: string;
  deptName: string;
  verify: number;
  registerState: number;
  wechatBind: number;
}

export const userTypeEnum = {
  0: '机构客户',
  1: '公司内部用户',
};
export const verifyEnum = {
  0: '审核不通过',
  1: '审核通过',
  2: '审核中',
};
export const registerStateEnum = {
  0: '未注册',
  1: '已注册',
};
export const wechatBindEnum = {
  0: '未绑定',
  1: '绑定',
};

// 机构信息
export async function queryAgencyInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyInfo, params);
  return transOptions(data.data || [], 'agencyName', 'agencyNo', false);
}

// 部门信息
export async function queryDeptInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryDeptInfoByAgencyNo, params);
  return transOptions(data, 'dptName', 'dptId', false);
}

// 查询
export async function queryFundManager(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryUserInfo, params);
  return data || {};
}
// 新增
export async function userInfoConfig(params = {}) {
  return await dispatchPass(API.marketingApi.userInfoConfig, params);
}
// 修改
export async function userInfoConfigUpdate(params = {}) {
  return await dispatchPass(API.marketingApi.userInfoConfigUpdate, params);
}
