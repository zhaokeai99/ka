import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryPdFundChangeInfo(params: any) {
  return await dispatchPass(API.productionApi.queryPdFundChangeInfo, params);
}

export async function queryFundPortPieChart() {
  const { success, data } = await dispatchPass(API.productionApi.queryFundPortPieChart);
  return success && data.dataList
    ? data.dataList.map((d) => ({
        name: d.name,
        value: parseInt(d.value),
      }))
    : [];
}

export async function queryFundExaminePolicySummary() {
  const { success, data } = await dispatchPass(API.productionApi.queryFundExaminePolicySummary);
  return success && data.dataList ? data.dataList : [];
}

export async function queryIndexDynamicSummary() {
  const { success, data } = await dispatchPass(API.productionApi.queryIndexDynamicSummary);
  return success && data.dataList ? data.dataList : [];
}

export async function queryMutualFundCollectSummary() {
  const { success, data } = await dispatchPass(API.productionApi.queryMutualFundCollectSummary);
  return success && data ? data : [];
}

export async function queryFundSurvivalProductType() {
  const { success, data } = await dispatchPass(API.productionApi.queryFundSurvivalProductType);
  return success && data ? data : [];
}

export async function fetchPageData() {
  return await Promise.all([
    queryFundPortPieChart(),
    queryIndexDynamicSummary(),
    queryFundExaminePolicySummary(),
    queryMutualFundCollectSummary(),
    queryFundSurvivalProductType(),
    queryFundSurvivalPieChart(),
  ]);
}

export async function pageHotProducts(params: any) {
  const result = await dispatchPass(API.productionApi.pageHotProducts, params);
  return result;
}

export async function linearHotProducts(params: any) {
  const { data } = await dispatchPass(API.productionApi.linearHotProducts, params);
  const { content = [] } = data || {};
  return content || [];
}

// 公募存续列表查询
export async function fundSurvivalProducts(params: any) {
  return await dispatchPass(API.productionApi.fundSurvivalProducts, params);
}

// 公募存续分布图
export async function queryFundSurvivalPieChart() {
  const { success, data } = await dispatchPass(API.productionApi.queryFundSurvivalPieChart);
  return success && data
    ? data.map((item: any) => ({
        name: item.label,
        value: parseInt(item.value),
      }))
    : [];
}

// 本月成立大事项查询接口
export async function queryEvents(params: any) {
  const data = await dispatchPass(API.productionApi.queryEvents, params);
  return data || [];
}

export const checkJumpUrl = (item: any) => {
  const { fundId, fundCode } = item || {};
  return fundCode
    ? `/production/index/newDetail/${fundCode}`
    : `/production/index/detail/${fundId}`;
};
