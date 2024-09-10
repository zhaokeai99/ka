import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询行业舆情统计图表
export async function queryStatChart(params = {}) {
  const { data, success } = await dispatchPass(
    API.informationApi.IndustryNewsFacadeQueryStatChart,
    params,
  );
  return {
    data,
    success,
  };
}
