import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem {
  id: number;
  indexName: string;
  indexDesc: string;
  taskName: string;
  taskDesc: string;
  sourceType: number;
  taskStatus: number;
  publishStatus: number;
  docsCount: number;
}

// 索引状态查询
export async function QueryStatusByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.queryStatusByPage, params);
  return data || {};
}

// 索引状态查询
export async function EsDataSyncTaskFacadeQueryDataSyncTaskSimple(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsDataSyncTaskFacadeQueryDataSyncTaskSimple,
    params,
  );
  return data || {};
}

// 索引信息
export async function EsDataSyncTaskFacadeGetDataSyncTask(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsDataSyncTaskFacadeGetDataSyncTask,
    params,
  );
  return data || {};
}

// 执行cat
export async function EsIndexInfoFacadeExecuteCat(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexInfoFacadeExecuteCat, params);
  return data || '';
}

// 删除索引
export async function EsIndexInfoFacadeDeleteIndex(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexInfoFacadeDeleteIndex, params);
  return data || {};
}

// 执行任务
export async function EsIndexInfoFacadeRunIndexTask(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsIndexInfoFacadeRunIndexTask, params);
  return data || {};
}
// 执行任务
export async function EsIndexInfoFacadeQueryTaskManageByPage(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsIndexInfoFacadeQueryTaskManageByPage,
    params,
  );
  return data || {};
}
