import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

/** 渠道列表 */
export async function queryChannelList(params: any) {
  return await dispatchPass(API.marketingApi.queryChannelList, params);
}

/** 资产配置 */
export async function queryAgencyPurchaseConfig(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyPurchaseConfig, params);
}

/** 资产贡献度 */
export async function queryAgencyAssetConfig(params: any) {
  const { success, data } = await dispatchPass(API.marketingApi.queryAgencyAssetConfig, params);
  return (success && data?.map((i: any) => ({ name: i.fundTypeName, value: i.proportion }))) || [];
}

/** 资产变化 */
export async function queryAgencyList(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyList, params);
}

/** 存量趋势变化 */
export async function queryAgencyStockAmt(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyStockAmt, params);
}

/** 产品持仓 */
export async function queryAgencyFundList(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyFundList, params);
}

/** 资金配置 */
export async function queryFundAllocationList(params: any) {
  return await dispatchPass(API.marketingApi.queryFundAllocationList, params);
}

/** 时点模块相关查询 */
export async function queryAgencyStatistics(params: any) {
  const { success, data } = await dispatchPass(API.marketingApi.queryAgencyTotalStatistics, params);
  if (success) {
    return data;
  }
}

/** 合作伙伴资产贡献 */
export async function queryAssetsContribution(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyTotalKindStatistics, params);
}

/** 渠道基本信息查询 */
export async function queryChannelBasicInfo(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyBasicInfo, params);
}

/** 渠道分布-资产贡献度条形图 */
export async function queryAgencyTotalAssetConfig(params: any) {
  const { success, data } = await dispatchPass(
    API.marketingApi.queryAgencyTotalAssetConfig,
    params,
  );
  return (success && data?.map((i: any) => ({ name: i.fundTypeName, value: i.proportion }))) || [];
}

export async function queryAssetsInfo(params: any) {
  return await Promise.all([queryAssetsContribution(params), queryAgencyTotalAssetConfig(params)]);
}

// 渠道分布-下载
export async function queryAgencyListForExcel(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyListForExcel, params);
}

// 渠道详情-产品分布-下载
export async function queryAgencyFundTradeInfoForExcel(params: any) {
  return await dispatchPass(API.marketingApi.queryAgencyFundTradeInfoForExcel, params);
}
