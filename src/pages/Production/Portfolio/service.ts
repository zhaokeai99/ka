import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export async function queryComposePageList(params: any) {
  const newParam = { ...params, pageNo: params.current };
  const { data, success } = await dispatchPass(API.productionApi.queryComposePageList, newParam);
  const result = {
    data: (data && data.dataList) || [],
    total: (data && data.total) || 0,
    current: (data && data.pageNum) || 1,
    pageSize: (data && data.pageSize) || 5,
    success,
  };
  return result;
}
export async function queryProductCategoryDropDownList() {
  return await dispatchPass(API.productionApi.queryProductCategoryDropDownList);
}
