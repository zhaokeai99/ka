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

// es数据源分页查询接口
export async function EsQueryIntegrationSourceByPage(params = {}) {
  return await dispatchPass(API.investmentApi.EsQueryIntegrationSourceByPage, params);
}

// es数据源查询接口
export async function EsIntegrationSourceQuery(params = {}) {
  return await dispatchPass(API.investmentApi.EsIntegrationSourceQuery, params);
}

// es数据源测试
export async function EsTestConn(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.EsTestConn, params);
  return data || {};
}

// es数据源创建
export async function EsAddIntegrationSource(params = {}) {
  return await dispatchPass(API.investmentApi.EsAddIntegrationSource, params);
}

// es数据源修改
export async function EsEditIntegrationSource(params = {}) {
  return await dispatchPass(API.investmentApi.EsEditIntegrationSource, params);
}

// es数据源删除
export async function EsDeleteIntegrationSource(params = {}) {
  return await dispatchPass(API.investmentApi.EsDeleteIntegrationSource, params);
}
