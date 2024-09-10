import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export const EMPTY_DESC = '该品种无此项记录，或数据不满足当前计算条件';

export async function getPanoramaFundInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaFundInfo, params);
  return data || {};
}

export async function getPanoramaFundLifeCycle(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaFundLifeCycle, params);
  return data || {};
}

export async function getPanoramaContractInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaContractInfo, params);
  return data;
}

export async function getPanoramaFeeInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaFeeInfo, params);
  return data;
}
export async function getFundManagerChangeInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getFundManagerChangeInfo, params);
  return data || [];
}

export async function getPanoramaDateInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaDateInfo, params);
  return data;
}

export async function getPanoramaStakeHolderInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.getPanoramaStakeHolderInfo, params);
  return data;
}

export async function queryProductTreeFundIdLabels(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryProductTreeFundIdLabels, params);
  return data;
}

export async function queryProcessRelatedList(params: any) {
  const { data, success } = await dispatchPass(API.productionApi.queryProcessRelatedList, params);
  const { dataList, total } = data || {};
  return {
    data: dataList || [],
    success,
    total,
  };
}

export async function queryFundDailyMarketBaseDate(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundDailyMarketBaseDate, params);
  return data;
}

export async function searchFundInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.searchFundInfo, params);
  return data;
}

export async function queryUserFocusFundStatus(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryUserFocusFundStatus, params);
  return data;
}

export async function saveUserFocusFund(params: any) {
  const { data } = await dispatchPass(API.productionApi.saveUserFocusFund, params);
  return data;
}

// 根据 fundCode 查询 fundId
export async function queryFundCodeToFundId(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundCodeToFundId, params);
  return data || {};
}

// 置顶标签查询
export async function queryTopMarks(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryTopMarks, params);
  return data || [];
}

// 全市场基金面板-基本信息
export async function queryAllMarketFundInfo(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryAllMarketFundInfo, params);
  return data || {};
}

// 全市场基金面板-持仓分析-资产配置
export async function queryFundHoldSharesPercent(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundHoldSharesPercent, params);
  return data || {};
}

// 全市场基金面板-持仓分析-规模变动、全市场基金面板-风险信息-最大回撤
export async function queryHistoryFundAssetAmt(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryHistoryFundAssetAmt, params);
  return data || [];
}

// 全市场基金面板-持仓分析-持有人结构
export async function queryFundHoldPercent(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundHoldPercent, params);
  return data || [];
}

// 全市场基金面板-持仓分析-行业暴露
export async function queryFundNavRegIndusData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundNavRegIndusData, params);
  return data || {};
}

// 全市场基金面板-持仓分析-择时&选股能力
export async function queryFundNavRegClModelData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundNavRegClModelData, params);
  return data || [];
}

// 全市场基金面板-持仓分析-FF三因子模型
export async function queryFundDetailNavRegff3ModelData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundDetailNavRegff3ModelData, params);
  return data || [];
}

// 全市场基金面板-持仓分析-基金仓位
export async function queryFundNavRegStockPosData(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFundNavRegStockPosData, params);
  return data || [];
}
