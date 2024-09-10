import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id: number;
  domain: string;
  bmCode: string;
  bmType: number;
  bmName: string;
  bmComment: string;
  insertTime: string;
}

// 业务域查询接口
export async function MpDomainQuery() {
  const { data } = await dispatchPass(API.investmentApi.MpDomainQuery);
  if (Array.isArray(data)) {
    return data.map(({ domain, domainName }) => ({
      label: domainName,
      value: domain,
    }));
  }
  return [];
}

// 基准信息查询
export async function MpBenchmarkQuery() {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuery);
  if (Array.isArray(data)) {
    // @ts-ignore
    return data.map(({ bmCode, bmName, domain }) => ({
      label: bmName,
      value: bmCode,
      domain: domain,
    }));
  }
  return [];
}

// 主基准查询
export async function queryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQueryByPage, params);
  return data || {};
}

// 主基准创建
export async function MpBenchmarkAdd(params = {}) {
  return await dispatchPass(API.investmentApi.MpBenchmarkAdd, params);
}

// 主基准修改
export async function MpBenchmarkEdit(params = {}) {
  return await dispatchPass(API.investmentApi.MpBenchmarkEdit, params);
}

// 主基准删除
export async function MpBenchmarkDelete(params = {}) {
  return await dispatchPass(API.investmentApi.MpBenchmarkDelete, params);
}
