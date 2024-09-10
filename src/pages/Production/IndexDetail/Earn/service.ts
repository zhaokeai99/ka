import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryEarnFundAsset(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryEarnFundAsset, params);
  return data?.data || [];
}

export async function queryFundAssetLimit(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundAssetLimit, params);
  return data?.data || [];
}

export async function queryFundAssetPullback(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundAssetPullback, params);
  return data?.data || [];
}
