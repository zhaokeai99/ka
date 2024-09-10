import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function updateUserInformation(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.updateUserInformation, params);
  return data || {};
}

export async function advisorQueryUserRemarkInfoByThUserId(params = {}) {
  const { data } = await dispatchPass(
    API.marketingApi.advisorQueryUserRemarkInfoByThUserId,
    params,
  );
  return data || {};
}

export async function advisorQueryUserAssetsDetails(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.advisorQueryUserAssetsDetails, params);
  return data || {};
}

export async function advisorQueryUserTransactionRecord(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.advisorQueryUserTransactionRecord, params);
  return data || {};
}

export async function queryCustomerIsNoDisturb(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryCustomerIsNoDisturb, params);
  return data || {};
}

export async function createPhoneTask(params = {}) {
  const { success } = await dispatchPass(API.marketingApi.createPhoneTask, params);
  return success;
}
