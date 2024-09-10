import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryMotEventContactInfo(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMotEventContactInfo, params);
  return data || {};
}
export async function queryTaskStatus(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryTaskStatus, params);
  return data || {};
}
export async function queryLastTaskHandleDetail(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryLastTaskHandleDetail, params);
  return data || {};
}
export async function submitProcessingResult(params = {}) {
  const { success } = await dispatchPass(API.marketingApi.submitProcessingResult, params);
  return success;
}
