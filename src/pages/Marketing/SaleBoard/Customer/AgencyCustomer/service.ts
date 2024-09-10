import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  thuserid: string;
  fundacco: string;
  brokerDomainId: string;
  investorType: string;
  investorName: string;
  deptId: string;
  deptName: string;
  capitalType: string;
  capitalTypeName: string;
  cooperDept: string;
  cooperDeptName: string;
  orgAgencyCode: string;
  orgAgencyName: string;
  firstBranchCode: string;
  firstBranchName: string;
  memo: string;
}

export const investorTypeEnum = {
  0: '机构',
  1: '个人',
  2: '产品',
};

// 机构客户信息列表展示
export async function queryOrgCustomerInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryOrgCustomerInfo, params);
  return data || {};
}
// 机构客户信息配置
export async function setOrgCustomerInfo(params = {}) {
  return await dispatchPass(API.marketingApi.setOrgCustomerInfo, params);
}
// 考核归属渠道下拉列表
export async function getOrgAgencyInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryVogChannelInfo, params);
  return transOptions(data, 'orgAgencyName', 'orgAgencyCode', false);
}
// 一级分行信息列表展示
export async function queryBankInfo(params = {}) {
  return await dispatchPass(API.marketingApi.queryBankInfo, params);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
