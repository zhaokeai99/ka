import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

// es数据源查询接口
export async function ResearchReportDataFacadeGetOtherWebNewsInfo(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.ResearchReportDataFacadeGetOtherWebNewsInfo,
    params,
  );
  return data || {};
}

// es数据查询
export async function EsIndexDataInfoFacadeQueryEsDataByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsIndexDataInfoFacadeQueryEsDataByPage,
    params,
  );
  return data || {};
}
export async function EsIndexDataInfoFacadeQuerySimpleEsDataByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsIndexDataInfoFacadeQuerySimpleEsDataByPage,
    params,
  );
  return data || {};
}
// es.agg
export async function EsIndexDataInfoFacadeAggEsData(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexDataInfoFacadeAggEsData, params);
  return data || {};
}

// es数据总数
export async function EsIndexDataInfoFacadeCountRecord(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexDataInfoFacadeCountRecord, params);
  return data || {};
}

// 机构查询
export async function EsStockInfoFacadeQueryBrokerInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsStockInfoFacadeQueryBrokerInfo, params);
  return data || {};
}

// 证券查询
export async function EsStockInfoFacadeQueryStockInfo(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsStockInfoFacadeQueryStockInfo, params);
  return data || {};
}
