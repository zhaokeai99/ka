import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

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

export default {
  queryFundExaminePolicySummary,
  queryIndexDynamicSummary,
  queryMutualFundCollectSummary,
};
