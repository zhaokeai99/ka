import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function advisorQueryUserInfoList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.advisorQueryUserInfoList, params);
  return data || {};
}

export async function queryCertificateTypeList(params = {}) {
  const { data } = await dispatchPass(API.marketingApi.queryCertificateTypeList, params);
  return data || {};
}
