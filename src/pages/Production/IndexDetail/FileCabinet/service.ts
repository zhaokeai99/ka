import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryFileTypeAll(params = {}) {
  const { data } = await dispatchPass(API.productionApi.queryFileTypeAll, params);
  return data || [];
}

export async function queryFileInfoList(params: any) {
  const { data } = await dispatchPass(API.productionApi.queryFileInfoList, params);
  return data || {};
}
