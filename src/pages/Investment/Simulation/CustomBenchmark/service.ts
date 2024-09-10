import { dispatchPass } from '@/services/service';
import { API } from '@/services/api';

export interface TableListItem1 {
  id: number;
  bmCode: string;
  bmName: string;
  domain: string;
  bmType: number;
  indexCode: string;
  indexName: string;
  indexSysName: string;
}
export interface TableListItem2 {
  id: number;
  close: number;
  indexClassPath: string;
  domain: string;
  bmType: number;
  indexCode: string;
  indexName: string;
  indexSysName: string;
  tradeDate: string;
}

// 查询市场指数
export async function MpBmMarketIndexQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuerySecurities, params);
  return data || [];
}

// 基准信息查询
export async function MpBenchmarkQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuery, params);
  if (Array.isArray(data)) {
    // @ts-ignore
    return data.map(({ bmCode, bmName }) => ({
      label: bmName,
      value: bmCode,
    }));
  }
  return [];
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
