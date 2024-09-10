import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 宣推排名
export async function queryFundEvaluateData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundEvaluateData, params);
  return data || {};
}
