import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryCustomerIsNoDisturb(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryCustomerIsNoDisturb, params);
  return data || {};
}

export async function queryMotEventSmsTaskList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryMotEventSmsTaskList, params);
  return data || {};
}

export async function sendSms(params = {}) {
  const { success } = await dispatchPass(API.marketingApi.sendSms, params);
  return success;
}

export async function updateMotEventTaskSmsStatus(params = {}) {
  const { success } = await dispatchPass(API.marketingApi.updateMotEventTaskSmsStatus, params);
  return success;
}
