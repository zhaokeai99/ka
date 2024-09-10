import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryLastQuaryDay() {
  const { data } = await dispatchPass(API.productionApi.queryLastQuaryDay);
  return data;
}

export async function queryFundHoldPercent(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundHoldPercent, params);
  return data || [];
}

export async function queryFundSalesHoldTop10(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundSalesHoldTop10, params);
  return data || [];
}

export async function queryFundShowIncomeInfos(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundShowIncomeInfos, params);
  return data || [];
}
