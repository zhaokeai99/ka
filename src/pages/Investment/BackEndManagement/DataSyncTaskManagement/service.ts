import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id: number;
  sourceType: string;
  sourceName: string;
  sourceDesc: string;
  jdbcUrl: string;
  userName: string;
  password: string;
  connectStatus: number;
  creator: string;
  updateTime: Date;
}

// es数据源查询接口
export async function EsIntegrationSourceQuery(params = {}) {
  return await dispatchPass(API.investmentApi.EsIntegrationSourceQuery, params);
}
// es查询数据及列信息
export async function EsIntegrationSourceFacadeRunSqlWithColumn(params = {}) {
  return await dispatchPass(API.investmentApi.EsIntegrationSourceFacadeRunSqlWithColumn, params);
}
// es查询表的列信息
export async function EsIntegrationSourceFacadeQueryColumnInfo(params = {}) {
  return await dispatchPass(API.investmentApi.EsIntegrationSourceFacadeQueryColumnInfo, params);
}
// es查询表的列信息
export async function EsIntegrationSourceFacadeQueryTableInfo(params = {}) {
  return await dispatchPass(API.investmentApi.EsIntegrationSourceFacadeQueryTableInfo, params);
}
// es查询表的列信息
export async function EsIntegrationSourceFacadeQueryTableInfoPart(params = {}) {
  return await dispatchPass(API.investmentApi.EsIntegrationSourceFacadeQueryTableInfoPart, params);
}
// es索引任务获取字典
export async function EsDataSyncTaskFacadeGetEsDic(params = {}) {
  return await dispatchPass(API.investmentApi.EsDataSyncTaskFacadeGetEsDic, params);
}
// es索引任务查询记录
export async function EsDataSyncTaskFacadeQueryDataSyncTask(params = {}) {
  return await dispatchPass(API.investmentApi.EsDataSyncTaskFacadeQueryDataSyncTask, params);
}
// es索引任务查询记录
export async function EsDataSyncTaskFacadeQueryDataSyncTaskSimple(params = {}) {
  return await dispatchPass(API.investmentApi.EsDataSyncTaskFacadeQueryDataSyncTaskSimple, params);
}
// es索引任务查询记录
export async function EsDataSyncTaskFacadeGetDataSyncTask(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsDataSyncTaskFacadeGetDataSyncTask,
    params,
  );
  return data || {};
}
// es索引任务保存
export async function EsDataSyncTaskFacadeSaveDataSyncTask(params = {}) {
  const { data } = await dispatchPass(
    API.investmentApi.EsDataSyncTaskFacadeSaveDataSyncTask,
    params,
  );
  return data || {};
}
// es索引任务获取字典
export async function EsDataSyncTaskFacadeCancelDataSyncTask(params = {}) {
  return await dispatchPass(API.investmentApi.EsDataSyncTaskFacadeCancelDataSyncTask, params);
}
// es索引任务发布
export async function EsDataSyncTaskFacadePublishDataSyncTask(params = {}) {
  return await dispatchPass(API.investmentApi.EsDataSyncTaskFacadePublishDataSyncTask, params);
}

// es索引任务放弃修改
export async function EsDataSyncTaskFacadeForgoDataSyncTask(params = {}) {
  return await dispatchPass(API.investmentApi.EsDataSyncTaskFacadeForgoDataSyncTask, params);
}
