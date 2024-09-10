import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryManagerDetail(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryManagerDetail, params);
  return data || [];
}
