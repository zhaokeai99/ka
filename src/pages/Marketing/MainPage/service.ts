import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

/** 首页-指标卡片基本信息 */
export async function queryStatisticCardInfo(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryStatisticCardInfo, params);
  return data;
}

/** 首页-指标卡片图表数据 */
export async function queryStatisticChartsInfo(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryStatisticChartsInfo, params);
  return data;
}

/** 首页-申购赎回净申购柱状图 */
export async function queryCorpIntervalAmt(params: any) {
  return await dispatchPass(API.marketingApi.queryCorpIntervalAmt, params);
}

/** 非货公募-总数和环比  */
export async function queryFundInterval(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFundInterval, params);
  return data;
}

/** 非货公募热门产品-趋势图 */
export async function queryFundCharts(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFundDayInterval, params);
  return data;
}

/** 非货公募热门产品-交易列表 */
export async function queryHotFundList(params: any) {
  return await dispatchPass(API.marketingApi.queryFundIntervalTradeInfo, params);
}

/** 非货公募重点销售渠道-列表 */
export async function queryKeySalesFundList(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyIntervalTrade, params);
}

/** 非货公募销售类别占比 */
export async function querySalesCategoryInfo(params: any) {
  return await dispatchPass(API.marketingApi.queryVogAmt, params);
}

/** 在售产品数 */
export async function queryProductOnSale() {
  const { data } = await dispatchPass(API.marketingApi.statisticsFundByVogType);
  return data;
}

/** 获取实时数据 */
export async function queryAppIndicators(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryAppIndicators, params);
  return data;
}

export async function queryHotFundInfo(params: any) {
  return await Promise.all([
    queryFundInterval(params.baseParams),
    queryFundCharts(params.chartsParams),
  ]);
}

export async function queryCardInfo(params: any) {
  return await Promise.all([queryStatisticCardInfo(params), queryStatisticChartsInfo(params)]);
}

export const cardTips = {
  purchaseCumCnt: '累计值：非货公募的累计服务客户数量（包括个人客户，机构客户，产品户）',
  profitCumCnt:
    '累计值：非货公募今年以来盈利的客户数量（包括个人客户，机构客户，产品户）,周同比：相对于上周同一交易日的盈利客户数变化比率,日环比：相对于上个交易日的盈利客户数变化比率',
  stockAmt:
    '累计值：当前非货公募资产总规模（ETF联结基金和FOF基金没有剔除重复部分）,日均总规模变动：每天资产总规模变动的平均值',
  profitAmt:
    '累计值：非货公募产品今年以来为客户创造的收益,区间值：近一周每个交易日的区间收益,周同比：相对于上周同一交易日的收益变化比率,日环比：相对于上个交易日的收益变化比率',
  purchaseAmt:
    '累计值：非货公募产品今年以来申购金额,区间值：近一周每天的区间申购金额,周同比：相对于上周同一交易日的申购金额变化比率,日环比：相对于上个交易日的申购金额变化比率',
  redeemAmt:
    '累计值：非货公募产品今年以来赎回金额,区间值：近一周每个交易日的区间赎回金额,周同比：相对于上周同一交易日的赎回金额变化比率,日环比：相对于上个交易日的赎回金额变化比率',
  purchaseCnt:
    '累计值：非货公募产品今年以来申购笔数,区间值：近一周每个交易日的区间申购笔数,日均申购笔数：平均每个交易日的申购笔数',
  redeemCnt:
    '累计值：非货公募产品今年以来赎回笔数,区间值：近一周每个交易日的区间赎回笔数,日均赎回笔数：平均每个交易日的赎回笔数',
};
