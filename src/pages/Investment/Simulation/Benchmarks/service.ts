import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

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
export async function MpBenchmarkQuery(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBenchmarkQuery, params);
  if (Array.isArray(data)) {
    // @ts-ignore
    return data.map(({ bmCode, bmName, domain, bmComment, bmType }) => ({
      label: bmName,
      value: bmCode,
      domain: domain,
      comment: bmComment,
      bmType: bmType,
    }));
  }
  return [];
}
