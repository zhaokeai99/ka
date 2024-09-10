import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';
import { transOptions } from '@/utils/utils';

export interface TableListItem {
  id: string;
  viewpointType: number;
  viewpointDate: string;
  optimismAgencyNumber: number;
  neutralityAgencyNumber: number;
  cautiousAgencyNumber: number;
  agencySum: number;
  extInfo: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryMarketViewPoint(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMarketViewPoint, params);
  return data || [];
}
// 新增
export async function addMarketViewPoint(params = {}) {
  return await dispatchPass(API.marketingApi.addMarketViewPoint, params);
}
// 修改
export async function updateMarketViewPoint(params = {}) {
  return await dispatchPass(API.marketingApi.updateMarketViewPoint, params);
}
// 删除
export async function deleteMarketViewPoint(params = {}) {
  return await dispatchPass(API.marketingApi.deleteMarketViewPoint, params);
}
// 市场观点状态与描述下拉下拉列表
export async function queryMarketViewPointTypeDesc() {
  const { data } = await dispatchPass(API.marketingApi.queryMarketViewPointTypeDesc);
  return transOptions(data, 'typeDesc', 'type', false);
}
