import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryLastQuaryDay(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryLastQuaryDay, params);
  return data;
}

export async function queryFundIncomeTrendData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundIncomeTrendData, params);
  return data || [];
}

export async function queryIncomeRateData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIncomeRateData, params);
  return data;
}

export async function queryAllIncomeRateData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryAllIncomeRateData, params);
  return data || [];
}

export async function queryFundPerformanceInfos(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundPerformanceInfos, params);
  return data || [];
}

export async function querySearchIndexInfo(params: { keyword: string }) {
  const { data } = await dispatchPass(API.productionApi.querySearchIndexInfo, params);

  return data;
}
