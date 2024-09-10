import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem {
  id: number;
  indexName: string;
  indexDesc: string;
  numberOfShards: number;
  numberOfReplicas: number;
  storeSize: string;
  docsCount: string;
  updateTime: Date;
}

// 索引状态查询
export async function QueryStatusByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.queryStatusByPage, params);
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

// es查询
export async function EsIndexDataInfoFacadeSearchIndexByJson(params = {}) {
  const data = await dispatchPass(API.investmentApi.EsIndexDataInfoFacadeSearchIndexByJson, params);
  return data || {};
}
