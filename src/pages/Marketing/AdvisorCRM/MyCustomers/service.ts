import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryFinancialAdvisorCustomerList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryFinancialAdvisorCustomerList, params);
  return data || {};
}
