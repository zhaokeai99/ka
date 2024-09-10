import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

/** 基金列表 */
export async function queryFundList(params: any) {
  return await dispatchPass(API.marketingApi.queryFundList, params);
}

/** 基金概览-销售情况列表 */
export async function queryFundTableInfo(params: any) {
  return await dispatchPass(API.marketingApi.queryFundTableInfo, params);
}

/** 基金概览-销售情况趋势图 */
export async function queryFundChartInfo(params: any) {
  return await dispatchPass(API.marketingApi.queryFundChartInfo, params);
}

/** 基金定投-定投客户变化趋势 */
export async function queryCastSurelyLineInfo(params: any) {
  return await dispatchPass(API.marketingApi.queryCastSurelyLineInfo, params);
}

/** 基金定投-定投详情 */
export async function queryCastSurelyTableList(params: any) {
  return await dispatchPass(API.marketingApi.queryCastSurelyTableList, params);
}

/** 基金渠道-列表 */
export async function queryChannelTableList(params: any) {
  return await dispatchPass(API.marketingApi.queryChannelTableList, params);
}

/** 能力分析-盈利能力 */
export async function queryFundProfitability(params: any) {
  return await dispatchPass(API.marketingApi.queryFundProfitability, params);
}

/** 能力分析-平均收益率  */
export async function queryAverageRate(params: any) {
  return await dispatchPass(API.marketingApi.queryFundIncomeRate, params);
}

/** 渠道名称模糊查询 */
export async function queryChannelByCode(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryAgencyByName, params);
  return data;
}

/** 产品基本信息 */
export async function queryBIProductInfo(params: any) {
  return await dispatchPass(API.marketingApi.queryBIproductInfo, params);
}

/** 产品模糊查询 */
export async function queryFundByNameLike(params: any) {
  const { data } = await dispatchPass(API.marketingApi.queryFundByNameLike, params);
  return data;
}
