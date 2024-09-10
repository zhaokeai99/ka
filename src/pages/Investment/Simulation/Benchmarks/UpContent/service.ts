import React from 'react';
import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem {
  id: number;
  bmCode: string;
  bmName: string;
  domain: string;
  indexCode: string;
  indexName: number;
  weight: number;
  indexClassPath: string;
  indexSysName: string;
}

export type DataSourceType = {
  id: React.Key;
  indexCode?: string;
  indexName?: string;
  indexClassPath?: string;
  indexSysName?: string;
  weight?: number;
  securities?: any;
};

export async function MpBenchmarkQuerySecurities(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuerySecurities, params);
  return data || {};
}

// 查询复合基准
export async function MpBmComplexQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmComplexQuery, params);
  return data || {};
}
// 查询复合基准分页
export async function MpBmComplexQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmComplexQueryByPage, params);
  return data || {};
}

// 查询复合基准分页
export async function MpBmComplexNvQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmComplexNvQueryByPage, params);
  return data || {};
}

// 通过id删除复合基准
export async function MpBmComplexDelete(params = {}) {
  return await dispatchPass(API.investmentApi.MpBmComplexDelete, params);
}

// 批量添加
export async function MpBmComplexAddList(params = {}) {
  return await dispatchPass(API.investmentApi.MpBmComplexAddList, params);
}

// 批量修改
export async function MpBmComplexEditList(params = {}) {
  return await dispatchPass(API.investmentApi.MpBmComplexEditList, params);
}
