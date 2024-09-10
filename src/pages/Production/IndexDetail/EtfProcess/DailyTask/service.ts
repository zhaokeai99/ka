import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export async function queryTaskList(params: any) {
  return await dispatchPass(API.productionApi.queryTaskList, params);
}
export async function queryTaskDetail(params: any) {
  return await dispatchPass(API.productionApi.queryTaskDetail, params);
}
