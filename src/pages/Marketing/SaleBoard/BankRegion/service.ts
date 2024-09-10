import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  agencyCode: string;
  agencyName: string;
  firstBranchCode: string;
  firstBranchName: string;
  region: string;
  divideRule: string;
  parentVogRegion: string;
  vogRegion: string;
  vogRegionName: string;
  startDate: string;
  endDate: string;
}

export const divideRuleEnum = {
  0: '否',
  1: '是',
};

// 一级分行信息列表展示
export async function queryBankRegionInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryBankRegionInfo, params);
  return data || {};
}
// 一级分行考核区域信息展示
export async function getBankVogRegion(params = {}) {
  return await dispatchPass(API.marketingApi.getBankVogRegion, params);
}
// 一级分行考核区域设置
export async function setBankRegion(params = {}) {
  return await dispatchPass(API.marketingApi.setBankRegion, params);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
