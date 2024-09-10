import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryFundPortPieChart() {
  const { success, data } = await dispatchPass(API.productionApi.queryFundPortPieChart);
  return success && data.dataList
    ? data.dataList.map((d: any) => ({
        name: d.name,
        value: parseInt(d.value),
      }))
    : [];
}

// 公募存续分布图
export async function queryFundSurvivalPieChart() {
  const { success, data } = await dispatchPass(API.productionApi.queryFundSurvivalPieChart);
  return success && data
    ? data.map((item: any) => ({
        name: item.label,
        value: parseInt(item.value),
      }))
    : [];
}

export default {
  queryFundPortPieChart,
  queryFundSurvivalPieChart,
};
