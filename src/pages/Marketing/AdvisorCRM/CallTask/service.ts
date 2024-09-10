import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryCustomerIsNoDisturb(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryCustomerIsNoDisturb, params);
  return data || {};
}

export async function queryPhoneTaskList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryPhoneTaskList, params);
  return data || {};
}

export async function createPhoneTask(params = {}) {
  const { success } = await dispatchPass(API.marketingApi.createPhoneTask, params);
  return success;
}

export async function updatePhoneTaskList(params = {}) {
  const { success } = await dispatchPass(API.marketingApi.updatePhoneTaskList, params);
  return success;
}
