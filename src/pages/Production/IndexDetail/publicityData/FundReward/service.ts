import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 获取获奖信息
export async function queryFundCodeAwardinfoData(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryFundCodeAwardinfoData, params);
  return data || {};
}

export async function queryProductScale(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryProductScale, params);
  return data || {};
}

// 查询展位
export async function queryComPlianceLibraryBoothIdData(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryComPlianceLibraryBoothIdData, params);
  return data;
}
