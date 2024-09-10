import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询单条新闻详情
export async function queryIndustryNewsInfo(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryNewsInfo, params);

  return { success, data };
}
