import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 获取获奖信息
export async function queryCompanyAwardinfoData(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryCompanyAwardinfoData, params);
  return data || {};
}

export async function queryCompanyAwardinfoLine() {
  const { data } = await dispatchPass(API.productionApi.queryCompanyAwardinfoLine);
  return data || [];
}
