import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export async function queryFundPolicyList() {
  return await dispatchPass(API.productionApi.queryFundPolicyList);
}

export async function queryFundPolicyDetail(params: any) {
  return await dispatchPass(API.productionApi.queryFundPolicyDetail, params);
}
