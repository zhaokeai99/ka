import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function linearHotProducts(params: any) {
  const { data } = await dispatchPass(API.productionApi.linearHotProducts, params);
  const { content = [] } = data || {};
  return content || [];
}

export async function pageHotProducts(params: any) {
  const result = await dispatchPass(API.productionApi.pageHotProducts, params);
  return result;
}
