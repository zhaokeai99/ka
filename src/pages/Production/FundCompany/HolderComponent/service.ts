import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryLastQuaryDay() {
  const { data } = await dispatchPass(API.productionApi.queryLastQuaryDay);
  return data;
}

export async function queryCompanyHoldData(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryCompanyHoldData, params);
  return data || [];
}
