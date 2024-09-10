import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryStockRange(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryStockRange, params);
  return data || { data: [], totalRatioView: '-' };
}

export async function queryBondRange(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryBondRange, params);
  return data || { data: [], totalRatioView: '-' };
}

export async function queryBondIndustry(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryBondIndustry, params);
  return data || { data: [], totalRatioView: '-' };
}

export async function queryStockIndustry(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryStockIndustry2, params);
  return data || { data: [], totalRatioView: '-' };
}
