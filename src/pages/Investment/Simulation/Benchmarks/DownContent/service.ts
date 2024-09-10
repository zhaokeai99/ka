import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem {
  id: number;
  typeCode: string;
  typeName: string;
  subTypeCode: string;
  subTypeName: string;
  orderNum: string;
  dataValue: string;
  remark: string;
  insertTimeFormat: string;
}

// 查询复合基准净值
export async function MpBmComplexNvQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmComplexNvQuery, params);
  return data || {};
}
export async function MpBmComplexQueryWithCloseByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmComplexQueryWithCloseByPage, params);
  return data || {};
}

// 列表
export async function tableQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQueryByPage, params);
  return data || {};
}
