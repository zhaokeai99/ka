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

// 查询行业节点树
export async function queryIndustryNodeTree(params: any) {
  const { success, data } = await dispatchPass(API.industrialChain.queryIndustryNodeTree, params);

  return { success, data };
}

// 分页查询行业政策
export async function queryIndustryPolicyListLimit(params: any) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryPolicyListLimit,
    params,
  );

  return { success, data };
}

// 查询行业政策图表
export async function queryIndustryPolicyDataGroupBy(params: any) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryPolicyDataGroupBy,
    params,
  );

  return { success, data };
}
