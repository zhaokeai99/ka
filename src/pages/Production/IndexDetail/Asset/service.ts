import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryFundAssetPosition(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundAssetPosition, params);
  const { data: d } = data || {};
  return d || [];
}

export async function queryFundAsset(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundAsset, params);
  const { data: d } = data || {};
  return d || [];
}

export async function queryFundAssetHolder(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundAssetHolder, params);
  const { data: d } = data || {};
  return d || [];
}

export async function queryFundSalesHoldTop10(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundSalesHoldTop10, params);
  return data || [];
}
