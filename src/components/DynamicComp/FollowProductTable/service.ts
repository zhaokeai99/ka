import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 获取关注的产品
export async function getFollowProduct(params = {}) {
  const newParam = { ...params, pageNo: params.current };
  const { data, success } = await dispatchPass(API.mainPage.queryUserFocusFunds, newParam);
  const result = {
    data: (data && data.dataList) || [],
    total: (data && data.total) || 0,
    current: (data && data.pageNum) || 1,
    pageSize: (data && data.pageSize) || 5,
    success,
  };
  return result;
}
