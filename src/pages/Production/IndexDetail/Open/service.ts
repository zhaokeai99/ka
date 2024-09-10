import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function getFundOpenDateInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getFundOpenDateInfo, params);
  return data || {};
}
