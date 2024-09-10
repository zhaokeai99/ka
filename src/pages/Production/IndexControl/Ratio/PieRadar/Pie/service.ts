import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 获取产品分布
export async function getProductPie(params = {}) {
  const { data, success } = await dispatchPass(
    API.productionApi.queryFundNavTop5GroupByManage,
    params,
  );

  const result = {
    data: (data && data.chartResults.map((e) => ({ ...e, value: parseFloat(e.value) }))) || [],
    total: (data && data.totalScale) || 0,
    success,
  };

  return result;
}
