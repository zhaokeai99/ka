import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryCustOwnershipInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryCustOwnershipInfo, params);
  return data || {};
}
