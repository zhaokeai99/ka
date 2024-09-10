import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  orgFundCode: string;
  orgFundName: string;
  fundCode: string;
  fundAbbr: string;
  dcFundAbbr: string;
  fundName: string;
  fundRaisingType: string;
  vogType: string;
  vogName: string;
  vogSubType: string;
  vogSubName: string;
}

export const fundRaisingTypeEnum = {
  0: '公募',
  1: '私募',
  3: '专户',
};

// 产品信息列表展示
export async function queryFundBasicInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryFundBasicInfo, params);
  return data || {};
}
// 产品vog类型配置
export async function setFundVogType(params = {}) {
  return await dispatchPass(API.marketingApi.setFundVogType, params);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
