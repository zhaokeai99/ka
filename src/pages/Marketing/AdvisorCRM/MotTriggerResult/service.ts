import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryMotEventTaskList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMotEventTaskList, params);
  return data || {};
}

export async function queryMotEventOptions(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMotEventOptions, params);
  return data || {};
}

export async function queryTaskStatus(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryTaskStatus, params);
  return data || {};
}

export async function queryTriggerAction(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryTriggerAction, params);
  return data || {};
}

export async function queryFinancialAdvisorList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryFinancialAdvisorList, params);
  return data || {};
}
