import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询研报分析页面单条新闻详情
export async function queryIndustryReportInfo(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryReportInfo, params);

  return { success, data };
}
