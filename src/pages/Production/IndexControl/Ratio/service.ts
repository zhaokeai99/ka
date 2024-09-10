import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 天弘基金指数赛道中排名雷达图
export async function calThIndexSectorLatestRanking(params: any) {
  const { data } = await dispatchPass(API.productionApi.calThIndexSectorLatestRanking, params);

  return data || [];
}
