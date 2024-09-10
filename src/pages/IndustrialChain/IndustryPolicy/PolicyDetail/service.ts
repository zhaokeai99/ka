import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询单条政策详情
export async function queryIndustryPolicyInfo(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryPolicyInfo, params);

  return { success, data };
}
