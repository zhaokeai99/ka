import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  fundCode: string;
  wProductCode: string;
  fundName: string;
  companyName?: number;
  buyRate: string;
  redeemRate: string;
  gmtCreate: string;
  gmtModified: string;
}

// 查询
export async function queryChallengeCommonProduct(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryChallengeCommonProduct, params);
  return data.tradeInfos || [];
}
// 新增
export async function addChallengeCommonProduct(params = {}) {
  return await dispatchPass(API.marketingApi.addChallengeCommonProduct, params);
}
// 修改
export async function updateChallengeCommonProduct(params = {}) {
  return await dispatchPass(API.marketingApi.updateChallengeCommonProduct, params);
}
// 删除
export async function deleteChallengeCommonProduct(params = {}) {
  return await dispatchPass(API.marketingApi.deleteChallengeCommonProduct, params);
}
