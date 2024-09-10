import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryPcfFlow(params: any) {
  return await dispatchPass(API.productionApi.queryPcfFlow, params);
}
export async function queryPcfFlowDetail(params: any) {
  return await dispatchPass(API.productionApi.queryPcfFlowDetail, params);
}
