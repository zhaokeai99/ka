import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 研报情绪/态度
export const publicSentimentList = [
  {
    label: '利好',
    value: '利好',
  },
  {
    label: '中性',
    value: '中性',
  },
  {
    label: '利空',
    value: '利空',
  },
];

// 观点统计柱状图数据
export async function queryIndustryReportInfoToChart(params: any) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryReportInfoToChart,
    params,
  );

  return { success, data };
}

// list列表数据
export async function queryIndustryReportInfoLimit(params: any) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryReportInfoLimit,
    params,
  );

  return { success, data };
}

// 查询行业节点树
export async function queryIndustryNodeTree(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryNodeTree, params);

  return { success, data };
}

// 分页查询行业新闻
export async function queryIndustryNewsLimit(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryNewsLimit, params);

  return { success, data };
}

// 查询行业新闻图表
export async function queryIndustryNewsChart(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryNewsChart, params);

  return { success, data };
}
