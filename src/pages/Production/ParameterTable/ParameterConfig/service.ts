import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 方案列表
export async function queryProductDataSearch() {
  const { data } = await dispatchPass(API.productionApi.queryProductDataSearch);

  return data;
}
