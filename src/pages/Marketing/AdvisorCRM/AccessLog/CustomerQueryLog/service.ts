import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryUserOperationLog(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryUserOperationLog, params);
  return data || {};
}
