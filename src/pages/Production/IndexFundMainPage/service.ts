import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

/** 指标卡片基本信息 */
export async function queryStatisticCardInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundMarketData, params);
  return data;
}
/** 日报 */
export async function queryIndexFundDailyReport(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundDailyReport, params);
  return data;
}
/** 热门板块 */
export async function queryIndexFundHotPlate(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundHotPlate, params);
  return data;
}
/** 查询所有ETF指数基金 */
export async function queryAllEtfFunds(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundAllEtfFunds, params);
  return data;
}
/** 实时估值 */
export async function queryIndexFundEtfRealFaNav(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundEtfRealFaNav, params);
  return data;
}
/** 全市场ETF资金流向 */
export async function queryIndexFundAllMarketCapital(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundAllMarketCapital, params);
  return data || [];
}
/** 基金公司TOP数据 */
export async function queryIndexFundCompanyScaleTop(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryIndexFundCompanyScaleTop, params);
  return data || [];
}

/** 查询近一日ETF资金流入情况 */
export async function queryOneInflowAmount(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryOneInflowAmount, params);
  return data || [];
}

/** 查询今年ETF资金流入情况 */
export async function queryThisYearInflowAmount(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryThisYearInflowAmount, params);
  return data || [];
}

/** 查询最新ETF规模分布情况 */
export async function queryNewScaleAmount(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryNewScaleAmount, params);
  return data || [];
}

/** 我司ETF基金流动性 */
export async function querythFundMobility(params: any) {
  const { data } = await dispatchPass(API.productionApi.thFundMobility, params);
  return data || [];
}

/** 行业产品资金流向 */
export async function industryProductCapital(params: any) {
  const { data } = await dispatchPass(API.productionApi.industryProductCapital, params);
  return data || [];
}

/** 查询ETF行业分类 */
export async function queryIndustry() {
  const { data } = await dispatchPass(API.productionApi.queryIndustry);
  return data || [];
}

/** 查询样本详情 */
export async function querySampleData(params: any) {
  const { data } = await dispatchPass(API.productionApi.querySampleData, params);
  return data || [];
}

/** 查询链接基金持仓详情 */
export async function queryLinkFund(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryLinkFund, params);
  return data || [];
}
