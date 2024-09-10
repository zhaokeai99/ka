import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryMyMotEventTaskList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMyMotEventTaskList, params);
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
