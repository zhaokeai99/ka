import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 获取产品分布
export async function getProductPie(params = {}) {
  const { data, success } = await dispatchPass(API.mainPage.queryFundTypeScale, params);
  const result = {
    data: (data && data.dataList.map((e) => ({ ...e, value: parseFloat(e.value) }))) || [],
    total: (data && data.total && parseFloat(data.total)) || 0,
    current: (data && data.pageNum) || 1,
    pageSize: (data && data.pageSize) || 5,
    success,
  };
  return result;
}
