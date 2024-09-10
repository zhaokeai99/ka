import { API } from '@/services/api';
import { dispatchPass } from '@/services/service';

export interface TableListItem {
  id: number;
  domain: string;
  bmCode: string;
  bmType: number;
  bmName: string;
  stkCode: string;
  stkName: string;
  mtkCode: string;
  weight: number;
  insertTime: string;
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

// 查询自定义基准定义分页
export async function MpBmSelfdefQueryByPage(params = {}) {
  const { data } = await dispatchPass(API.investmentApi.MpBmSelfdefQueryByPage, params);
  return data || {};
}
