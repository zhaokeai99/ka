import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryFundCodeDividendInfos(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundCodeDividendInfos, params);
  return data;
}
