import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  agencyCode: string;
  agencyName: string;
  agencyKind: string;
  agencyKindName: string;
  agencySubKind: string;
  agencySubKindName: string;
}

// 渠道信息列表展示
export async function queryAgencyBasicInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyBasicInfos, params);
  return data || {};
}
// 渠道二级类型配置
export async function setAgencyKind(params = {}) {
  return await dispatchPass(API.marketingApi.setAgencyKind, params);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
