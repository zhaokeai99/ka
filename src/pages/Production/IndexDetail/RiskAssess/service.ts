import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function getFundQuotaScore(params: any) {
  const { data } = await dispatchPass(API.productionApi.getFundQuotaRadar, params);
  return data || {};
}

export async function getFundQuotaDescribeList() {
  const { data } = await dispatchPass(API.productionApi.getFundQuotaDescribeList);
  return data || [];
}
