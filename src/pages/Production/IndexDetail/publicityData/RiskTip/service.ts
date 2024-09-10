import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryRiskStatementData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryRiskStatementData, params);
  return data;
}

export async function saveRiskStatementData(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveRiskStatementData, params);
  return data;
}

export async function queryRecentYearsIncomeData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryRecentYearsIncomeData, params);
  return data || [];
}
