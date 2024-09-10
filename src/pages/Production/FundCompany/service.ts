import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// 查询基金公司基础信息
export async function queryBaseInfo(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryBaseInfo, params);
  return data || [];
}

export async function queryCompanyScaleQuarterData(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryCompanyScaleQuarterData, params);
  return data;
}

// 查询基金公司新发产品信息列表
export async function queryNewFundPageList(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryNewFundPageList, params);
  return data || {};
}

// 查询基金公司存储产品信息列表
export async function queryHoldFundPageList(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryHoldFundPageList, params);
  return data || {};
}

// 查询基金公司基金经理信息列表
export async function queryFMPageList(params?: any) {
  const { data } = await dispatchPass(API.productionApi.queryFMPageList, params);
  return data || [];
}

// 搜索
export async function fuzzySearch(params: any) {
  const { data } = await dispatchPass(
    API.productionApi.fuzzyQueryFundCompanyListByCompName,
    params,
  );
  return data || [];
}

export async function queryCompanyAwardinfoLine() {
  const { data } = await dispatchPass(API.productionApi.queryCompanyAwardinfoLine);
  return data || [];
}
