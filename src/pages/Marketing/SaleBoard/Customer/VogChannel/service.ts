import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  orgAgencyCode: string;
  orgAgencyName: string;
  agencyCode: string;
  agencyName: string;
  orgType: string;
  orgTypeName: string;
  orgSubType: string;
  orgSubTypeName: string;
}

// 查询
export async function queryVogChannelInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryVogChannelInfo, params);
  return data || {};
}
// 二级机构类型字典项
export async function getOrgType(params = {}) {
  return await dispatchPass(API.marketingApi.getOrgType, params);
}
// 字典信息查询
export async function getDictInfoByType(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.getDictInfoByType, params);
  return transOptions(data, 'dictValue', 'dictKey', false);
}
// 渠道信息下拉列表展示
export async function getAgencyCode(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyBasicInfos, params);
  return transOptions(data, 'agencyName', 'agencyCode', false);
}
// 新增
export async function addVogChannel(params = {}) {
  return await dispatchPass(API.marketingApi.addVogChannel, params);
}
// 修改
export async function updateVogChannel(params = {}) {
  return await dispatchPass(API.marketingApi.updateVogChannel, params);
}
// 删除
export async function deleteVogChannel(params = {}) {
  return await dispatchPass(API.marketingApi.deleteVogChannel, params);
}
