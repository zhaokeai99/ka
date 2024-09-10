import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface BondTopItemType {
  bondCode: string;
  bondName: string;
  count: number;
  innerRating: string;
  orderNum: number;
  outerRating: string;
  tDate: string;
}

// 查询热点新闻列表
export interface IndustryHotspotType {
  documentId?: string;
  eventDate?: string;
  eventTitle?: string;
  fromSource?: string;
  newsUrl?: string;
  popularity?: number;
  newsContent?: string;
  selfWeight?: number;
}

// 查询行业政策
export interface IndustryPolicyType {
  emotion?: string;
  declareDate?: string;
  fullText?: string;
  industryName?: string;
  labelId?: string;
  labelTypeName?: number;
  labelName?: string;
  officeName?: string;
  policyAbstract?: string;
  policyId?: string;
  title?: string;
}

// 行业政策入参
interface IndustryPolicyPramas {
  current: number;
  pageSize: number;
}

// 查询复盘总结
export async function queryReplaySummary() {
  const { data } = await dispatchPass(API.industrialChain.MarketTrendFacadeQueryReplaySummary);

  return data || {};
}

// 查询热点新闻列表
export async function queryIndustryHotNewsList() {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryResearchFacadeQueryIndustryHotNewsList,
  );

  return data || [];
}

// 行业资金流向
export async function queryIndustryMoneyFlow() {
  const { data } = await dispatchPass(
    API.industrialChain.IndustryResearchFacadeQueryIndustryMoneyFlow,
  );

  return data || [];
}

// 行业政策
export async function queryIndustryPolicyListLimit(params: IndustryPolicyPramas) {
  const { success, data } = await dispatchPass(
    API.industrialChain.queryIndustryPolicyListLimit,
    params,
  );

  return { success, data };
}

// 查询政策详情to首页
export async function queryPolicyInfoToHomePage() {
  const { success, data } = await dispatchPass(API.industrialChain.queryPolicyInfoToHomePage);

  return { success, data };
}
