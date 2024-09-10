import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 赛道产品top10
export async function queryFundNavAndHolderRankList(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryFundNavAndHolderRankList, params);

  return data || [];
}
